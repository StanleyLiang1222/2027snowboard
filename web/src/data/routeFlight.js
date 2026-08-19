// 路線飛行動畫用的地點座標（經緯度為真實座標，Mapbox 用）。
// day 是對應逐日行程的天數標籤，用來在地圖上跟下方時間軸互相呼應。
export const routeFlightStops = [
  { id: "kobe", name: "神戶", day: "D1", lng: 135.1955, lat: 34.6913 },
  { id: "fukui", name: "福井", day: "D2", lng: 136.2217, lat: 36.0611 },
  { id: "kanazawa", name: "金澤", day: "D3–D4", lng: 136.6486, lat: 36.5776 },
  { id: "takasaki", name: "高崎（住宿基地）", day: "D5", lng: 139.0031, lat: 36.3229 },
  { id: "yuzawa", name: "越後湯澤", day: "D6–D8", lng: 138.8058, lat: 36.9339 },
  { id: "haneda", name: "羽田機場", day: "D9", lng: 139.7798, lat: 35.5494 },
];
