import { useEffect, useState } from "react";
import { routePins } from "../data/itinerary";
import { SectionContainer } from "../components/SectionContainer";
import { RouteFlightMap } from "../components/RouteFlightMap";

const DESKTOP_QUERY = "(min-width: 1024px)";
const HAS_MAPBOX_TOKEN = Boolean(import.meta.env.VITE_MAPBOX_TOKEN);

// 跟下方逐日行程時間軸內容重複，只在桌機顯示；手機/平板直接不渲染這個區塊。
// 有 Mapbox Token 時顯示真實地形的路線飛行動畫，還沒設定 Token 前先用簡化清單頂著。
function SimpleRouteList() {
  return (
    <div className="overflow-x-auto pb-2">
      <ol className="flex min-w-max gap-0">
        {routePins.map((pin, i) => (
          <li key={pin.order} className="flex items-center">
            <div className="flex w-40 flex-col items-center text-center sm:w-48">
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-cobalt bg-cobalt/15 text-sm font-medium text-ivory-text">
                {pin.order}
              </span>
              <span className="mt-3 px-2 text-sm leading-snug text-ivory-text/90">{pin.name}</span>
            </div>
            {i < routePins.length - 1 && (
              <span className="mb-11 h-px w-8 shrink-0 bg-slate-border sm:w-12" />
            )}
          </li>
        ))}
      </ol>
    </div>
  );
}

export function RouteStrip() {
  const [isDesktop, setIsDesktop] = useState(false);

  useEffect(() => {
    const mql = window.matchMedia(DESKTOP_QUERY);
    setIsDesktop(mql.matches);
    const onChange = (e) => setIsDesktop(e.matches);
    mql.addEventListener("change", onChange);
    return () => mql.removeEventListener("change", onChange);
  }, []);

  if (!isDesktop) return null;

  return (
    <SectionContainer eyebrow="Route" title="路線總覽">
      {HAS_MAPBOX_TOKEN ? <RouteFlightMap /> : <SimpleRouteList />}
    </SectionContainer>
  );
}
