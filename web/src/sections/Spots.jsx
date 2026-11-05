import { spots, fukuiFood, omichoFood } from "../data/itinerary";
import { SectionContainer } from "../components/SectionContainer";
import { Card } from "../components/Card";
import { PhotoSlot } from "../components/PhotoSlot";
import { ThemeBadge, PendingBadge } from "../components/Badge";
import { GoogleMapsLink } from "../components/GoogleMapsLink";

const THEME_LABEL = { dino: "恐龍探索", gold: "金箔手作", family: "親子景點" };

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
              {group.items.map((spot) => (
                <Card key={spot.name} className="flex flex-col gap-4">
                  <PhotoSlot slug={spot.photoSlug} src={spot.photo} alt={spot.name} />

                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <h4 className="font-display text-lg font-medium text-ivory-text">{spot.name}</h4>
                      {spot.nameEn && <p className="text-xs text-ash-text">{spot.nameEn}</p>}
                    </div>
                    <ThemeBadge theme={spot.theme}>{THEME_LABEL[spot.theme] ?? "景點"}</ThemeBadge>
                  </div>

                  <p className="text-sm leading-relaxed text-ivory-text/90">{spot.highlight}</p>

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
                        <div className="mt-1">
                          {spot.price ? <p>{spot.price}</p> : <PendingBadge />}
                        </div>
                      </div>
                    </div>
                    <div>
                      <p className="text-xs uppercase tracking-wide text-ash-text">冬季提醒</p>
                      <p className="mt-1 text-ivory-text/90">{spot.winterNote}</p>
                    </div>
                  </div>

                  <GoogleMapsLink query={spot.mapQuery} />
                </Card>
              ))}
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
