import { transit } from "../data/itinerary";
import { SectionContainer } from "../components/SectionContainer";
import { Card } from "../components/Card";
import { ThemeBadge, PendingBadge } from "../components/Badge";

export function Transit() {
  return (
    <SectionContainer id="transit" eyebrow="Flights & Rail Pass" title="航班與交通票券配置">
      <div className="mb-6 grid gap-4 sm:grid-cols-2">
        {transit.flights.map((f) => (
          <Card key={f.id}>
            <div className="flex flex-wrap items-center gap-2 text-xs font-semibold uppercase tracking-wide text-ash-text">
              <span>{f.label}</span>
              <span>・</span>
              <span>{f.dayLabel}</span>
              <span>・</span>
              <span>{f.date}</span>
            </div>
            <div className="mt-4 flex items-start justify-between gap-3">
              {[f.depart, f.arrive].map((end, i) => (
                <div key={end.code} className={i === 0 ? "text-left" : "text-right"}>
                  <p className="font-display text-2xl font-medium text-ivory-text">{end.time}</p>
                  <p className="text-sm font-semibold text-ash-text">{end.code}</p>
                  <p className="mt-1 text-sm text-ivory-text/90">{end.airport}</p>
                  <p className="text-xs text-ash-text">{end.terminal}</p>
                </div>
              ))}
            </div>
            <div className="mt-4 flex flex-wrap items-center gap-x-3 gap-y-1 border-t border-slate-border/40 pt-3 text-sm text-ivory-text/90">
              <span className="font-semibold text-ivory-text">{f.airline} {f.flightNo}</span>
              <span>{f.type}</span>
              <span>飛行時間 {f.duration}</span>
            </div>
          </Card>
        ))}
      </div>

      <div className="mb-6 flex flex-col gap-4">
        {transit.passes.map((pass) => (
          <Card key={pass.id}>
            <div className="flex flex-wrap items-center gap-3">
              <h3 className="font-display text-lg font-medium text-ivory-text">{pass.name}</h3>
              <ThemeBadge theme="pass">{pass.validRange}</ThemeBadge>
              {!pass.price && <PendingBadge label="待補・票價" />}
            </div>
            <ul className="mt-4 flex flex-col gap-2 text-sm text-ivory-text/90">
              {pass.coverage.map((line, i) => (
                <li key={i} className="flex gap-2">
                  <span className="text-champagne-gold">・</span>
                  {line}
                </li>
              ))}
            </ul>
          </Card>
        ))}
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        {transit.selfPay.map((item) => (
          <Card key={item.label} className="p-5 sm:p-6">
            <p className="text-xs font-semibold uppercase tracking-wide text-ash-text">自費/單買</p>
            <h4 className="font-display mt-1 text-base font-medium text-ivory-text">{item.label}</h4>
            <p className="mt-2 text-sm leading-relaxed text-ivory-text/90">{item.desc}</p>
          </Card>
        ))}
      </div>
    </SectionContainer>
  );
}
