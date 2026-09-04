// Phase 1 技術驗證 —— 把 Stanley 的 Figma 樣板（byL4GLYp9nRyplxWYqbDlE, node 19:39）
// 轉成真的可以捲動的 2D 視差頁面。不接主站、只用 web/public/images 既有素材。
//
// 深度位移：#canvas 是整張設計稿（2910×6600px），用 CSS `zoom` 依視窗寬度整體縮放。
// 每個 [data-speed] 圖層在捲動時額外位移 scrollY*(1-speed)，speed 越接近 1（近景）位移
// 越小、跟頁面捲動幾乎同步；越接近 0（遠景）位移越大、相對頁面捲動顯得「落後」，因而
// 顯得更遠。這個位移量最後要除回目前的 zoom 倍率，否則縮放後的視覺位移會跟實際捲動
// 距離對不上。置中的美術字改用固定 left 像素、不再靠 transform:translateX(-50%)——
// 這裡的 JS 每幀都會整個覆寫 el.style.transform，用 transform 做置中會被蓋掉。
//
// 側向登場：暴龍帶 data-reveal-x／data-reveal-center——三段式進場／停留／退場。
// 捲到接近牠「畫面視覺中心」的位置時，從左側完整滑出來；停留一段捲動距離；
// 接著原路退回左邊，重新被前面兩棵大雪松（Figma 疊層順序在牠之上）半遮著。
//
// 衝出感：滑雪者主視覺帶 data-burst——捲動時額外疊加一個緩慢放大的 scale，模擬鏡頭
// 往前推、朝觀眾衝出來的感覺。
//
// 淡出：滑雪者兩旁的雪松帶 data-mouse-fade，有兩個獨立的淡出來源——
// (1) 捲動：往下捲過 hero 段落時直接淡出，不用等互動，桌機/觸控裝置都會發生；
// (2) 滑鼠：桌機額外疊加，滑鼠越靠近該圖層透明度越低（觸控裝置沒有 hover，不做這個）。
// 兩者各自算好各自的透明度，最後相乘取值，不會互相蓋掉對方的效果。

const COARSE = matchMedia("(hover: none)").matches;
const REDUCE = matchMedia("(prefers-reduced-motion: reduce)").matches;
const DESIGN_W = 2910;
const MOBILE_BP = 860; // 跟 three-poc 研究 Kage 時記下的斷點一致
const ENTER_WINDOW = 900; // 進場的 design-px 範圍，值越大＝越早開始、越慢滑出
const HOLD_WINDOW = 500; // 完全衝出來之後，停留不動的 design-px 範圍
const EXIT_WINDOW = 900; // 退場的 design-px 範圍，原路退回左邊
const MOUSE_FADE_RADIUS = 420; // 滑鼠淡出效果的作用半徑（真實螢幕 px）
const SCROLL_FADE_END = 600; // 往下捲過這個距離（真實 px），兩旁雪松就完全淡出

const body = document.body;
const canvas = document.getElementById("canvas");
const layers = Array.from(document.querySelectorAll(".layer, .wordmark"));
const mouseFadeLayers = layers.filter((el) => el.dataset.mouseFade);

// 每個淡出圖層有兩個獨立的透明度來源（捲動／滑鼠），相乘取最終值，
// 這樣兩種效果互不覆蓋——只用 el.style.opacity 存單一數字會互相打架。
const fadeState = new WeakMap();
function setFade(el, key, value) {
  const state = fadeState.get(el) || { scroll: 1, mouse: 1 };
  state[key] = value;
  fadeState.set(el, state);
  el.style.opacity = String(state.scroll * state.mouse);
}

let zoom = 1;
let mode = null; // "desktop" | "mobile"

function isMobileViewport() {
  return (document.documentElement.clientWidth || innerWidth) < MOBILE_BP;
}

function smoothstep(edge0, edge1, x) {
  const t = Math.min(1, Math.max(0, (x - edge0) / (edge1 - edge0)));
  return t * t * (3 - 2 * t);
}

/* ============ 桌機版：固定設計稿 + 位移 ============ */

function applyZoom() {
  const vw = document.documentElement.clientWidth || innerWidth;
  zoom = Math.min(1, vw / DESIGN_W);
  canvas.style.setProperty("--z", zoom);
}

function applyDesktopScroll() {
  const y = scrollY;
  const gateEl = document.getElementById("gate-layer");
  const hudStatusEl = document.getElementById("hud-status");

  // 金澤鼓門在設計稿：top = 1266px, height = 1968px
  // 鼓門視差速度 speed = 0.32
  // 鼓門頂端在當前螢幕視窗中的 pixel 位置 = (1266 * zoom) - (y * 0.32)
  const gateTopScreen = 1266 * zoom - y * 0.32;
  // 當鼓門頂端滾動至螢幕上半部（距離視窗頂端 <= 15% innerHeight），代表鼓門宏偉主體已完整充滿畫面呈現
  const gateThresholdScreen = innerHeight * 0.15;
  const isGateFullyVisible = gateTopScreen <= gateThresholdScreen;

  // 鼓門主體剛好完整呈現於畫面時的 scrollY (螢幕 px)
  const yGateFull = (1266 * zoom - gateThresholdScreen) / 0.32;
  const scrollAfterGate = y - yGateFull;

  // 恐龍登場動畫階段距離 (螢幕 px)
  const ENTER_WINDOW_PX = 500; // 由左向右滑入距離
  const HOLD_WINDOW_PX = 400;  // 登場後停留距離
  const EXIT_WINDOW_PX = 500;  // 原路退回左側距離

  for (const el of layers) {
    const speed = parseFloat(el.dataset.speed) || 1;
    const dy = (y * (1 - speed)) / zoom;

    let dx = 0;
    if (el.dataset.revealX && !REDUCE) {
      const from = parseFloat(el.dataset.revealX);

      if (scrollAfterGate < 0) {
        // 鼓門尚未完全呈現於畫面：恐龍隱藏於左側外
        dx = from;
      } else if (scrollAfterGate <= ENTER_WINDOW_PX) {
        // 鼓門完全呈現 ➔ 恐龍由左往右滑入 (from -> 0)
        const progress = smoothstep(0, ENTER_WINDOW_PX, scrollAfterGate);
        dx = from * (1 - progress);
      } else if (scrollAfterGate <= ENTER_WINDOW_PX + HOLD_WINDOW_PX) {
        // 恐龍完全登場，停留不動
        dx = 0;
      } else if (scrollAfterGate <= ENTER_WINDOW_PX + HOLD_WINDOW_PX + EXIT_WINDOW_PX) {
        // 繼續往下捲：恐龍原路退回左側 (0 -> from)
        const exitProgress = smoothstep(
          ENTER_WINDOW_PX + HOLD_WINDOW_PX,
          ENTER_WINDOW_PX + HOLD_WINDOW_PX + EXIT_WINDOW_PX,
          scrollAfterGate
        );
        dx = from * exitProgress;
      } else {
        dx = from;
      }
    }

    let scaleStr = "";
    if (el.dataset.burst && !REDUCE) {
      const rate = parseFloat(el.dataset.burst);
      const s = Math.min(1.35, 1 + Math.max(0, y) * rate);
      scaleStr = ` scale(${s.toFixed(4)})`;
    }

    el.style.transform = `translate(${dx}px, ${dy}px)${scaleStr}`;
  }

  // 即時更新 HUD 狀態指示
  if (hudStatusEl) {
    if (!isGateFullyVisible) {
      hudStatusEl.textContent = "鼓門狀態：進入畫面中 (恐龍等待登場)";
      hudStatusEl.style.color = "#666";
    } else if (scrollAfterGate <= ENTER_WINDOW_PX) {
      const pct = Math.round(smoothstep(0, ENTER_WINDOW_PX, scrollAfterGate) * 100);
      hudStatusEl.textContent = `鼓門狀態：已完全呈現 ➔ 恐龍由左往右登場 (${pct}%)`;
      hudStatusEl.style.color = "#d97706";
    } else if (scrollAfterGate <= ENTER_WINDOW_PX + HOLD_WINDOW_PX) {
      hudStatusEl.textContent = "鼓門狀態：已完全呈現 ➔ 恐龍完全登場 (停留中)";
      hudStatusEl.style.color = "#16a34a";
    } else if (scrollAfterGate <= ENTER_WINDOW_PX + HOLD_WINDOW_PX + EXIT_WINDOW_PX) {
      hudStatusEl.textContent = "鼓門狀態：已完全呈現 ➔ 恐龍退場中";
      hudStatusEl.style.color = "#dc2626";
    } else {
      hudStatusEl.textContent = "鼓門狀態：已完全呈現 (恐龍已原路離場)";
      hudStatusEl.style.color = "#888";
    }
  }

  const scrollFade = REDUCE ? 1 : 1 - smoothstep(0, SCROLL_FADE_END, y);
  for (const el of mouseFadeLayers) setFade(el, "scroll", scrollFade);
}

let scrollTicking = false;
function onScroll() {
  if (mode !== "desktop" || scrollTicking) return;
  scrollTicking = true;
  requestAnimationFrame(() => {
    scrollTicking = false;
    applyDesktopScroll();
  });
}

let mouseTicking = false;
function onPointerMove(e) {
  if (mode !== "desktop" || COARSE || mouseTicking) return;
  mouseTicking = true;
  const mx = e.clientX;
  const my = e.clientY;
  requestAnimationFrame(() => {
    mouseTicking = false;
    for (const el of mouseFadeLayers) {
      const rect = el.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      const dist = Math.hypot(mx - cx, my - cy);
      const proximity = 1 - smoothstep(0, MOUSE_FADE_RADIUS, dist); // 1=貼近, 0=遠
      setFade(el, "mouse", 1 - proximity * 0.92);
    }
  });
}

/* ============ Pad / Phone 版：簡化的直式敘事 ============ */

let mobileObserver = null;
function setupMobile() {
  if (mobileObserver || REDUCE) return; // reduced-motion 直接維持 CSS 預設狀態（隱藏但無動畫也行，這裡選擇不隱藏）
  mobileObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        entry.target.classList.toggle("in", entry.isIntersecting);
      });
    },
    { threshold: 0.55 },
  );
  document.querySelectorAll("#mobile .m-section").forEach((el) => mobileObserver.observe(el));
}
function teardownMobile() {
  if (mobileObserver) {
    mobileObserver.disconnect();
    mobileObserver = null;
  }
}

/* ============ 模式切換 ============ */

function setMode(next) {
  if (mode === next) return;
  mode = next;
  body.classList.toggle("is-mobile", next === "mobile");
  if (next === "mobile") {
    setupMobile();
  } else {
    teardownMobile();
    applyZoom();
    applyDesktopScroll();
  }
}

function evaluateMode() {
  setMode(isMobileViewport() ? "mobile" : "desktop");
}

evaluateMode();
if (mode === "desktop") applyDesktopScroll();

addEventListener("scroll", onScroll, { passive: true });
addEventListener("pointermove", onPointerMove, { passive: true });
addEventListener(
  "resize",
  () => {
    evaluateMode();
    if (mode === "desktop") {
      applyZoom();
      applyDesktopScroll();
    }
  },
  { passive: true },
);
addEventListener(
  "orientationchange",
  () =>
    setTimeout(() => {
      evaluateMode();
      if (mode === "desktop") {
        applyZoom();
        applyDesktopScroll();
      }
    }, 250),
  { passive: true },
);

const hud = document.getElementById("hud");
if (REDUCE) {
  hud.insertAdjacentHTML("beforeend", "<div>已偵測 prefers-reduced-motion，視差／登場／捲動放大全部關閉</div>");
}
if (COARSE) {
  hud.insertAdjacentHTML(
    "beforeend",
    "<div>觸控裝置：滑鼠淡出效果停用，pad/phone 走簡化版直式敘事；素材未壓縮，正式站前需要另外處理</div>",
  );
}
