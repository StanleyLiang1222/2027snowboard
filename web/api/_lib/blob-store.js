// 真正的儲存實作：Vercel Blob。照片各自一個 blob，另有一份 gallery/index.json 記錄順序與說明。
import { put, del, list } from "@vercel/blob";
import { emptyIndex } from "./gallery-core.js";

const INDEX_PATH = "gallery/index.json";

export const blobStore = {
  async readIndex() {
    const { blobs } = await list({ prefix: INDEX_PATH, limit: 1 });
    if (blobs.length === 0) return emptyIndex();
    // 加時間參數避開 CDN 快取，確保讀到最新的索引
    const res = await fetch(`${blobs[0].url}?t=${Date.now()}`, { cache: "no-store" });
    if (!res.ok) throw new Error(`讀取索引失敗：${res.status}`);
    const data = await res.json();
    return Array.isArray(data.photos) ? data : emptyIndex();
  },

  async writeIndex(index) {
    await put(INDEX_PATH, JSON.stringify(index), {
      access: "public",
      contentType: "application/json",
      addRandomSuffix: false,
      allowOverwrite: true,
      cacheControlMaxAge: 60,
    });
  },

  async putPhoto(pathname, buffer, contentType) {
    const blob = await put(pathname, buffer, { access: "public", contentType, addRandomSuffix: true });
    return blob.url;
  },

  async deletePhoto(url) {
    await del(url);
  },
};
