# Build prompt — 雪國敘事背景（研究自 Kage）

參考對象：[MengTo/kage](https://github.com/MengTo/kage)（no license，僅參考手法，不沿用其程式碼或素材）。這份文件是給實作 agent 的建置規格書，動工前需先經 Stanley 確認方向。

## 範圍

取代目前逐段拼接的頁面背景（Hero 影片、各 section 的靜態卡片），改成一條貫穿全站的即時 WebGL 雪景場景，隨捲動推進鏡頭，穿越神戶→福井→金澤→高崎→越後湯澤→羽田的旅程。既有的逐日行程時間軸（[Itinerary.jsx](../web/src/sections/Itinerary.jsx)）與路線飛行地圖（[RouteFlightMap.jsx](../web/src/components/RouteFlightMap.jsx)）維持不動，WebGL 場景是疊在其上/其後的環境層，不取代資訊內容。

## Experience

- 固定滿版 Three.js canvas 當環境層，內容 DOM 疊在上面。
- 場景要素全部程序化生成：雪山稜線、松林、纜車與鋼纜、飄雪粒子、暖色燈籠光、金箔紋理光斑（金澤章節）、恐龍剪影/化石意象（福井章節）。
- 一條連續鏡頭路徑由 scroll 驅動，每個章節是一個新構圖，不是硬切場景。
- 克制的 bloom、film grain、depth haze，雪地要看得出顆粒感而非死白一片。
- 色票沿用既有 Mercury 系統：主色調 Onyx `#171721` / Graphite `#1e1e2a`，冷色雪景用 Ivory `#ededf3` 與 Mist `#e2e3ed` 提亮，互動元素維持 Cobalt `#5266eb`，恐龍/金箔章節的裝飾性暖色用既有的 Champagne Gold `#d4af37`（勿新增色票）。

## 章節對應

WebGL 背景走 5 個敘事章節，比 9 天行程更粗，只服務氛圍鏡頭；細節仍看下方時間軸。

| 章節 | 對應行程 | 場景重點 |
|------|----------|----------|
| 00 序幕 | 神戶抵達 | 港夜、纜車升起、雪山在霧裡浮現（沿用現有 Hero 纜車意象） |
| 01 恐龍王國 | 福井 | 雪覆針葉林、遠處化石/骨架剪影、機械暴龍地標 |
| 02 金澤 金箔 | 金澤 | 兼六園雪景、金箔光斑粒子、鳥居暖光 |
| 03 雪山基地 | 高崎→越後湯澤 | 纜車吊廂、滑雪道、家庭滑雪剪影、飄雪最大量 |
| 04 尾聲 | 羽田返程 | 鏡頭拉高俯瞰全程路線，雪山漸隱入夜色 |

## Layout / Motion

- 標題沿用現有 arcadiaDisplay 480 字重，不套用 Kage 的直排日文裝飾字（跟現有逐日行程的中文標題風格衝突，改成中文章節標＋小字英文/羅馬拼音標籤即可）。
- 文字逐字/逐行揭露，前景細節（雪松枝、燈籠）用 AI 生成去背 WebP 疊圖，不用即時 3D 建模——這是 Kage 效能的關鍵，近景細節不吃 GPU。
- 支援 `prefers-reduced-motion`：關閉鏡頭平滑推進與粒子動畫，但完整內容仍可讀。

## 效能與品質底線（吸取先前 Three.js 失敗的教訓）

專案先前試過 Three.js 做 Hero 背景，因為 `fog` 材質預設值把自訂幾何吃成看不見、WebGL context 反覆 lost，最後放棄改用捲動影片。這次要對齊 Kage 展示的紀律，避免重蹈覆轍：

- `fog` 必須逐層明確指定 `true`/`false`，不可依賴預設值。
- 大量重複物件（雪松、飄雪、雪花粒子）一律用 `InstancedMesh` 或 `Points` + shader，不逐一建 mesh。
- 加一個簡單的 PERF governor：量測實際幀時間，動態調整 `renderer.setPixelRatio()`，觸控裝置（`matchMedia('(hover: none)')`）先天套用較低畫質預設。
- 監聽 `webglcontextlost`，優雅退回目前的靜態 Hero 影片/圖片版本，不是空白畫面。
- 場景分階段建置（模仿 Kage 的 `JOBS` pattern），避免單一巨大同步任務卡住首屏。
- 捲動驅動鏡頭要經過阻尼平滑（critically-damped interpolation），不是原始 scroll 百分比直接映射。
- 離開視窗（`IntersectionObserver`）或分頁背景（`visibilitychange`）時暫停渲染迴圈。

## 響應式：pad／phone（研究自 Kage 原始碼的具體手法）

Kage 处理平板/手機不是只靠 CSS breakpoint，3D 場景本身也要跟著screen比例調整，這幾個手法要對齊：

- **量測視窗一律用 `document.documentElement.clientWidth/clientHeight`，不用 `innerWidth/innerHeight`。** Kage 原始碼裡明講踩過的坑：手機上 `innerWidth` 會回報 layout viewport（可能比實際看得到的畫面寬），拿去算 canvas 尺寸會讓畫面右側被裁掉、文字最後一個字消失。`clientWidth` 才是 CSS 實際排版依據的寬度。
- **鏡頭構圖用長寬比（aspect ratio）判斷，不是用固定像素寬度判斷。** Kage 的原則是「用畫面形狀判斷，不是用寬度判斷」——直立拿的 768px 平板跟手機一樣「窄長」，如果只用「寬度 < 820px 才算手機」這種斷點，直立平板會被誤判成桌機規格，構圖爆版、關鍵元素（鳥居/山頭）被裁掉一半。做法：算一個 `aspectFix`，畫面比參考比例（Kage 用 1.62）窄就讓鏡頭沿著視線方向後退、FOV 加大，讓同一組運鏡座標在任何長寬比下都不裁切畫面。
- **窄長畫面（aspect < 1.05，接近正方形或直立）**額外處理:文字/前景元素的置放邏輯要有獨立分支，不能只是等比縮放——Kage 對章節標題在窄長畫面下會墊高基準線、內縮邊界留白，避免文字被地形擋住或超出安全範圍。
- **裝置分級用 `matchMedia('(hover: none)')`，不是猜 User-Agent 或猜螢幕寬度。** 沒有 hover 能力的裝置（觸控裝置，含平板）先天套用低畫質預設：DPR cap 降低（Kage 用 1.4 vs 桌機 1.8）、陰影關閉、飄雪等粒子數量減半。

實作時這幾點要寫進 `resize()` 與鏡頭運鏡函式，不是丟給 CSS media query 處理就結束。

## Interaction and quality

- 桌機全開，手機/平板套用上述裝置分級（低 DPR、關陰影、粒子減半），畫面比例失衡時鏡頭自動退開/加大 FOV，不是整段隱藏——這跟現有 RouteFlightMap 在窄螢幕直接不渲染的做法不同，因為背景是全站骨幹，不能整段消失。
- 保留現有導覽列、卡片式版面、逐日行程等既有結構，不因為加了 WebGL 背景就改版型。
- 上線前檢查：桌機 + 390×844（phone）+ 820×1180（pad 直立）三種尺寸、console 無錯誤、reduced-motion 開關測試、低階裝置模擬（Chrome DevTools CPU throttling）下仍可互動，並且特別檢查 pad 直立時鏡頭構圖有沒有裁切關鍵元素。

## 決議（2026-08-26 確認）

1. **範圍**：WebGL 背景貫穿全站所有 section，不分段降級為卡片。
2. **前景素材**：雪松枝、燈籠、化石剪影等去背圖層由 Stanley 自行用 Photoshop 等軟體產生，實作 agent 不負責生成美術素材，只負責場景程式與素材串接（介面約定：`web/public/foreground/*.webp`，透明背景、camera-facing 平面貼圖）。
3. **Hero 影片**：目前的纜車 MP4 是過渡方案，未來 WebGL 場景上線後整個替換掉，不需要保留成 fallback 影片——但 `webglcontextlost` 與低階裝置降級仍要有靜態畫面兜底（截圖或純色漸層，不是空白）。
