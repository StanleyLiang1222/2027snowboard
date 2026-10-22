// 相簿的地點清單：前端與後端共用同一份（src 會直接 import 這個檔案），改這裡兩邊一起生效。
// id 會成為儲存路徑與 API 參數，上線後請不要改；顯示名稱 name 可以隨時改。
export const LOCATIONS = [
  { id: "nagoya", name: "名古屋" },
  { id: "fukui", name: "福井" },
  { id: "kanazawa", name: "金澤" },
  { id: "nakazato", name: "中里" },
  { id: "tokyo", name: "東京" },
];
