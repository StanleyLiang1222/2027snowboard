// 相簿前端 API：對應 api/gallery.js。照片上傳前先在瀏覽器壓縮，避免超過 Vercel 4.5MB 請求上限。
const ENDPOINT = "/api/gallery";
const PASSWORD_KEY = "gallery-admin-password";
const MAX_EDGE = 1920;
const MAX_UPLOAD_BYTES = 4 * 1024 * 1024;

export function getSavedPassword() {
  try {
    return sessionStorage.getItem(PASSWORD_KEY) ?? "";
  } catch {
    return "";
  }
}

export function savePassword(password) {
  try {
    if (password) sessionStorage.setItem(PASSWORD_KEY, password);
    else sessionStorage.removeItem(PASSWORD_KEY);
  } catch {
    /* 無痕模式等情況存不了就算了，這次連線內仍可使用 */
  }
}

async function request(url, options = {}) {
  let res;
  try {
    res = await fetch(url, options);
  } catch {
    throw new Error("連不到伺服器，請檢查網路");
  }
  let data = null;
  try {
    data = await res.json();
  } catch {
    /* 不是 JSON，例如本機開發環境沒有 /api */
  }
  if (!res.ok || !data) {
    const error = new Error(data?.error ?? (res.ok ? "相簿服務沒有回應（可能尚未部署）" : `請求失敗（${res.status}）`));
    error.status = res.status;
    throw error;
  }
  return data;
}

export const fetchGallery = () => request(ENDPOINT, { cache: "no-store" });

export const verifyPassword = (password) =>
  request(`${ENDPOINT}?action=verify`, { method: "POST", headers: { "x-admin-password": password } });

export async function uploadPhoto({ location, file, caption = "", password }) {
  const blob = await compressImage(file);
  const query = new URLSearchParams({ location, caption });
  return request(`${ENDPOINT}?${query}`, {
    method: "POST",
    headers: { "x-admin-password": password, "content-type": blob.type },
    body: blob,
  });
}

export const updateCaption = ({ id, caption, password }) =>
  request(ENDPOINT, {
    method: "PATCH",
    headers: { "x-admin-password": password, "content-type": "application/json" },
    body: JSON.stringify({ id, caption }),
  });

export const deletePhoto = ({ id, password }) =>
  request(`${ENDPOINT}?id=${encodeURIComponent(id)}`, {
    method: "DELETE",
    headers: { "x-admin-password": password },
  });

function canvasToBlob(canvas, quality) {
  return new Promise((resolve) => canvas.toBlob(resolve, "image/jpeg", quality));
}

// 縮到長邊 1920px、轉 JPEG；依 EXIF 轉正方向。超過上限就逐步降畫質。
export async function compressImage(file) {
  let bitmap;
  try {
    bitmap = await createImageBitmap(file, { imageOrientation: "from-image" });
  } catch {
    throw new Error(`無法讀取「${file.name}」（HEIC 請先轉成 JPEG，或用 iPhone 設定「最相容」格式）`);
  }
  const scale = Math.min(1, MAX_EDGE / Math.max(bitmap.width, bitmap.height));
  const canvas = document.createElement("canvas");
  canvas.width = Math.round(bitmap.width * scale);
  canvas.height = Math.round(bitmap.height * scale);
  const ctx = canvas.getContext("2d");
  ctx.fillStyle = "#ffffff"; // PNG 透明底轉 JPEG 時墊白底
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.drawImage(bitmap, 0, 0, canvas.width, canvas.height);
  bitmap.close?.();

  for (const quality of [0.85, 0.75, 0.65, 0.5]) {
    const blob = await canvasToBlob(canvas, quality);
    if (blob && blob.size <= MAX_UPLOAD_BYTES) return blob;
  }
  throw new Error(`「${file.name}」壓縮後仍太大，請換較小的圖片`);
}
