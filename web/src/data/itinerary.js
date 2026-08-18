// 資料來源：doc/2027_winter_trip_plan.md
// 欄位值為 null 代表原文標記 OOO（待補），元件會自動套用「待補」樣式。

export const overview = {
  title: "2027 金光閃閃與恐龍共同滑雪行程",
  subtitle: "親子探索版",
  dateRange: "2027/01/26（二）～ 2027/02/03（三）",
  duration: "9 天 8 夜",
  members: "2 大 1 小（9 歲國小學童）",
  route: ["神戶", "福井", "金澤", "高崎（住宿基地）", "越後湯澤", "機場返台"],
  highlights: [
    {
      title: "恐龍探索",
      desc: "JR 福井站戶外等身機械暴龍、XR 恐龍主題巴士、福井縣立恐龍博物館化石研究室。",
    },
    {
      title: "親子互動",
      desc: "金澤金箔筷子/木盒 DIY、21世紀美術館《泳池》錯覺體驗、湯澤高原家庭雪上樂園。",
    },
    {
      title: "舒適動線",
      desc: "高崎定點連住 4 晚，搭乘新幹線 25 分鐘直達越後湯澤滑雪，免除雪地拖行李之苦。",
    },
  ],
  weather: {
    temp: "神戶均溫 3°C～10°C；福井、金澤、越後湯澤均溫 -3°C～5°C，積雪深厚且易有濕雪/結冰。",
    sunset: "冬季約 17:00～17:20 日落。",
    outfit:
      "洋蔥式穿法（排汗發熱衣 + 保暖中層 + 防風防水外套），必備深齒紋防水防滑雪靴、防雪水加厚手套（備用2雙）、毛帽與保暖脖圍。",
  },
};

export const transit = {
  passes: [
    {
      id: "hokuriku",
      name: "JR 北陸拱形鐵路周遊券（Hokuriku Arch Pass，連續 7 日）",
      validRange: "Day 2 ～ Day 8（連續 7 天）",
      price: null,
      coverage: [
        "Day 2：神戶 ➔ 京都/敦賀 ➔ 福井（特急 Thunder Bird + 北陸新幹線）",
        "Day 3：福井 ➔ 金澤（北陸新幹線，車程約 35 分鐘）",
        "Day 5：金澤 ➔ 高崎（北陸新幹線直達，車程約 1 小時 40 分鐘）",
        "Day 2～Day 8 期間適用之市區 JR 路線。",
      ],
    },
    {
      id: "joetsu",
      name: "JR East Pass（長野・新潟地區，涵蓋上越新幹線）",
      validRange: "Day 6 ～ Day 8（高崎 ⇋ 越後湯澤 滑雪往返 3 趟）",
      price: null,
      coverage: [
        "上越新幹線高崎 ⇋ 越後湯澤區間不限次數搭乘，取代原本逐趟單買車票",
        "Day 6、Day 7、Day 8 三天往返滑雪皆可直接使用，含指定席預約",
        "票券天數與票價請於出發前至 JR East 官網或台灣代理售票通路確認最新公告",
      ],
    },
  ],
  selfPay: [
    {
      label: "Day 1（關西機場 ➔ 神戶）",
      desc: "單買關空特急 HARUKA（轉乘）或 機場高速船 / 利木津巴士。",
    },
    {
      label: "Day 9（高崎 ➔ 東京/機場）",
      desc: "單買新幹線 + 機場特急快線（N'EX / Skyliner）。",
    },
  ],
};

export const days = [
  {
    id: 1,
    date: "01/26 (二)",
    theme: "抵達神戶・海港之夜",
    activities: [
      { time: "下午", text: "抵達神戶，飯店 Check-in 卸下行李休整" },
      { time: "晚上", text: "美利堅公園漫步、神戶港塔夜景打卡、BE KOBE 地標合影" },
    ],
    transport: "機場快線 / JR 神戶線（自費/IC卡）",
    passTag: null,
    lodging: null,
    lodgingCity: "神戶",
    meal: null,
    mealNote: "神戶牛 / 西式洋食料理",
  },
  {
    id: 2,
    date: "01/27 (三)",
    theme: "恐龍王國・勝山大冒險",
    activities: [
      {
        time: "上午",
        text: "開啟用拱形 Pass，搭特急轉新幹線抵達福井；在 JR 福井站恐龍廣場與機械動態恐龍合影；搭恐龍主題巴士前往勝山",
      },
      {
        time: "下午",
        text: "福井縣立恐龍博物館（探索 50 具恐龍全身骨骼、三面沉浸式劇院、參加室內化石研究體驗）",
      },
      { time: "晚上", text: "返回福井市區，享用在地名物料理" },
    ],
    transport: "JR 特急/新幹線、恐龍主題巴士",
    passTag: "啟用 Pass D1",
    lodging: null,
    lodgingCity: "福井",
    meal: null,
    mealNote: "福井特色醬汁豬排丼",
  },
  {
    id: 3,
    date: "01/28 (四)",
    theme: "福井慢活 ➔ 前進金澤",
    activities: [
      { time: "上午（鬆快版）", text: "足羽山公園 / 自然史博物館輕鬆散步，眺望福井雪景" },
      { time: "下午", text: "搭北陸新幹線直達金澤（約 35 分鐘），飯店放行李後參觀金澤車站「鼓門」與商場採買" },
      { time: "晚上", text: "金澤站周邊品嘗熱騰騰名物料理" },
    ],
    transport: "北陸新幹線（福井 ➔ 金澤）",
    passTag: "Pass D2",
    lodging: null,
    lodgingCity: "金澤",
    meal: null,
    mealNote: "金澤特色關東煮 / 迴轉壽司",
  },
  {
    id: 4,
    date: "01/29 (五)",
    theme: "金澤・金箔手作與名園",
    activities: [
      { time: "上午", text: "兼六園（賞雪吊美景、尋找徽軫石燈籠）" },
      { time: "下午", text: "東茶屋街（體驗金箔筷/木盒 DIY 貼箔手作，品嘗整片貼滿的金箔冰淇淋）" },
      { time: "傍晚", text: "金澤城公園散步" },
    ],
    transport: "城下町周遊巴士 / 步行",
    passTag: "Pass D3",
    lodging: null,
    lodgingCity: "金澤",
    meal: null,
    mealNote: "近江町市場海鮮丼",
  },
  {
    id: 5,
    date: "01/30 (六)",
    theme: "金澤當代藝術 ➔ 高崎基地",
    activities: [
      { time: "上午", text: "金澤21世紀美術館（參觀神奇《泳池》拍水底錯覺照、戶外互動彩色裝置）" },
      { time: "下午", text: "搭乘北陸新幹線直達群馬高崎（約 1 小時 40 分鐘，沿途欣賞信越雪山群）" },
      { time: "晚上", text: "高崎站周邊商場採買雪地零食與補齊防寒裝備" },
    ],
    transport: "北陸新幹線（金澤 ➔ 高崎直達）",
    passTag: "Pass D4",
    lodging: null,
    lodgingCity: "高崎",
    meal: null,
    mealNote: "高崎名物大份量義大利麵",
  },
  {
    id: 6,
    date: "01/31 (日)",
    theme: "湯澤高原滑雪場 (Day 1)",
    activities: [
      { time: "上午", text: "高崎搭新幹線（25 分鐘）直達越後湯澤，前往湯澤高原滑雪場" },
      { time: "下午", text: "租借裝備，兒童雪上樂園（雪盆、雪胎體驗）與初級滑雪教學" },
      { time: "傍晚", text: "逛越後湯澤站內商場、品嘗現做爆彈飯糰，搭新幹線回高崎" },
    ],
    transport: "自費上越新幹線（高崎 ⇋ 越後湯澤）",
    passTag: "Pass D5",
    lodging: null,
    lodgingCity: "高崎",
    meal: null,
    mealNote: "越後豬肉料理 / 居酒屋",
  },
  {
    id: 7,
    date: "02/01 (一)",
    theme: "湯澤高原滑雪場 (Day 2)",
    activities: [
      { time: "全日", text: "搭乘世界最大級空中纜車直達山頂全景雪區，家庭滑雪進階練習與雪景合照" },
      { time: "傍晚", text: "越後湯澤站前免費足湯泡腳暖身，搭新幹線回高崎休息" },
    ],
    transport: "自費上越新幹線（高崎 ⇋ 越後湯澤）",
    passTag: "Pass D6",
    lodging: null,
    lodgingCity: "高崎",
    meal: null,
    mealNote: "高崎在地燒肉 / 拉麵",
  },
  {
    id: 8,
    date: "02/02 (二)",
    theme: "湯澤高原滑雪場 (Day 3 / 彈性日)",
    activities: [
      {
        time: "全日（滑雪/彈性）",
        text: "續戰湯澤高原精進滑雪；或上午滑雪、下午回高崎體驗少林山達磨寺手繪不倒翁 DIY",
      },
      { time: "傍晚", text: "歸還雪具，搭新幹線回高崎整理大件行李" },
    ],
    transport: "自費上越新幹線（高崎 ⇋ 越後湯澤）",
    passTag: "Pass D7",
    lodging: null,
    lodgingCity: "高崎",
    meal: null,
    mealNote: "家庭慶祝晚餐",
  },
  {
    id: 9,
    date: "02/03 (三)",
    theme: "高崎 ➔ 機場 ➔ 台灣",
    activities: [
      { time: "上午", text: "退房後搭乘新幹線前往東京轉乘機場特急" },
      { time: "下午", text: "機場免稅店採買最後伴手禮，搭機返回溫暖的家" },
    ],
    transport: "新幹線 + 機場快線（自費/單買）",
    passTag: null,
    lodging: "溫暖的家",
    lodgingCity: null,
    meal: "機上簡餐",
    mealNote: null,
  },
];

export const spots = [
  {
    region: "福井地區",
    items: [
      {
        name: "福井縣立恐龍博物館",
        nameEn: "Fukui Prefectural Dinosaur Museum",
        photoSlug: "fukui-dinosaur-museum",
        theme: "dino",
        highlight:
          "世界三大恐龍博物館之一！館內展示超過 50 具完整恐龍化石骨骼、動態暴龍機械模型與 13 公尺高恐龍之塔，並設有室內化石研究與模擬挖掘體驗。",
        transport: "JR 福井站前搭乘恐龍主題彩繪巴士直達，或搭乘越前鐵道至「勝山站」轉乘接駁巴士。",
        hours: null,
        price: null,
        winterNote: "戶外挖掘冬季暫停，室內展館溫暖舒適，建議預留 3～4 小時。",
        mapQuery: "福井縣立恐龍博物館",
      },
      {
        name: "足羽山公園與自然史博物館",
        nameEn: "Asuwayama Park",
        photoSlug: "asuwayama-park",
        theme: "family",
        highlight:
          "福井市民的後花園，地勢稍高可俯瞰福井市雪景，園區內有自然史博物館與小動物園區，節奏慢活適合親子散步。",
        transport: "JR 福井站搭乘社區巴士或計程車約 10 分鐘。",
        hours: null,
        price: null,
        winterNote: "步道若有積雪請穿著防滑雪靴慢行。",
        mapQuery: "足羽山公園",
      },
    ],
  },
  {
    region: "金澤地區",
    items: [
      {
        name: "東茶屋街・金箔工藝體驗",
        nameEn: null,
        photoSlug: "higashi-chaya",
        theme: "gold",
        highlight:
          "保留江戶風情的木造老街。9 歲孩子可親自體驗在木筷、小木盒上貼付真金箔（約 40～60 分鐘），課後再享用人手一支的金箔冰淇淋。",
        transport: "金澤站搭乘城下町周遊巴士至「橋場町」站下車，步行約 5 分鐘。",
        hours: null,
        price: "約 1,000～2,000 日圓/人",
        winterNote: "店家約 16:30～17:00 陸續打烊，建議下午 14:00～16:00 前往。",
        mapQuery: "東茶屋街",
      },
      {
        name: "金澤兼六園",
        nameEn: "Kenroku-en",
        photoSlug: "kenrokuen",
        theme: "family",
        highlight:
          "日本三大名園之一。冬季著名景致為保護黑松枝幹的錐形「雪吊（Yukizuri）」，與徽軫石燈籠相映，充滿北陸雪國雅致。",
        transport: "搭乘周遊巴士至「兼六園下・金澤城」站下車即達。",
        hours: null,
        price: null,
        winterNote: "園內石橋與石階結冰時偏滑，請牽緊小朋友小心步行。",
        mapQuery: "兼六園",
      },
      {
        name: "金澤21世紀美術館",
        nameEn: "21st Century Museum",
        photoSlug: "21st-century-museum",
        theme: "family",
        highlight:
          "現代圓形玻璃建築，最著名展品為林德羅・厄利什的《泳池》（The Swimming Pool），可體驗水上與水下的錯覺互動拍照。",
        transport: "搭乘巴士至「廣坂・21世紀美術館」站下車即達。",
        hours: null,
        price: "泳池地下展區需事前線上預約門票",
        winterNote: "室內展區溫暖，適合冬季親子避寒看展。",
        mapQuery: "金沢21世紀美術館",
      },
    ],
  },
  {
    region: "高崎・越後湯澤地區",
    items: [
      {
        name: "越後湯澤・湯澤高原滑雪場",
        nameEn: "Yuzawa Kogen Ski Resort",
        photoSlug: "yuzawa-cable-car",
        theme: "family",
        highlight:
          "搭乘世界最大級空中纜車直達山頂全景雪區，山下設有兒童雪上樂園（雪盆、雪胎體驗）與初級滑雪教學課程，適合親子從新手到進階循序漸進。纜車站前廣場另有免費足湯，滑完雪剛好泡腳暖身。",
        transport: "從高崎搭乘上越新幹線約 25～30 分鐘至越後湯澤站，站前即可步行轉乘空中纜車上山。",
        hours: null,
        price: null,
        winterNote: "山頂氣溫比山下低約 5～8°C，濕雪偏重，纜車候車處風大，建議加強防水手套與雪鏡並注意保暖。",
        mapQuery: "湯沢高原スキー場",
      },
      {
        name: "高崎民宿體驗",
        nameEn: null,
        photoSlug: "takasaki-guesthouse",
        theme: "family",
        highlight:
          "作為連住 4 晚的住宿基地，選擇日式民宿感受不同於連鎖飯店的在地生活感，晚間可享用主人準備的鄉土家常料理，也是讓孩子認識日本家庭生活文化的機會。",
        transport: "高崎車站步行或計程車可達，鄰近新幹線站，方便每日往返越後湯澤滑雪。",
        hours: null,
        price: null,
        winterNote: "多數民宿設有暖爐暖桌（こたつ），室內外溫差大，進出時記得隨時穿脫外套。",
        mapQuery: "高崎駅",
      },
    ],
  },
];

// 圖片區塊：對應 public/images/<slug>.jpg，可依需要持續擴充新的照片類別。
export const gallery = [
  { slug: "hero-snow-scenery", caption: "北陸雪景" },
  { slug: "family-snowboard", caption: "親子滑雪合照" },
  { slug: "kanazawa-station", caption: "金澤車站・鼓門" },
  { slug: "kenrokuen", caption: "兼六園雪吊" },
  { slug: "shinkansen", caption: "北陸新幹線" },
  { slug: "yuzawa-cable-car", caption: "湯澤高原空中纜車" },
];

export const routePins = [
  { order: 1, name: "神戶港 / 美利堅公園" },
  { order: 2, name: "JR 福井站恐龍廣場" },
  { order: 3, name: "福井縣立恐龍博物館" },
  { order: 4, name: "足羽山公園" },
  { order: 5, name: "金澤車站（鼓門）" },
  { order: 6, name: "兼六園 ＆ 金澤城公園" },
  { order: 7, name: "金澤東茶屋街（金箔體驗工坊）" },
  { order: 8, name: "金澤21世紀美術館" },
  { order: 9, name: "高崎車站（新幹線住宿樞紐基地）" },
  { order: 10, name: "越後湯澤高原滑雪場（家庭雪上樂園）" },
];

export const packingList = [
  {
    category: "證件與金融",
    items: ["護照（效期 6 個月以上）", "VJW 申報 QR code", "日幣現金", "信用卡", "JR Pass 預訂憑證"],
  },
  {
    category: "防寒與日常",
    items: [
      "發熱衣褲（3~4 套）",
      "防風防水羽絨外套",
      "防潑水長褲",
      "防滑深齒紋雪靴",
      "遮耳毛帽",
      "防風脖圍",
      "兒童備用保暖厚襪",
    ],
  },
  {
    category: "滑雪專用配件",
    items: ["滑雪護目鏡（雪鏡）", "防水滑雪手套（2 雙輪替）", "滑雪專用長襪", "兒童護具"],
  },
  {
    category: "隨身小物與藥品",
    items: ["大容量行動電源", "高保濕乳液/護唇膏", "常備退燒/感冒/腸胃藥品", "暖暖包"],
  },
];

export const emergencyInfo = {
  bookingRef: null,
  insuranceHotline: null,
  japanEmergency: [
    { label: "報警", value: "110" },
    { label: "救護車", value: "119" },
    { label: "觀光局訪日遊客客服熱線", value: "050-3816-2720" },
  ],
};
