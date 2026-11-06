import { overview } from "../data/itinerary";

export function Footer() {
  return (
    <footer className="border-t border-mist-border/10 px-5 py-8 text-center">
      <p className="text-xs text-ash-text">
        {overview.title}・{overview.dateRange}
      </p>
      <p className="mt-1 text-xs text-ash-text/70">
        © Mapterhorn | 雪道與纜車 © OpenStreetMap contributors（ODbL） | OpenFreeMap © OpenMapTiles Data from
        OpenStreetMap
      </p>
      <p className="mt-1 text-xs text-ash-text/70">© Stanley</p>
    </footer>
  );
}
