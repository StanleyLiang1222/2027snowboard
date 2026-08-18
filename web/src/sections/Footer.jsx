import { overview } from "../data/itinerary";

export function Footer() {
  return (
    <footer className="border-t border-mist-border/10 px-5 py-8 text-center">
      <p className="text-xs text-ash-text">
        {overview.title}・{overview.dateRange}
      </p>
      <p className="mt-1 text-xs text-ash-text/70">行程內容僅供家庭旅遊規劃參考，實際時間與費用請以現場公告為準。</p>
    </footer>
  );
}
