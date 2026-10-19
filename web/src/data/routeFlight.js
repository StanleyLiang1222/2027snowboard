// 路線飛行動畫用的地點座標（經緯度為真實座標，Mapbox 用）。
// day 是對應逐日行程的天數標籤，用來在地圖上跟下方時間軸互相呼應。
export const routeFlightStops = [
  { id: "kobe", name: "神戶", day: "D1", lng: 135.1955, lat: 34.6913 },
  { id: "fukui", name: "福井", day: "D2–D3", lng: 136.2217, lat: 36.0611 },
  { id: "kanazawa", name: "金澤", day: "D4–D5", lng: 136.6486, lat: 36.5776 },
  // 座標為越後中里站一帶的概略位置（尚未用地圖逐點校正），飛行動畫只需大致落點。
  { id: "nakazato", name: "越後中里（住宿＋滑雪）", day: "D6–D8", lng: 138.78, lat: 36.86 },
  { id: "tokyo", name: "東京", day: "D9", lng: 139.7671, lat: 35.6812 },
  { id: "haneda", name: "羽田機場", day: "D10", lng: 139.7798, lat: 35.5494 },
];
