import { useMemo } from "react";

const FLAKE_COUNT = 40;

function randomFlakes() {
  return Array.from({ length: FLAKE_COUNT }, (_, i) => {
    const size = 2 + Math.random() * 3;
    return {
      id: i,
      left: `${Math.random() * 100}%`,
      size,
      opacity: 0.25 + Math.random() * 0.35,
      duration: `${10 + Math.random() * 14}s`,
      delay: `${-Math.random() * 20}s`,
      drift: `${(Math.random() - 0.5) * 80}px`,
    };
  });
}

// 全站固定的飄雪氛圍效果：position:fixed 不隨頁面捲動，裝飾用途、不阻擋互動。
export function Snowfall() {
  const flakes = useMemo(randomFlakes, []);

  return (
    <div className="snowfall" aria-hidden="true">
      {flakes.map((f) => (
        <span
          key={f.id}
          className="snowflake"
          style={{
            left: f.left,
            width: f.size,
            height: f.size,
            opacity: f.opacity,
            animationDuration: f.duration,
            animationDelay: f.delay,
            "--drift": f.drift,
          }}
        />
      ))}
    </div>
  );
}
