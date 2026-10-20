import { spots, fukuiFood } from "../data/itinerary";
import { SectionContainer } from "../components/SectionContainer";
import { Card } from "../components/Card";
import { PhotoSlot } from "../components/PhotoSlot";
import { ThemeBadge, PendingBadge } from "../components/Badge";
import { GoogleMapsLink } from "../components/GoogleMapsLink";

const THEME_LABEL = { dino: "恐龍探索", gold: "金箔手作", family: "親子景點" };

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

                  {spot.foods && (
                    <div className="border-t border-mist-border/15 pt-4">
                      <p className="text-xs uppercase tracking-wide text-ash-text">必吃美食</p>
                      <ul className="mt-3 flex flex-col gap-4">
                        {spot.foods.map((food) => (
                          <li key={food.name} className="text-sm">
                            <div className="flex flex-wrap items-center gap-2">
                              <span className="font-display font-medium text-ivory-text">{food.name}</span>
                              <span className="rounded-tags border border-mist-border/30 px-2 py-0.5 text-xs text-ash-text">
                                {food.category}
                              </span>
                            </div>
                            <p className="mt-1 leading-relaxed text-ivory-text/90">{food.note}</p>
                            {(food.price || food.hours) && (
                              <p className="mt-1 text-xs text-ash-text">
                                {[food.price, food.hours].filter(Boolean).join("　｜　")}
                              </p>
                            )}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  <GoogleMapsLink query={spot.mapQuery} />
                </Card>
              ))}
            </div>

            {group.region === "福井地區" && (
              <div className="mt-10">
                <h3 className="font-display mb-5 text-lg font-medium text-ivory-text">福井美食</h3>
                <div className="grid gap-6 sm:grid-cols-2">
                  {fukuiFood.map((food) => (
                    <Card key={food.name} className="flex flex-col gap-3">
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
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </SectionContainer>
  );
}
