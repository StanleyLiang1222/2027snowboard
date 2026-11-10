import { lazy, Suspense, useEffect, useRef, useState } from "react";
import { spots, fukuiFood, omichoFood } from "../data/itinerary";
import { SectionContainer } from "../components/SectionContainer";
import { Card } from "../components/Card";
import { PhotoSlot } from "../components/PhotoSlot";
import { ThemeBadge, PendingBadge } from "../components/Badge";
import { GoogleMapsLink } from "../components/GoogleMapsLink";

const THEME_LABEL = { dino: "恐龍探索", gold: "金箔手作", family: "親子景點" };

// MapLibre 套件約 1MB，拆成獨立 chunk，等雪道圖快捲進畫面才下載與初始化。
const SkiTrailMap = lazy(() => import("../components/SkiTrailMap"));

const PISTE_LEGEND = [
  { label: "初級", className: "bg-piste-easy" },
  { label: "中級", className: "bg-piste-intermediate" },
  { label: "上級", className: "bg-piste-advanced" },
  { label: "吊椅／魔毯", className: "bg-piste-lift" },
  { label: "キッズパーク", className: "bg-champagne-gold" },
];

function MapPlaceholder({ children }) {
  return (
    <div className="flex aspect-4/5 w-full items-center justify-center rounded-cards bg-obsidian-button text-sm text-ash-text sm:aspect-16/9">
      {children}
    </div>
  );
}

function LazyTrailMap() {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          io.disconnect();
        }
      },
      { rootMargin: "400px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div ref={ref}>
      {visible ? (
        <Suspense fallback={<MapPlaceholder>3D 雪道圖載入中…</MapPlaceholder>}>
          <SkiTrailMap />
        </Suspense>
      ) : (
        <MapPlaceholder>3D 雪道圖</MapPlaceholder>
      )}
    </div>
  );
}

function SpotDetails({ spot }) {
  return (
    <div className="grid gap-3 border-t border-mist-border/15 pt-4 text-sm">
      <div>
        <p className="text-xs uppercase tracking-wide text-ash-text">交通指引</p>
        <p className="mt-1 text-ivory-text/90">{spot.transport}</p>
      </div>
      <div className="flex flex-wrap gap-x-6 gap-y-2">
        <div>
          <p className="text-xs uppercase tracking-wide text-ash-text">開放時間</p>
          <div className="mt-1">{spot.hours ? <p>{spot.hours}</p> : <PendingBadge />}</div>
        </div>
        <div>
          <p className="text-xs uppercase tracking-wide text-ash-text">門票費用</p>
          <div className="mt-1">{spot.price ? <p>{spot.price}</p> : <PendingBadge />}</div>
        </div>
      </div>
      <div>
        <p className="text-xs uppercase tracking-wide text-ash-text">冬季提醒</p>
        <p className="mt-1 text-ivory-text/90">{spot.winterNote}</p>
      </div>
    </div>
  );
}

function SpotHeader({ spot }) {
  return (
    <div className="flex items-start justify-between gap-3">
      <div>
        <h4 className="font-display text-lg font-medium text-ivory-text">{spot.name}</h4>
        {spot.nameEn && <p className="text-xs text-ash-text">{spot.nameEn}</p>}
        {spot.base && <p className="mt-1 text-xs text-ash-text">{spot.base}</p>}
      </div>
      <ThemeBadge theme={spot.theme}>{spot.badge ?? THEME_LABEL[spot.theme] ?? "景點"}</ThemeBadge>
    </div>
  );
}

// 雪場大卡片：橫跨兩欄，最上方是滿版全景照，接著介紹與數據，最下方是滿版 3D 雪道圖。
function ResortCard({ spot }) {
  return (
    <Card className="flex flex-col gap-6 sm:col-span-2">
      <PhotoSlot slug={spot.photoSlug} src={spot.photo} alt={spot.name} aspect="aspect-4/3 sm:aspect-21/9" />
      <div className="flex flex-col gap-4">
          <SpotHeader spot={spot} />
          <p className="text-sm leading-relaxed text-ivory-text/90">{spot.highlight}</p>
          {spot.link && (
            <a
              href={spot.link.href}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex w-fit items-center gap-1 text-sm text-ash-text underline decoration-slate-border underline-offset-4 transition-colors hover:text-ivory-text"
            >
              {spot.link.label} →
            </a>
          )}
          {spot.stats && (
            <dl className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
              {spot.stats.map((s) => (
                <div key={s.label} className="rounded-cards bg-obsidian-button px-4 py-3">
                  <dt className="text-xs text-ash-text">{s.label}</dt>
                  <dd className="font-display mt-1 text-sm font-medium text-ivory-text">{s.value}</dd>
                </div>
              ))}
            </dl>
          )}
          {spot.kidsPark && <p className="text-sm leading-relaxed text-ivory-text/90">{spot.kidsPark}</p>}
      </div>

      <SpotDetails spot={spot} />

      {spot.trailMap && (
        <div className="flex flex-col gap-3">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <h5 className="font-display text-base font-medium text-ivory-text">3D 雪道圖</h5>
            <ul className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-ash-text">
              {PISTE_LEGEND.map((item) => (
                <li key={item.label} className="flex items-center gap-1.5">
                  <span className={`h-1 w-4 rounded-full ${item.className}`} />
                  {item.label}
                </li>
              ))}
            </ul>
          </div>
          <LazyTrailMap />
          <p className="text-xs text-ash-text">
            拖曳可平移，右上角可旋轉與切換全螢幕；桌機按住 Ctrl／⌘ 加滾輪縮放，手機用雙指操作。點雪道或吊椅可看名稱與難度。雪道資料來自 OpenStreetMap，以現場告示為準。
          </p>
        </div>
      )}

      <GoogleMapsLink query={spot.mapQuery} />
    </Card>
  );
}

// 碗筷線條 icon，用來標示美食區塊。
function FoodIcon({ className = "" }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className={className}
    >
      <path d="M14 3 9.5 10" />
      <path d="M19 3.5 12.5 10" />
      <path d="M3 12h18a9 9 0 0 1-18 0Z" />
      <path d="M9 21h6" />
    </svg>
  );
}

// 美食區塊：用淡底色面板包起來，與景點卡片區隔。
function FoodPanel({ title, children }) {
  return (
    <div className="mt-10 rounded-cards bg-obsidian-button p-5 sm:p-8">
      <div className="mb-5 flex items-center gap-3">
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-graphite-card text-champagne-gold">
          <FoodIcon className="h-5 w-5" />
        </span>
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.12em] text-champagne-gold">Food</p>
          <h3 className="font-display text-lg font-medium text-ivory-text">{title}</h3>
        </div>
      </div>
      <div className="grid gap-6 sm:grid-cols-2">{children}</div>
    </div>
  );
}

export function Spots() {
  return (
    <SectionContainer id="spots" tone="light" eyebrow="Fukui & Kanazawa" title="精選景點詳細資訊">
      <div className="flex flex-col gap-12">
        {spots.map((group) => (
          <div key={group.region}>
            <h3 className="font-display mb-5 text-lg font-medium text-ivory-text">{group.region}</h3>
            <div className="grid gap-6 sm:grid-cols-2">
              {group.items.map((spot) =>
                spot.trailMap ? (
                  <ResortCard key={spot.name} spot={spot} />
                ) : (
                  <Card key={spot.name} className="flex flex-col gap-4">
                    <PhotoSlot slug={spot.photoSlug} src={spot.photo} alt={spot.name} />
                    <SpotHeader spot={spot} />
                    <p className="text-sm leading-relaxed text-ivory-text/90">{spot.highlight}</p>
                    <SpotDetails spot={spot} />
                    <GoogleMapsLink query={spot.mapQuery} />
                  </Card>
                ),
              )}
            </div>

            {group.region === "福井地區" && (
              <FoodPanel title="福井美食">
                  {fukuiFood.map((food) => (
                    <Card key={food.name} className="flex flex-col gap-3">
                      <PhotoSlot slug="fukui-food" src={food.photo} alt={food.name} />
                      <div className="flex items-start justify-between gap-3">
                        <h4 className="font-display text-lg font-medium text-ivory-text">{food.name}</h4>
                        <ThemeBadge theme="family">{food.tag}</ThemeBadge>
                      </div>
                      <p className="text-sm leading-relaxed text-ivory-text/90">{food.note}</p>
                      {food.recommend && (
                        <p className="border-t border-mist-border/15 pt-3 text-sm text-ivory-text/90">
                          <span className="text-xs uppercase tracking-wide text-ash-text">推薦店家　</span>
                          {food.recommend}
                        </p>
                      )}
                    </Card>
                  ))}
              </FoodPanel>
            )}

            {group.region === "金澤地區" && (
              <FoodPanel title="近江町市場美食">
                  {omichoFood.map((food) => (
                    <Card key={food.name} className="flex flex-col gap-3">
                      <PhotoSlot slug="omicho-food" src={food.photo} alt={food.name} />
                      <div className="flex items-start justify-between gap-3">
                        <h4 className="font-display text-lg font-medium text-ivory-text">{food.name}</h4>
                        <ThemeBadge theme="family">{food.category}</ThemeBadge>
                      </div>
                      <p className="text-sm leading-relaxed text-ivory-text/90">{food.note}</p>
                      {(food.price || food.hours) && (
                        <div className="grid gap-2 border-t border-mist-border/15 pt-3 text-sm text-ivory-text/90">
                          {food.price && (
                            <p>
                              <span className="text-xs uppercase tracking-wide text-ash-text">價格　</span>
                              {food.price}
                            </p>
                          )}
                          {food.hours && (
                            <p>
                              <span className="text-xs uppercase tracking-wide text-ash-text">營業　</span>
                              {food.hours}
                            </p>
                          )}
                        </div>
                      )}
                    </Card>
                  ))}
              </FoodPanel>
            )}
          </div>
        ))}
      </div>
    </SectionContainer>
  );
}
