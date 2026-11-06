const TONE_COLOR = {
  dark: "#171721",
  light: "#f5f2ea",
};

// smoothstep 緩動：兩端變化慢、中段變化快，避免線性漸層在頭尾出現看得到的「折線」。
const STOPS = [0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1];
const ease = (t) => t * t * (3 - 2 * t);

function easedGradient(from, to) {
  const stops = STOPS.map((t) => {
    const mix = Math.round(ease(t) * 1000) / 10;
    return `color-mix(in oklab, ${to} ${mix}%, ${from}) ${t * 100}%`;
  });
  return `linear-gradient(to bottom, ${stops.join(", ")})`;
}

// 深淺分區之間的漸變過渡帶：一張深→淺的緩動漸層，接縫兩端與上下區塊底色完全一致。
export function ToneTransition({ from, to }) {
  return (
    <div
      aria-hidden="true"
      className="tone-transition-strip"
      style={{ background: easedGradient(TONE_COLOR[from], TONE_COLOR[to]) }}
    />
  );
}
