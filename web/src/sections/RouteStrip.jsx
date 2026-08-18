import { routePins } from "../data/itinerary";
import { SectionContainer } from "../components/SectionContainer";

export function RouteStrip() {
  return (
    <SectionContainer eyebrow="Route" title="路線總覽">
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
    </SectionContainer>
  );
}
