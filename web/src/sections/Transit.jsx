import { transit } from "../data/itinerary";
import { SectionContainer } from "../components/SectionContainer";
import { Card } from "../components/Card";
import { ThemeBadge, PendingBadge } from "../components/Badge";

export function Transit() {
  return (
    <SectionContainer id="transit" eyebrow="Rail Pass" title="交通票券最佳化配置">
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
