import { useEffect } from "react";

const DESIGN_W = 2910;
const MOBILE_BP = 860;
const MOUSE_FADE_RADIUS = 420;
const SCROLL_FADE_END = 600;

function smoothstep(edge0, edge1, x) {
  const t = Math.min(1, Math.max(0, (x - edge0) / (edge1 - edge0)));
  return t * t * (3 - 2 * t);
}

export function ParallaxHero() {
  useEffect(() => {
    const coarse = matchMedia("(hover: none)").matches;
    const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
    const body = document.body;
    const canvas = document.getElementById("parallax-canvas");
    const layers = Array.from(document.querySelectorAll("#parallax-canvas .layer, #parallax-canvas .wordmark"));
    const mouseFadeLayers = layers.filter((el) => el.dataset.mouseFade);
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
      return (document.documentElement.clientWidth || window.innerWidth) < MOBILE_BP;
    }

    function applyZoom() {
      if (!canvas) return;
      const vw = document.documentElement.clientWidth || window.innerWidth;
      zoom = Math.min(1, vw / DESIGN_W);
      canvas.style.setProperty("--z", zoom);

      // 動態根據當前螢幕高度與 zoom 倍率，計算 #parallax-canvas 所需的總設計高度，
      // 確保鼓門登場 ➔ 恐龍登場/停留/退場全過程完成後，下方的路線總覽黑底區塊才會剛好向上滑入，
      // 解決大螢幕與各種寬高比下恐龍尚未登場就被路線總覽遮擋的問題！
      const gateThresholdScreen = window.innerHeight * 0.15;
      const yGateFull = (1266 * zoom - gateThresholdScreen) / 0.32;
      const ENTER_WINDOW_PX = 500;
      const HOLD_WINDOW_PX = 400;
      const EXIT_WINDOW_PX = 500;
      const totalScrollScreen = yGateFull + ENTER_WINDOW_PX + HOLD_WINDOW_PX + EXIT_WINDOW_PX + window.innerHeight * 0.8;
      const canvasDesignHeight = Math.max(6500, totalScrollScreen / zoom);
      canvas.style.height = `${canvasDesignHeight}px`;
    }

    function applyDesktopScroll() {
      const y = window.scrollY;
      const hudStatusEl = document.getElementById("hud-status");

      // 一旦捲動超過視差雪景/鼓門區域 (y > 3500px)，視差位移即凍結上限，
      // 防止遠景雲層 (cloud.png) 與雪山無限向下漂移遮擋下方的行程卡片。
      const parallaxY = Math.min(y, 3500);

      // 金澤鼓門在設計稿：top = 1266px, height = 1968px
      // 鼓門頂端在當前螢幕視窗中的 pixel 位置 = (1266 * zoom) - (y * 0.32)
      const gateTopScreen = 1266 * zoom - y * 0.32;
      const gateThresholdScreen = window.innerHeight * 0.15;
      const isGateFullyVisible = gateTopScreen <= gateThresholdScreen;

      const yGateFull = (1266 * zoom - gateThresholdScreen) / 0.32;
      const scrollAfterGate = y - yGateFull;

      const ENTER_WINDOW_PX = 500;
      const HOLD_WINDOW_PX = 400;
      const EXIT_WINDOW_PX = 500;

      for (const el of layers) {
        const speed = parseFloat(el.dataset.speed) || 1;
        const dy = (parallaxY * (1 - speed)) / zoom;

        let dx = 0;
        if (el.dataset.revealX && !reduce) {
          const from = parseFloat(el.dataset.revealX);

          if (scrollAfterGate < 0) {
            dx = from;
          } else if (scrollAfterGate <= ENTER_WINDOW_PX) {
            const progress = smoothstep(0, ENTER_WINDOW_PX, scrollAfterGate);
            dx = from * (1 - progress);
          } else if (scrollAfterGate <= ENTER_WINDOW_PX + HOLD_WINDOW_PX) {
            dx = 0;
          } else if (scrollAfterGate <= ENTER_WINDOW_PX + HOLD_WINDOW_PX + EXIT_WINDOW_PX) {
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
        if (el.dataset.burst && !reduce) {
          const rate = parseFloat(el.dataset.burst);
          const s = Math.min(1.35, 1 + Math.max(0, y) * rate);
          scaleStr = ` scale(${s.toFixed(4)})`;
        }

        el.style.transform = `translate(${dx}px, ${dy}px)${scaleStr}`;
      }

      if (hudStatusEl) {
        if (!isGateFullyVisible) {
          hudStatusEl.textContent = "鼓門狀態：進入畫面中 (恐龍等待登場)";
          hudStatusEl.style.color = "#666";
        } else if (scrollAfterGate <= ENTER_WINDOW_PX) {
          const pct = Math.round(smoothstep(0, ENTER_WINDOW_PX, scrollAfterGate) * 100);
          hudStatusEl.textContent = `鼓門狀態：已完全呈現 ➔ 恐龍登場 (${pct}%)`;
          hudStatusEl.style.color = "#d97706";
        } else if (scrollAfterGate <= ENTER_WINDOW_PX + HOLD_WINDOW_PX) {
          hudStatusEl.textContent = "鼓門狀態：已完全呈現 ➔ 恐龍登場 (停留中)";
          hudStatusEl.style.color = "#16a34a";
        } else if (scrollAfterGate <= ENTER_WINDOW_PX + HOLD_WINDOW_PX + EXIT_WINDOW_PX) {
          hudStatusEl.textContent = "鼓門狀態：已完全呈現 ➔ 恐龍退場中";
          hudStatusEl.style.color = "#dc2626";
        } else {
          hudStatusEl.textContent = "鼓門狀態：已完全呈現 (恐龍已離場)";
          hudStatusEl.style.color = "#888";
        }
      }

      const scrollFade = reduce ? 1 : 1 - smoothstep(0, SCROLL_FADE_END, y);
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
      if (mode !== "desktop" || coarse || mouseTicking) return;
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
          const proximity = 1 - smoothstep(0, MOUSE_FADE_RADIUS, dist);
          setFade(el, "mouse", 1 - proximity * 0.92);
        }
      });
    }

    let mobileObserver = null;
    function setupMobile() {
      if (mobileObserver || reduce) return;
      mobileObserver = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            entry.target.classList.toggle("in", entry.isIntersecting);
          });
        },
        { threshold: 0.55 }
      );
      document.querySelectorAll("#parallax-mobile .m-section").forEach((el) => mobileObserver.observe(el));
    }
    function teardownMobile() {
      if (mobileObserver) {
        mobileObserver.disconnect();
        mobileObserver = null;
      }
    }

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

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("pointermove", onPointerMove, { passive: true });
    const onResize = () => {
      evaluateMode();
      if (mode === "desktop") {
        applyZoom();
        applyDesktopScroll();
      }
    };
    window.addEventListener("resize", onResize, { passive: true });

    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("resize", onResize);
      teardownMobile();
      body.classList.remove("is-mobile");
    };
  }, []);

  return (
    <>
      <div id="parallax-hud">
        <div><b>Phase 1 POC</b> — 2D 視差雪景 × 金澤鼓門</div>
        <div id="hud-status" style={{ marginTop: "4px", fontWeight: 600, color: "#888" }}>
          鼓門狀態：偵測中...
        </div>
      </div>

      {/* 桌機版 2D 視差繪圖層 */}
      <div id="parallax-canvas">
        <div className="layer" data-speed="0.08" style={{ left: "-22px", top: 0, width: "2910px", height: "1439px", zIndex: 1 }}>
          <img src="/images/cloud.png" alt="雲" />
        </div>

        <div className="layer" data-speed="0.55" style={{ left: "218px", top: "917px", width: "302px", height: "472px", zIndex: 2 }}>
          <img src="/images/tree5.png" alt="雪松" />
        </div>

        <div className="wordmark" data-speed="0.18" style={{ left: "97.01px", top: "249.41px", width: "2722.94px", height: "744.5px", zIndex: 3 }}>
          <img src="/poc-parallax/snow-travel.svg" alt="SNOW TRAVEL" />
        </div>

        <div className="layer" data-speed="0.15" style={{ left: "-22px", top: "285px", width: "2910px", height: "1439px", zIndex: 4 }}>
          <img src="/images/mountain.png" alt="雪山" />
        </div>

        <div className="wordmark" data-speed="0.22" style={{ left: "731.51px", top: "-142.46px", width: "1328.85px", height: "888.662px", zIndex: 5 }}>
          <img src="/poc-parallax/setsuraku.svg" alt="雪楽" />
        </div>

        <div className="layer hero-visual" data-speed="0.22" data-burst="0.00022" style={{ left: "520px", top: "71px", width: "1444px", height: "2165px", zIndex: 8, transformOrigin: "50% 62%" }}>
          <img src="/images/Gemini_Generated_Image_l7ddnzl7ddnzl7dd.png" alt="雪山主視覺" />
        </div>

        <div className="layer" id="gate-layer" data-speed="0.32" style={{ left: "-67px", top: "1266px", width: "2955px", height: "1968px", zIndex: 9 }}>
          <img src="/images/金澤鼓門_1.png" alt="金澤鼓門" />
        </div>

        <div className="layer" data-speed="0.48" data-mouse-fade="1" style={{ left: "-291px", top: "121px", width: "811px", height: "1381px", zIndex: 10 }}>
          <img src="/images/tree2.png" alt="雪松" />
        </div>

        <div className="layer" data-speed="0.5" data-mouse-fade="1" style={{ left: "2597px", top: "917px", width: "328px", height: "691px", zIndex: 11 }}>
          <img src="/images/tree3.png" alt="雪松" />
        </div>

        <div className="layer" data-speed="0.55" style={{ left: "-87px", top: "917px", width: "507px", height: "794px", zIndex: 12 }}>
          <img src="/images/tree5.png" alt="雪松" />
        </div>

        <div className="layer" id="dino-layer" data-speed="0.32" data-reveal-x="-1900" style={{ left: "139px", top: "1720px", width: "1602px", height: "1536px", zIndex: 13 }}>
          <img src="/images/暴龍.png" alt="暴龍" style={{ transform: "scaleX(-1)" }} />
        </div>

        <div className="layer" data-speed="0.5" style={{ left: "2122px", top: "1590px", width: "1151px", height: "2937px", zIndex: 14 }}>
          <img src="/images/tree4.png" alt="雪松" />
        </div>

        <div className="layer" data-speed="0.46" style={{ left: "-510px", top: "1807px", width: "1457px", height: "3059px", zIndex: 15 }}>
          <img src="/images/tree2.png" alt="雪松" />
        </div>
      </div>

      {/* 手機版直式敘事 */}
      <div id="parallax-mobile">
        <section className="m-section">
          <div className="m-bg"><img src="/images/cloud.png" alt="雲" /></div>
          <div className="m-bg"><img src="/images/mountain.png" alt="雪山" /></div>
          <div className="m-snowboarder"><img src="/images/Gemini_Generated_Image_l7ddnzl7ddnzl7dd.png" alt="雪山主視覺" /></div>
          <div className="m-hero-title">
            <img src="/poc-parallax/setsuraku.svg" alt="雪楽" />
          </div>
        </section>

        <section className="m-section" id="m-dino-section">
          <div className="m-bg"><img src="/images/金澤鼓門_1.png" alt="金澤鼓門" /></div>
          <div className="m-dino-wrap">
            <div className="m-dino"><img src="/images/暴龍.png" alt="暴龍" /></div>
            <div className="m-tree-l"><img src="/images/tree2.png" alt="雪松" /></div>
            <div className="m-tree-r"><img src="/images/tree4.png" alt="雪松" /></div>
          </div>
          <div className="m-caption">福井 · 恐龍王國</div>
        </section>
      </div>
    </>
  );
}
