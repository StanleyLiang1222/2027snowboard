import { lodgings } from "../data/itinerary";
import { SectionContainer } from "../components/SectionContainer";
import { Card } from "../components/Card";
import { ThemeBadge, PendingBadge } from "../components/Badge";
import { GoogleMapsLink } from "../components/GoogleMapsLink";
import { PhotoSlot } from "../components/PhotoSlot";

const FIELDS = [
  { key: "address", label: "地址" },
  { key: "phone", label: "電話" },
  { key: "checkInTime", label: "Check-in" },
  { key: "checkOutTime", label: "Check-out" },
  { key: "bookingRef", label: "訂單編號" },
  { key: "access", label: "交通方式" },
];

export function Lodging() {
  return (
    <SectionContainer id="lodging" eyebrow="Stay" title="住宿資訊">
      <div className="grid gap-4 sm:grid-cols-2">
        {lodgings.map((stay) => (
          <Card key={stay.id}>
            {stay.photo && (
              <PhotoSlot src={stay.photo} alt={stay.name} aspect="aspect-21/9" className="mb-5" />
            )}
            <div className="flex flex-wrap items-center gap-2 text-xs font-semibold uppercase tracking-wide text-ash-text">
              <span>{stay.city}</span>
              <span>・</span>
              <span>
                {stay.checkIn} ～ {stay.checkOut}
              </span>
              <ThemeBadge theme="pass">{stay.nights} 晚</ThemeBadge>
            </div>

            <h3 className="font-display mt-3 text-lg font-medium text-ivory-text">
              {stay.name ?? <PendingBadge label="待補・住宿名稱" />}
            </h3>

            <dl className="mt-4 flex flex-col gap-2 border-t border-slate-border/40 pt-3 text-sm">
              {FIELDS.map(({ key, label }) => (
                <div key={key} className="flex gap-4">
                  <dt className="w-20 shrink-0 text-ash-text">{label}</dt>
                  <dd className="text-ivory-text/90">{stay[key] ?? <PendingBadge />}</dd>
                </div>
              ))}
            </dl>

            {stay.note && <p className="mt-3 text-sm text-ash-text">{stay.note}</p>}

            {stay.mapQuery && (
              <div className="mt-4">
                <GoogleMapsLink query={stay.mapQuery} />
              </div>
            )}
          </Card>
        ))}
      </div>
    </SectionContainer>
  );
}
