// 相簿的純邏輯（不碰任何儲存服務），方便用記憶體版 store 測試。
// 規則：依地點（見 locations.js）分類、每個地點最多 10 張，只有輸入正確密碼的人可以新增／編輯／刪除。
import { createHash, timingSafeEqual, randomUUID } from "node:crypto";
import { LOCATIONS } from "./locations.js";

export const MAX_PER_LOCATION = 10;
export const MAX_BODY_BYTES = 4 * 1024 * 1024; // Vercel 函式請求大小上限是 4.5MB，留一點餘裕
export const MAX_CAPTION_LENGTH = 80;
const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp"];

export class HttpError extends Error {
  constructor(status, message) {
    super(message);
    this.status = status;
  }
}

function sha256(value) {
  return createHash("sha256").update(String(value)).digest();
}

// 密碼比對前先正規化：去掉前後空白（Vercel 貼上值時常多帶空白或換行）、
// 全形轉半形（NFKC），避免「看起來一樣卻比對失敗」。
export function normalizePassword(value) {
  return String(value ?? "").normalize("NFKC").trim();
}

// 前端會把密碼 encodeURIComponent 後放進 header（HTTP header 不能直接放中文等非 ASCII 字元）。
export function decodePasswordHeader(value) {
  if (value == null) return "";
  try {
    return decodeURIComponent(value);
  } catch {
    return String(value);
  }
}

export function passwordMatches(provided, expected) {
  const want = normalizePassword(expected);
  if (!want) return false;
  return timingSafeEqual(sha256(normalizePassword(provided)), sha256(want));
}

export function parseLocation(value) {
  if (!LOCATIONS.some((l) => l.id === value)) {
    throw new HttpError(400, `location 必須是：${LOCATIONS.map((l) => l.id).join("、")}`);
  }
  return value;
}

export function cleanCaption(value) {
  return String(value ?? "").trim().slice(0, MAX_CAPTION_LENGTH);
}

export function emptyIndex() {
  return { photos: [] };
}

export function groupByLocation(index) {
  const groups = {};
  for (const l of LOCATIONS) groups[l.id] = [];
  for (const p of index.photos) {
    if (groups[p.location]) groups[p.location].push({ id: p.id, url: p.url, caption: p.caption, createdAt: p.createdAt });
  }
  for (const id of Object.keys(groups)) groups[id].sort((a, b) => a.createdAt - b.createdAt);
  return groups;
}

export function countForLocation(index, location) {
  return index.photos.filter((p) => p.location === location).length;
}

export function assertImageType(contentType) {
  const type = String(contentType ?? "").split(";")[0].trim().toLowerCase();
  if (!ALLOWED_TYPES.includes(type)) {
    throw new HttpError(415, "只接受 JPEG、PNG、WebP 圖片");
  }
  return type;
}

export function extensionFor(type) {
  return type === "image/png" ? "png" : type === "image/webp" ? "webp" : "jpg";
}

export function makePhoto({ location, url, caption, now = Date.now() }) {
  return { id: randomUUID(), location, url, caption: cleanCaption(caption), createdAt: now };
}

export function findPhoto(index, id) {
  const photo = index.photos.find((p) => p.id === id);
  if (!photo) throw new HttpError(404, "找不到這張照片");
  return photo;
}

// 純邏輯 handler：接收已經解析好的請求資訊，回傳 { status, body }，不依賴 Node req/res。
export function createGalleryService({ store, password }) {
  function requireAuth(headers) {
    if (!normalizePassword(password)) throw new HttpError(503, "相簿尚未設定管理密碼（ADMIN_PASSWORD）");
    if (!passwordMatches(decodePasswordHeader(headers["x-admin-password"]), password)) {
      throw new HttpError(401, "密碼錯誤");
    }
  }

  return async function handle({ method, query, headers, body }) {
    try {
      if (method === "GET") {
        const index = await store.readIndex();
        return { status: 200, body: { locations: groupByLocation(index), maxPerLocation: MAX_PER_LOCATION } };
      }

      requireAuth(headers);

      if (method === "POST" && query.action === "verify") {
        return { status: 200, body: { ok: true } };
      }

      if (method === "POST") {
        const location = parseLocation(query.location);
        const type = assertImageType(headers["content-type"]);
        if (!body || body.length === 0) throw new HttpError(400, "沒有收到圖片資料");
        if (body.length > MAX_BODY_BYTES) throw new HttpError(413, "圖片太大（上限 4MB），請先壓縮");
        const index = await store.readIndex();
        if (countForLocation(index, location) >= MAX_PER_LOCATION) {
          const name = LOCATIONS.find((l) => l.id === location).name;
          throw new HttpError(409, `${name}已經有 ${MAX_PER_LOCATION} 張，請先刪除再上傳`);
        }
        const url = await store.putPhoto(`gallery/${location}/photo.${extensionFor(type)}`, body, type);
        const photo = makePhoto({ location, url, caption: query.caption });
        index.photos.push(photo);
        await store.writeIndex(index);
        return { status: 201, body: { photo: { id: photo.id, url: photo.url, caption: photo.caption, createdAt: photo.createdAt, location } } };
      }

      if (method === "PATCH") {
        const index = await store.readIndex();
        const photo = findPhoto(index, body?.id);
        photo.caption = cleanCaption(body?.caption);
        await store.writeIndex(index);
        return { status: 200, body: { id: photo.id, caption: photo.caption } };
      }

      if (method === "DELETE") {
        const index = await store.readIndex();
        const photo = findPhoto(index, query.id);
        index.photos = index.photos.filter((p) => p.id !== photo.id);
        await store.writeIndex(index); // 先改索引：就算刪檔失敗，網頁上也不會留下壞掉的照片
        await store.deletePhoto(photo.url);
        return { status: 200, body: { id: photo.id } };
      }

      throw new HttpError(405, "不支援的請求方法");
    } catch (err) {
      if (err instanceof HttpError) return { status: err.status, body: { error: err.message } };
      console.error("[gallery]", err);
      return { status: 500, body: { error: "伺服器發生錯誤，請稍後再試" } };
    }
  };
}
