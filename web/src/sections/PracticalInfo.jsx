import { packingList, emergencyInfo } from "../data/itinerary";
import { SectionContainer } from "../components/SectionContainer";
import { Card } from "../components/Card";
import { PendingBadge } from "../components/Badge";

export function PracticalInfo() {
  return (
    <SectionContainer id="info" eyebrow="Prep" title="實用工具與補充資訊">
      <h3 className="font-display mb-4 text-lg font-medium text-ivory-text">
        9 歲兒童與家庭冬季行李裝備清單
      </h3>
      <div className="mb-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {packingList.map((group) => (
          <Card key={group.category} className="p-5 sm:p-6">
            <h4 className="text-sm font-semibold text-champagne-gold">{group.category}</h4>
            <ul className="mt-3 flex flex-col gap-1.5 text-sm text-ivory-text/90">
              {group.items.map((item) => (
                <li key={item} className="flex gap-2">
                  <span className="text-ash-text">–</span>
                  {item}
                </li>
              ))}
            </ul>
          </Card>
        ))}
      </div>

      <h3 className="font-display mb-4 text-lg font-medium text-ivory-text">緊急聯絡與預訂資訊</h3>
      <Card className="grid gap-6 sm:grid-cols-2">
        <div>
          <p className="text-xs uppercase tracking-wide text-ash-text">住宿訂單編號</p>
          <div className="mt-1">{emergencyInfo.bookingRef ?? <PendingBadge />}</div>

          <p className="mt-4 text-xs uppercase tracking-wide text-ash-text">海外旅遊與突發疾病保險專線</p>
          <div className="mt-1">{emergencyInfo.insuranceHotline ?? <PendingBadge />}</div>
        </div>

        <div>
          <p className="text-xs uppercase tracking-wide text-ash-text">日本緊急求助</p>
          <ul className="mt-1 flex flex-col gap-1.5 text-sm text-ivory-text/90">
            {emergencyInfo.japanEmergency.map((e) => (
              <li key={e.label} className="flex justify-between gap-4">
                <span className="text-ash-text">{e.label}</span>
                <span>{e.value}</span>
              </li>
            ))}
          </ul>
        </div>
      </Card>
    </SectionContainer>
  );
}
