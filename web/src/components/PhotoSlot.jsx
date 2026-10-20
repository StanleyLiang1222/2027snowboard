import { useState } from "react";

// 圖片插槽：有指定 src 就用該路徑（中文檔名會自動編碼），否則讀取 /public/images/<slug>.jpg；
// 找不到檔案時自動退回漸層佔位背景。
// 妳之後只要把對應命名的照片放進 public/images/ 資料夾即可自動換上。
export function PhotoSlot({ slug, src, alt, className = "", aspect = "aspect-4/3" }) {
  const [failed, setFailed] = useState(false);

  if (failed) {
    return (
      <div
        className={`${aspect} ${className} rounded-cards bg-gradient-to-br from-graphite-card via-obsidian-button to-onyx-canvas relative overflow-hidden`}
      >
        <div className="absolute inset-0 bg-gradient-to-t from-cobalt/10 via-transparent to-champagne-gold/10" />
        <span className="absolute bottom-3 left-4 text-xs text-ash-text/70">待補照片・{alt}</span>
      </div>
    );
  }

  return (
    <img
      src={src ? encodeURI(src) : `/images/${slug}.jpg`}
      alt={alt}
      onError={() => setFailed(true)}
      className={`${aspect} ${className} rounded-cards object-cover w-full grayscale-[15%] brightness-90 saturate-75`}
    />
  );
}
