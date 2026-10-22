// Vercel Serverless Function：/api/gallery
//   GET                      → 取得全部照片（公開）
//   POST ?action=verify      → 驗證密碼
//   POST ?location=ID&caption=... → 上傳一張（body 是圖片二進位）
//   PATCH  {id, caption}     → 編輯說明
//   DELETE ?id=...           → 刪除
// 需要環境變數：BLOB_READ_WRITE_TOKEN（建立 Blob 儲存後自動產生）、ADMIN_PASSWORD（編輯密碼）。
import { createGalleryService, MAX_BODY_BYTES } from "./_lib/gallery-core.js";
import { blobStore } from "./_lib/blob-store.js";

async function readBody(req) {
  const chunks = [];
  let size = 0;
  for await (const chunk of req) {
    size += chunk.length;
    if (size > MAX_BODY_BYTES + 1024) return Buffer.alloc(MAX_BODY_BYTES + 2); // 超量，交給 core 回 413
    chunks.push(chunk);
  }
  return Buffer.concat(chunks);
}

export default async function handler(req, res) {
  const url = new URL(req.url, "http://localhost");
  const query = Object.fromEntries(url.searchParams);
  const headers = req.headers;

  let body = null;
  if (req.method === "POST" && query.action !== "verify") {
    body = await readBody(req);
  } else if (req.method === "PATCH") {
    try {
      body = JSON.parse((await readBody(req)).toString("utf8") || "{}");
    } catch {
      res.status(400).json({ error: "請求格式錯誤" });
      return;
    }
  }

  const service = createGalleryService({ store: blobStore, password: process.env.ADMIN_PASSWORD });
  const { status, body: payload } = await service({ method: req.method, query, headers, body });
  res.setHeader("Cache-Control", "no-store");
  res.status(status).json(payload);
}
