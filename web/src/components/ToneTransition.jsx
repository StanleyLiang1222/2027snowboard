const TONE_COLOR = {
  dark: "#171721",
  light: "#f5f2ea",
};

// 深淺分區之間的漸變過渡帶：背景是一張深→淺的線性漸層圖，同一瞬間畫面上就有
// 真正的空間漸變（不是整塊背景色切換，不會出現實心色塊的硬邊界）。
// 過渡帶本身用 clip-path scroll-driven animation 隨捲動位置由上往下撐開顯露。
export function ToneTransition({ from, to }) {
  return (
    <div
      aria-hidden="true"
      className="tone-transition-strip"
      style={{ background: `linear-gradient(to bottom, ${TONE_COLOR[from]}, ${TONE_COLOR[to]})` }}
    />
  );
}
