import { useEffect, useMemo, useRef, useState } from "react";
import { overview } from "../data/itinerary";
import { Card } from "../components/Card";
import { PhotoSlot } from "../components/PhotoSlot";

const DESKTOP_QUERY = "(min-width: 640px)";
const PIN_RANGE_VH = 200; // 影片「播放進度」對應的可捲動距離
const TOTAL_HEIGHT_VH = PIN_RANGE_VH + 100;

const TITLE_CLASS =
  "font-display max-w-3xl text-4xl font-medium leading-[1.15] tracking-[0.01em] text-ivory-text sm:text-5xl lg:text-6xl";

function HeroTitleBlock({ style }) {
  return (
    <div className="mx-auto max-w-(--width-page-max) px-5" style={style}>
      <p className="mb-3 text-xs font-semibold uppercase tracking-[0.16em] text-champagne-gold">
        {overview.dateRange}・{overview.duration}
      </p>
      <h1 className={TITLE_CLASS}>{overview.title}</h1>
      <p className="mt-3 text-lg text-ash-text">
        {overview.subtitle}・{overview.members}
      </p>
      <p className="mt-6 max-w-2xl text-base leading-relaxed text-ivory-text/90">
        {overview.route.join(" → ")}
      </p>
    </div>
  );
}

// 標題逐字分段浮現：捲動進度越多，顯示的字越多，不是整句一次淡入。
// 完全浮現後就維持顯示到底，不會再淡出。
function StaggeredTitle({ text, progress, fadeStart, fadeEnd }) {
  const chars = useMemo(() => Array.from(text), [text]);
  const n = chars.length;
  const fadeSpan = fadeEnd - fadeStart;

  return (
    <h1 className={TITLE_CLASS}>
      {chars.map((ch, i) => {
        const charStart = fadeStart + (i / n) * fadeSpan * 0.7;
        const charEnd = charStart + fadeSpan * 0.3;
        const opacity =
          charEnd > charStart ? Math.min(1, Math.max(0, (progress - charStart) / (charEnd - charStart))) : 1;
        const reveal = opacity;
        return (
          <span
            key={i}
            style={{
              display: "inline-block",
              opacity,
              transform: `translateY(${(1 - reveal) * 10}px)`,
            }}
          >
            {ch === " " ? " " : ch}
          </span>
        );
      })}
    </h1>
  );
}

function HeroInfoCards() {
  return (
    <div className="mx-auto max-w-(--width-page-max) px-5">
      <div className="grid gap-4 sm:grid-cols-3">
        {overview.highlights.map((h) => (
          <Card key={h.title} className="p-5 sm:p-6">
            <h3 className="font-display text-lg font-semibold text-champagne-gold">{h.title}</h3>
            <p className="mt-2 text-sm leading-relaxed text-ash-text">{h.desc}</p>
          </Card>
        ))}
      </div>

      <Card className="mt-6 grid gap-4 p-5 text-sm sm:grid-cols-3 sm:p-6">
        <div>
          <p className="text-xs uppercase tracking-wide text-ash-text">預估氣溫</p>
          <p className="mt-1 leading-relaxed text-ivory-text/90">{overview.weather.temp}</p>
        </div>
        <div>
          <p className="text-xs uppercase tracking-wide text-ash-text">日落時間</p>
          <p className="mt-1 leading-relaxed text-ivory-text/90">{overview.weather.sunset}</p>
        </div>
        <div>
          <p className="text-xs uppercase tracking-wide text-ash-text">穿搭建議</p>
          <p className="mt-1 leading-relaxed text-ivory-text/90">{overview.weather.outfit}</p>
        </div>
      </Card>
    </div>
  );
}

// 手機版／影片載入失敗時的退回版本：靜態照片 + 一次到位顯示全部內容。
function StaticHero() {
  return (
    <section
      id="overview"
      className="relative flex min-h-[92vh] items-end overflow-hidden bg-onyx-canvas pt-24"
    >
      <div className="absolute inset-0">
        <PhotoSlot slug="hero-snow-scenery" alt="雪景" aspect="aspect-auto" className="h-full w-full rounded-none" />
        <div className="absolute inset-0 bg-gradient-to-t from-onyx-canvas via-onyx-canvas/70 to-onyx-canvas/20" />
      </div>
      <div className="relative z-10 w-full pb-14">
        <HeroTitleBlock />
        <div className="mt-10">
          <HeroInfoCards />
        </div>
      </div>
    </section>
  );
}

// 桌機版：200vh 的 pinned 捲動區，影片的播放進度直接綁定捲動位置
// （捲多少、影片播放到第幾秒，不是自動播放），做出「鏡頭往雪山深處推進」的效果。
// 標題文字在進度到一定程度時逐字淡入（抵達感），之後維持顯示不再淡出，
// 直到 pinned 區結束才放開進入正文卡片。
function CinematicHero({ onVideoUnavailable }) {
  const wrapperRef = useRef(null);
  const videoRef = useRef(null);
  const durationRef = useRef(0);
  const [textOpacity, setTextOpacity] = useState(0);
  const [titleProgress, setTitleProgress] = useState(0);

  useEffect(() => {
    const el = wrapperRef.current;
    const video = videoRef.current;
    if (!el || !video) return;

    function onScroll() {
      const rect = el.getBoundingClientRect();
      const total = el.offsetHeight - window.innerHeight;
      const scrolled = -rect.top;
      const p = total > 0 ? Math.min(1, Math.max(0, scrolled / total)) : 0;
      setTitleProgress(p);

      if (durationRef.current > 0) {
        video.currentTime = p * durationRef.current;
      }

      let opacity = 0;
      if (p < 0.15) opacity = 0;
      else if (p < 0.35) opacity = (p - 0.15) / 0.2;
      else opacity = 1;
      setTextOpacity(Math.max(0, Math.min(1, opacity)));
    }

    function onLoadedMetadata() {
      durationRef.current = video.duration;
      onScroll();
    }

    video.addEventListener("loadedmetadata", onLoadedMetadata);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      video.removeEventListener("loadedmetadata", onLoadedMetadata);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  return (
    <>
      <section
        id="overview"
        ref={wrapperRef}
        className="relative"
        style={{ height: `${TOTAL_HEIGHT_VH}vh` }}
      >
        <div className="sticky top-0 h-screen overflow-hidden bg-onyx-canvas">
          <video
            ref={videoRef}
            muted
            playsInline
            preload="auto"
            poster="/images/hero-snow-scenery.jpg"
            onError={() => onVideoUnavailable?.()}
            className="absolute inset-0 h-full w-full object-cover"
            aria-label="雪山纜車前進"
          >
            <source src="/videos/hero-cable-car.mp4" type="video/mp4" />
          </video>
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-onyx-canvas via-onyx-canvas/40 to-onyx-canvas/10" />
          <div className="pointer-events-none absolute inset-x-0 bottom-0 z-10 pb-16 sm:pb-24">
            <div className="mx-auto max-w-(--width-page-max) px-5">
              <p
                className="mb-3 text-xs font-semibold uppercase tracking-[0.16em] text-champagne-gold"
                style={{ opacity: textOpacity }}
              >
                {overview.dateRange}・{overview.duration}
              </p>
              <StaggeredTitle text={overview.title} progress={titleProgress} fadeStart={0.15} fadeEnd={0.35} />
              <p className="mt-3 text-lg text-ash-text" style={{ opacity: textOpacity }}>
                {overview.subtitle}・{overview.members}
              </p>
              <p
                className="mt-6 max-w-2xl text-base leading-relaxed text-ivory-text/90"
                style={{ opacity: textOpacity }}
              >
                {overview.route.join(" → ")}
              </p>
            </div>
          </div>
        </div>
      </section>

      <div className="bg-onyx-canvas px-0 pb-14 pt-10 sm:pt-14">
        <HeroInfoCards />
      </div>
    </>
  );
}

export function Hero() {
  const [mode, setMode] = useState(null);

  useEffect(() => {
    const isDesktop = window.matchMedia(DESKTOP_QUERY).matches;
    setMode(isDesktop ? "video" : "static");
  }, []);

  if (mode === null) return null;
  return mode === "video" ? <CinematicHero onVideoUnavailable={() => setMode("static")} /> : <StaticHero />;
}
