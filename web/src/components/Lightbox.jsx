import { useCallback, useEffect, useRef } from "react";
import { createPortal } from "react-dom";

// 點照片後的全螢幕瀏覽：← → 切換、Esc 關閉、手機左右滑動切換、背景點一下關閉。
// 用 portal 掛到 body，才不會吃到所在區塊的淺色 data-tone。
export function Lightbox({ photos, index, onClose, onIndexChange }) {
  const closeRef = useRef(null);
  const touchStartX = useRef(null);
  const count = photos.length;

  const go = useCallback(
    (step) => onIndexChange((index + step + count) % count),
    [index, count, onIndexChange],
  );

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "Escape") onClose();
      else if (e.key === "ArrowLeft") go(-1);
      else if (e.key === "ArrowRight") go(1);
    };
    window.addEventListener("keydown", onKey);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeRef.current?.focus();
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [go, onClose]);

  // 預先載入前後一張，切換時不會閃一下空白
  useEffect(() => {
    [photos[(index + 1) % count], photos[(index - 1 + count) % count]].forEach((p) => {
      if (p) new Image().src = p.url;
    });
  }, [index, count, photos]);

  const photo = photos[index];
  if (!photo) return null;

  const navButton =
    "absolute top-1/2 hidden h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full bg-obsidian-button/80 text-xl text-ivory-text hover:bg-obsidian-button focus-visible:outline-2 focus-visible:outline-cobalt sm:flex";

  return createPortal(
    <div
      role="dialog"
      aria-modal="true"
      aria-label="照片瀏覽"
      className="fixed inset-0 z-50 flex flex-col bg-onyx-canvas/95 text-ivory-text"
      onClick={onClose}
      onTouchStart={(e) => (touchStartX.current = e.touches[0].clientX)}
      onTouchEnd={(e) => {
        if (touchStartX.current === null) return;
        const dx = e.changedTouches[0].clientX - touchStartX.current;
        touchStartX.current = null;
        if (Math.abs(dx) > 50 && count > 1) go(dx > 0 ? -1 : 1);
      }}
    >
      <div className="flex items-center justify-between px-5 py-4 text-sm text-ash-text">
        <span>
          {index + 1} / {count}
        </span>
        <button
          ref={closeRef}
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onClose();
          }}
          className="rounded-buttons border border-mist-border/40 px-4 py-1.5 text-ivory-text hover:bg-obsidian-button focus-visible:outline-2 focus-visible:outline-cobalt"
        >
          關閉
        </button>
      </div>

      <div className="relative flex min-h-0 flex-1 items-center justify-center px-4 sm:px-16">
        <img
          src={photo.url}
          alt={photo.caption || `第 ${index + 1} 張照片`}
          className="max-h-full max-w-full rounded-cards object-contain"
          onClick={(e) => e.stopPropagation()}
        />
        {count > 1 && (
          <>
            <button
              type="button"
              aria-label="上一張"
              className={`${navButton} left-4`}
              onClick={(e) => {
                e.stopPropagation();
                go(-1);
              }}
            >
              ‹
            </button>
            <button
              type="button"
              aria-label="下一張"
              className={`${navButton} right-4`}
              onClick={(e) => {
                e.stopPropagation();
                go(1);
              }}
            >
              ›
            </button>
          </>
        )}
      </div>

      <p className="min-h-14 px-5 py-4 text-center text-sm text-ash-text" onClick={(e) => e.stopPropagation()}>
        {photo.caption}
      </p>
    </div>,
    document.body,
  );
}
