# 圖片插槽說明

把照片放進這個資料夾，檔名要跟下面的命名一致（副檔名固定 `.jpg`），網站會自動抓取；找不到對應檔名時會顯示深色漸層佔位圖。目前這 6 類已經用 Unsplash 免費商用授權照片頂著，之後妳有自己拍的照片，直接覆蓋同檔名即可替換。

## Hero
桌機版是捲動綁定影片——捲多少、影片播放到第幾秒（不是自動播放），做出「鏡頭往雪山深處推進」的效果：
- `../videos/hero-cable-car.mp4` — 目前還沒有影片檔案，找不到時自動退回下面的靜態照片
手機版／找不到影片時一律用靜態照片：
- `hero-snow-scenery.jpg` — 雪景（首頁全螢幕大圖）

影片放進去後記得檢查關鍵幀密度（GOP）夠不夠密——捲動時是快速跳著設定播放進度（seek），關鍵幀太稀疏會頓。

## 旅程精選影像（Gallery 區塊）
- `family-snowboard.jpg` — 兩大一小滑雪合照
- `kanazawa-station.jpg` — 金澤車站
- `kenrokuen.jpg` — 兼六園（與景點卡片共用）
- `shinkansen.jpg` — 新幹線
- `yuzawa-cable-car.jpg` — 湯澤高原空中纜車

## 精選景點卡片
- `fukui-dinosaur-museum.jpg` — 福井縣立恐龍博物館
- `asuwayama-park.jpg` — 足羽山公園
- `higashi-chaya.jpg` — 東茶屋街・金箔工藝體驗
- `21st-century-museum.jpg` — 金澤21世紀美術館
- `yuzawa-cable-car.jpg` — 越後湯澤・湯澤高原滑雪場（與 Gallery 共用）
- `takasaki-guesthouse.jpg` — 高崎民宿體驗（目前還沒有照片，先顯示漸層佔位圖）

之後要新增更多照片類別，只要在 `src/data/itinerary.js` 的 `gallery` 陣列裡加一筆 `{ slug, caption }`，再把對應檔名的照片放進這個資料夾即可，不需要改任何元件程式碼。
