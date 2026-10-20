// 資料來源：doc/2027_winter_trip_plan.md
// 欄位值為 null 代表原文標記 OOO（待補），元件會自動套用「待補」樣式。

export const overview = {
  title: "2027 金光閃閃與恐龍共同滑雪行程",
  subtitle: "親子探索版",
  dateRange: "2027/01/22（五）～ 2027/01/31（日）",
  duration: "10 天 9 夜",
  members: "2 大 1 小（9 歲國小學童）",
  route: ["神戶", "福井", "金澤", "越後中里（住宿基地）", "東京", "機場返台"],
  highlights: [
    {
      title: "恐龍探索",
      desc: "JR 福井站戶外等身機械暴龍、XR 恐龍主題巴士、福井縣立恐龍博物館化石研究室。",
    },
    {
      title: "親子互動",
      desc: "金澤金箔筷子/木盒 DIY、21世紀美術館《泳池》錯覺體驗、中里スキーセンター親子滑雪。",
    },
    {
      title: "舒適動線",
      desc: "越後中里「旅館・レンタル ふるさと」連住 3 晚，滑雪場「中里スキーセンター」直結 JR 越後中里站，免除每日往返與雪地拖行李之苦。",
    },
  ],
  weather: {
    temp: "神戶均溫 3°C～10°C；福井、金澤、越後中里均溫 -3°C～5°C，積雪深厚且易有濕雪/結冰。",
    sunset: "冬季約 17:00～17:20 日落。",
    outfit:
      "洋蔥式穿法（排汗發熱衣 + 保暖中層 + 防風防水外套），必備深齒紋防水防滑雪靴、防雪水加厚手套（備用2雙）、毛帽與保暖脖圍。",
  },
};

export const transit = {
  flights: [
    {
      id: "outbound",
      label: "去程",
      dayLabel: "Day 1",
      date: "01/22 (五)",
      flightNo: "BR 176",
      airline: "長榮航空",
      type: "直飛",
      duration: "2 小時 30 分",
      depart: { time: "14:30", code: "TPE", airport: "臺灣桃園機場", terminal: "2 航廈" },
      arrive: { time: "18:00", code: "UKB", airport: "神戶機場", terminal: "2 航廈" },
    },
    {
      id: "return",
      label: "回程",
      dayLabel: "Day 10",
      date: "01/31 (日)",
      flightNo: "BR 189",
      airline: "長榮航空",
      type: "直飛",
      duration: "4 小時 0 分",
      depart: { time: "10:25", code: "HND", airport: "東京羽田國際機場", terminal: "3 航廈" },
      arrive: { time: "13:25", code: "TSA", airport: "臺北松山機場", terminal: "1 航廈" },
    },
  ],
  passes: [
    {
      id: "hokuriku",
      name: "JR 北陸拱形鐵路周遊券（Hokuriku Arch Pass，連續 7 日）",
      validRange: "Day 2 ～ Day 8（連續 7 天）",
      price: null,
      coverage: [
        "Day 2：神戶 ➔ 京都/敦賀 ➔ 福井（特急 Thunder Bird + 北陸新幹線）",
        "Day 4：福井 ➔ 金澤（北陸新幹線，車程約 35 分鐘）",
        "Day 6：金澤 ➔ 高崎（北陸新幹線直達，車程約 1 小時 40 分鐘），高崎再轉乘往越後湯澤・越後中里方向（轉乘路線與時刻出發前確認）",
        "Day 2～Day 8 期間適用之市區 JR 路線。",
      ],
    },
  ],
  selfPay: [
    {
      label: "Day 1（神戶機場 ➔ 神戶市區）",
      desc: "單買 Port Liner 至三宮，或搭計程車（依住宿位置選擇）。",
    },
    {
      label: "Day 9（越後中里 ➔ 東京）",
      desc: "單買越後中里 ➔ 越後湯澤接駁 + 上越新幹線至東京。",
    },
    {
      label: "Day 10（東京 ➔ 機場）",
      desc: "單買東京 ➔ 羽田機場（東京單軌電車 / 京急線，依住宿位置選擇）。",
    },
  ],
};

export const days = [
  {
    id: 1,
    date: "01/22 (五)",
    theme: "抵達神戶・海港之夜",
    activities: [
      { time: "18:00", text: "搭乘 BR 176（14:30 自桃園起飛）抵達神戶機場，入境後前往市區" },
      { time: "晚上", text: "飯店 Check-in 卸下行李休整；視體力在神戶港塔周邊夜景散步、BE KOBE 地標合影" },
    ],
    transport: "神戶機場 ➔ 三宮（Port Liner / 計程車，自費）",
    passTag: null,
    lodging: null,
    lodgingCity: "神戶",
    meal: null,
    mealNote: "神戶牛 / 西式洋食料理",
  },
  {
    id: 2,
    date: "01/23 (六)",
    theme: "抵達福井・恐龍廣場",
    activities: [
      {
        time: "上午",
        text: "開啟用拱形 Pass，搭特急轉新幹線抵達福井；在 JR 福井站恐龍廣場與機械動態恐龍合影",
      },
      { time: "下午", text: "飯店 Check-in 放行李，福井站周邊輕鬆散步" },
      { time: "晚上", text: "享用在地名物料理" },
    ],
    transport: "JR 特急/新幹線",
    passTag: "啟用 Pass D1",
    lodging: null,
    lodgingCity: "福井",
    meal: null,
    mealNote: "福井特色醬汁豬排丼",
  },
  {
    id: 3,
    date: "01/24 (日)",
    theme: "恐龍王國・勝山大冒險",
    activities: [
      { time: "上午", text: "搭恐龍主題巴士前往勝山" },
      {
        time: "下午",
        text: "福井縣立恐龍博物館（探索 50 具恐龍全身骨骼、三面沉浸式劇院、參加室內化石研究體驗）",
      },
      { time: "晚上", text: "返回福井市區休息" },
    ],
    transport: "恐龍主題巴士",
    passTag: "Pass D2",
    lodging: null,
    lodgingCity: "福井",
    meal: null,
    mealNote: null,
  },
  {
    id: 4,
    date: "01/25 (一)",
    theme: "福井慢活 ➔ 前進金澤",
    activities: [
      { time: "上午（鬆快版）", text: "足羽山公園 / 自然史博物館輕鬆散步，眺望福井雪景" },
      { time: "下午", text: "搭北陸新幹線直達金澤（約 35 分鐘），飯店放行李後參觀金澤車站「鼓門」與商場採買" },
      { time: "晚上", text: "金澤站周邊品嘗熱騰騰名物料理" },
    ],
    transport: "北陸新幹線（福井 ➔ 金澤）",
    passTag: "Pass D3",
    lodging: null,
    lodgingCity: "金澤",
    meal: null,
    mealNote: "金澤特色關東煮 / 迴轉壽司",
  },
  {
    id: 5,
    date: "01/26 (二)",
    theme: "金澤・金箔手作與名園",
    activities: [
      { time: "上午", text: "兼六園（賞雪吊美景、尋找徽軫石燈籠）" },
      { time: "中午", text: "金澤21世紀美術館（距兼六園不遠；參觀神奇《泳池》拍水底錯覺照、戶外互動彩色裝置，泳池地下展區需事前線上預約）" },
      { time: "下午", text: "東茶屋街（體驗金箔筷/木盒 DIY 貼箔手作，品嘗整片貼滿的金箔冰淇淋）" },
      { time: "傍晚", text: "金澤城公園散步" },
    ],
    transport: "城下町周遊巴士 / 步行",
    passTag: "Pass D4",
    lodging: null,
    lodgingCity: "金澤",
    meal: null,
    mealNote: "近江町市場海鮮丼",
  },
  {
    id: 6,
    date: "01/27 (三)",
    theme: "金澤站購物 ➔ 越後中里基地",
    activities: [
      { time: "上午", text: "金澤百番街（Rinto・Anto，位於金澤站內）逛街，採買伴手禮、雪地零食與防寒小物（各店營業時間不同）" },
      { time: "下午", text: "搭乘北陸新幹線至高崎（約 1 小時 40 分鐘，沿途欣賞信越雪山群），轉乘前往越後中里並入住「旅館・レンタル ふるさと」" },
      { time: "晚上", text: "旅館休整，備妥隔日滑雪裝備（雪地零食、防寒用品建議在高崎轉乘時先採買）" },
    ],
    transport: "北陸新幹線（金澤 ➔ 高崎）＋ 轉乘往越後中里（路線與時刻待確認）",
    passTag: "Pass D5",
    lodging: "旅館・レンタル ふるさと",
    lodgingCity: "越後中里",
    meal: null,
    mealNote: null,
  },
  {
    id: 7,
    date: "01/28 (四)",
    theme: "中里スキーセンター (Day 1)",
    activities: [
      { time: "上午", text: "由越後中里住宿前往中里スキーセンター（直結 JR 越後中里站）" },
      { time: "下午", text: "租借裝備（滑雪板、雪鞋、雪衣可於雪場租借；手套與帽子需自備），親子初級滑雪與雪上玩樂" },
      { time: "傍晚", text: "返回「旅館・レンタル ふるさと」休息、享用晚餐" },
    ],
    transport: "住宿 ⇋ 中里スキーセンター（同在越後中里，交通方式待確認）",
    passTag: "Pass D6",
    lodging: "旅館・レンタル ふるさと",
    lodgingCity: "越後中里",
    meal: null,
    mealNote: null,
  },
  {
    id: 8,
    date: "01/29 (五)",
    theme: "中里スキーセンター (Day 2)",
    activities: [
      { time: "全日", text: "中里スキーセンター續滑，家庭滑雪進階練習與雪景合照" },
      { time: "傍晚", text: "歸還雪具，回「旅館・レンタル ふるさと」泡腳暖身、整理大件行李" },
    ],
    transport: "住宿 ⇋ 中里スキーセンター（同在越後中里，交通方式待確認）",
    passTag: "Pass D7",
    lodging: "旅館・レンタル ふるさと",
    lodgingCity: "越後中里",
    meal: null,
    mealNote: "家庭慶祝晚餐",
  },
  {
    id: 9,
    date: "01/30 (六)",
    theme: "越後中里 ➔ 東京",
    activities: [
      { time: "上午", text: "退房後經越後湯澤搭乘上越新幹線前往東京" },
      { time: "下午～晚上", text: "東京行程待補，飯店 Check-in" },
    ],
    transport: "越後中里 ➔ 越後湯澤 + 上越新幹線（自費/單買）",
    passTag: null,
    lodging: null,
    lodgingCity: "東京",
    meal: null,
    mealNote: null,
  },
  {
    id: 10,
    date: "01/31 (日)",
    theme: "東京 ➔ 機場 ➔ 台灣",
    activities: [
      { time: "清晨", text: "退房後前往羽田機場（第 3 航廈），建議 08:00 前抵達辦理登機；出境後可在免稅店採買最後伴手禮" },
      { time: "10:25", text: "搭乘 BR 189 自羽田起飛，13:25 抵達臺北松山機場，返回溫暖的家" },
    ],
    transport: "東京 ➔ 羽田機場（電車，自費/單買）",
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
          "現代圓形玻璃建築，最著名展品為林德羅・厄利什的《泳池》（The Swimming Pool），可體驗水上與水下的錯覺互動拍照。距兼六園不遠，可與兼六園排在同一個上午～中午。",
        transport: "搭乘巴士至「廣坂・21世紀美術館」站下車即達；從兼六園可步行前往。",
        hours: null,
        price: "泳池地下展區需事前線上預約門票",
        winterNote: "室內展區溫暖，適合冬季親子避寒看展。",
        mapQuery: "金沢21世紀美術館",
      },
      {
        name: "金澤百番街",
        nameEn: "Kanazawa Hyakubangai",
        photoSlug: "kanazawa-station",
        theme: "family",
        highlight:
          "位於金澤站內的購物商場（Rinto、Anto 等區），伴手禮、北陸名產、餐廳與超市集中，進出站動線方便，適合滑雪前補齊零食與小物。",
        transport: "JR 金澤站直結，出站即達，不需另外搭車。",
        hours: "購物多為 08:30～20:00、餐飲約 11:00～22:00（各店不同，出發前確認）",
        price: null,
        winterNote: "站內暖和、免走雪地，適合帶著行李進出；若想逛傳統百貨，可改去步行約 10～15 分鐘的金澤エムザ（營業時間為百貨公司型態，請事前確認）。",
        mapQuery: "金沢百番街",
      },
    ],
  },
  {
    region: "越後中里地區",
    items: [
      {
        name: "中里スキーセンター",
        nameEn: "Nakazato Ski Center",
        photoSlug: "yuzawa-cable-car",
        theme: "family",
        highlight:
          "直結 JR 上越線越後中里站的雪場，設有更衣室、免費休憩所、餐廳與雪具租借店，滑雪板、雪鞋、雪衣都能現場租借，適合親子輕鬆上手；另有雪橇租借可玩。",
        transport: "JR 上越線越後中里站直結；從越後湯澤站亦有接駁巴士往返（班次以官方公告為準）。",
        hours: null,
        price: null,
        winterNote: "手套與帽子雪場沒有租借需自備；售票與營運狀況請於出發前至官方網站確認最新公告。",
        mapQuery: "中里スキーセンター",
      },
      {
        name: "旅館・レンタル ふるさと",
        nameEn: null,
        photoSlug: "takasaki-guesthouse",
        theme: "family",
        highlight:
          "連住 3 晚（1/27～1/30）的住宿基地，位於越後中里，與中里スキーセンター同在一區，每天不必再搭新幹線往返，晚間可在旅館好好休息。",
        transport: "地址與從最近車站的步行／接送方式待確認，建議向旅館詢問。",
        hours: null,
        price: null,
        winterNote: "雪地路面易結冰，大件行李進出旅館時請放慢腳步；暖房與烘乾設備可事先向旅館確認。",
        mapQuery: "旅館 レンタル ふるさと 越後中里",
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
  { slug: "yuzawa-cable-car", caption: "越後中里雪場" },
];

export const routePins = [
  { order: 1, name: "神戶港 / 美利堅公園" },
  { order: 2, name: "JR 福井站恐龍廣場" },
  { order: 3, name: "福井縣立恐龍博物館" },
  { order: 4, name: "足羽山公園" },
  { order: 5, name: "金澤車站（鼓門）" },
  { order: 6, name: "兼六園 ＆ 金澤城公園" },
  { order: 7, name: "金澤21世紀美術館" },
  { order: 8, name: "金澤東茶屋街（金箔體驗工坊）" },
  { order: 9, name: "金澤百番街（金澤站內購物商場）" },
  { order: 10, name: "旅館・レンタル ふるさと（越後中里住宿基地）" },
  { order: 11, name: "中里スキーセンター（親子滑雪）" },
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
