import { days } from "../data/itinerary";
import { SectionContainer } from "../components/SectionContainer";
import { Card } from "../components/Card";
import { ThemeBadge, PendingBadge } from "../components/Badge";

export function Itinerary() {
  return (
    <SectionContainer id="itinerary" eyebrow="Day 1 – 9" title="逐日行程時間軸">
      <div className="flex flex-col gap-6">
        {days.map((day) => (
          <div key={day.id} className="flex gap-4 sm:gap-6">
            <div className="flex flex-col items-center">
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-cobalt text-sm font-semibold text-pure-white">
                D{day.id}
              </span>
              {day.id !== days.length && <span className="mt-2 w-px flex-1 bg-slate-border/60" />}
            </div>

            <Card className="mb-2 w-full">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <p className="text-sm text-ash-text">{day.date}</p>
                  <h3 className="font-display mt-1 text-xl font-medium text-ivory-text">{day.theme}</h3>
                </div>
                {day.passTag && <ThemeBadge theme="pass">{day.passTag}</ThemeBadge>}
              </div>

              <ul className="mt-5 flex flex-col gap-3">
                {day.activities.map((a, i) => (
                  <li key={i} className="flex gap-3 text-sm leading-relaxed">
                    <span className="w-20 shrink-0 font-medium text-champagne-gold">{a.time}</span>
                    <span className="text-ivory-text/90">{a.text}</span>
                  </li>
                ))}
              </ul>

              <div className="mt-6 grid gap-3 border-t border-mist-border/15 pt-5 text-sm sm:grid-cols-3">
                <div>
                  <p className="text-xs uppercase tracking-wide text-ash-text">交通方式</p>
                  <p className="mt-1 text-ivory-text/90">{day.transport}</p>
                </div>
                <div>
                  <p className="text-xs uppercase tracking-wide text-ash-text">住宿</p>
                  <div className="mt-1">
                    {day.lodging ? (
                      <p className="text-ivory-text/90">
                        {day.lodging}
                        {day.lodgingCity ? `（${day.lodgingCity}）` : ""}
                      </p>
                    ) : (
                      <PendingBadge label={`待補・${day.lodgingCity}`} />
                    )}
                  </div>
                </div>
                <div>
                  <p className="text-xs uppercase tracking-wide text-ash-text">主要餐飲</p>
                  <div className="mt-1">
                    {day.meal ? (
                      <p className="text-ivory-text/90">{day.meal}</p>
                    ) : (
                      <PendingBadge label={day.mealNote ? `待補・${day.mealNote}` : "待補"} />
                    )}
                  </div>
                </div>
              </div>
            </Card>
          </div>
        ))}
      </div>
    </SectionContainer>
  );
}
