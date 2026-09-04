import * as THREE from "three";

// Phase 1 技術驗證 —— 只證明「程序化雪景 + 效能治理」這套手法在這個專案能跑得順。
// 不接主站、不用任何外部素材。對照 doc/webgl_snow_prompt.md 的效能與品質底線逐項落地：
// fog 逐層明確指定、粒子用單一 BufferGeometry、PERF governor、webglcontextlost 降級、
// 捲動阻尼平滑、離開視窗/分頁暫停渲染。

const COARSE = matchMedia("(hover: none)").matches;
const REDUCE = matchMedia("(prefers-reduced-motion: reduce)").matches;
const DPR_CAP = COARSE ? 1.4 : 1.8;

// 量測視窗一律用 clientWidth/clientHeight，不用 innerWidth/innerHeight——
// 研究 Kage 原始碼時發現的坑：手機上 innerWidth 有時回報 layout viewport，
// 比實際看得到的畫面寬，拿去算 canvas 尺寸會把畫面右側裁掉。
const vpW = () => document.documentElement.clientWidth || innerWidth;
const vpH = () => document.documentElement.clientHeight || innerHeight;

const canvas = document.getElementById("scene");
const fallback = document.getElementById("fallback");
const hudFps = document.getElementById("hud-fps");
const hudScale = document.getElementById("hud-scale");
const hudProgress = document.getElementById("hud-progress");
const hudMode = document.getElementById("hud-mode");

function showFallback(reason) {
  fallback.classList.add("show");
  canvas.style.display = "none";
  hudMode.textContent = "靜態降級：" + reason;
}

// ---- damp：framerate 無關的臨界阻尼平滑，取代原始 scroll 百分比直接映射 ----
function damp(current, target, lambda, dt) {
  return current + (target - current) * (1 - Math.exp(-lambda * dt));
}

// ---- 場景 ----
const scene = new THREE.Scene();
const FOG_COLOR = 0x171721; // Onyx canvas，跟頁面背景一致，霧氣邊界不露餡
scene.background = new THREE.Color(FOG_COLOR);
scene.fog = new THREE.FogExp2(FOG_COLOR, 0.018);

const BASE_FOV = 50;
const camera = new THREE.PerspectiveCamera(BASE_FOV, vpW() / vpH(), 0.1, 200);
camera.position.set(0, 4, 18);

// 判斷畫面「形狀」而不是寬度斷點——直立拿的平板跟手機一樣窄長，
// 只用固定像素寬度判斷會把直立平板誤判成桌機規格，構圖裁切關鍵元素。
// 參考比例 1.62（接近桌機常見的 16:10），比這個窄就讓鏡頭後退、加大 FOV。
function aspectFix() {
  const aspect = vpW() / vpH();
  return THREE.MathUtils.clamp((1.62 - aspect) / 1.05, 0, 1);
}

let renderer;
try {
  renderer = new THREE.WebGLRenderer({
    canvas,
    antialias: true,
    alpha: false,
    powerPreference: "high-performance",
  });
} catch (err) {
  showFallback("WebGLRenderer 建立失敗：" + err.message);
  throw err;
}

// ---- 打光：冷色月光模擬 Mercury 的暗色調性 ----
scene.add(new THREE.AmbientLight(0x2a3550, 0.9));
const moon = new THREE.DirectionalLight(0xdfe6ff, 1.6);
moon.position.set(-6, 10, 4);
scene.add(moon);

// ---- 雪山稜線：displaced PlaneGeometry 做出鋸齒山形，靠打光呈現冷色高光/暗面 ----
function hash(n) {
  return (Math.sin(n * 127.1) * 43758.5453) % 1;
}
function ridgeNoise(x, seed) {
  let h = 0;
  h += Math.sin(x * 0.15 + seed) * 3.2;
  h += Math.sin(x * 0.41 + seed * 2.1) * 1.4;
  h += (hash(Math.floor(x * 2) + seed * 10) - 0.5) * 0.8;
  return h;
}
function buildMountain(z, seed, baseHeight, color) {
  const width = 90;
  const segX = 80;
  const geo = new THREE.PlaneGeometry(width, 26, segX, 1);
  const pos = geo.attributes.position;
  for (let i = 0; i < pos.count; i++) {
    const x = pos.getX(i);
    const y = pos.getY(i);
    // 只讓稜線頂端起伏，底部釘在地平線，避免整片亂飄
    const ridgeFactor = (y + 13) / 26; // 0 (底) → 1 (頂)
    const h = ridgeNoise(x, seed) * ridgeFactor;
    pos.setY(i, y + h);
  }
  geo.computeVertexNormals();
  const mat = new THREE.MeshStandardMaterial({
    color,
    roughness: 0.85,
    metalness: 0.0,
    fog: true, // 遠山務必吃霧，這是先前踩過的坑：預設值不可信，這裡逐一明確指定
  });
  const mesh = new THREE.Mesh(geo, mat);
  mesh.position.set(0, baseHeight, z);
  return mesh;
}
scene.add(buildMountain(-40, 3.1, 6, 0x3a4568));
scene.add(buildMountain(-24, 8.7, 4, 0x4c5a86));
scene.add(buildMountain(-10, 15.2, 2.4, 0xaab3d6));

// ---- 前景去背素材測試：Stanley 提供的 web/public/images 去背 PNG ----
// 用 Sprite 而不是 PlaneGeometry：Sprite 永遠面向鏡頭，符合 doc/webgl_snow_prompt.md
// 「camera-facing 平面貼圖」的介面約定。alphaTest 而不是純 blending，因為這批是硬邊
// 去背而非柔邊，alphaTest 可以避免透明排序問題（近景疊圖最容易被排序坑到）。
const cutoutLoader = new THREE.TextureLoader();
function addCutout(path, { x, y, z, height, fog = true }) {
  cutoutLoader.load(path, (tex) => {
    tex.colorSpace = THREE.SRGBColorSpace;
    const aspect = tex.image.width / tex.image.height;
    const mat = new THREE.SpriteMaterial({ map: tex, alphaTest: 0.5, fog });
    const sprite = new THREE.Sprite(mat);
    sprite.scale.set(height * aspect, height, 1);
    sprite.position.set(x, y + height / 2, z);
    scene.add(sprite);
  });
}
// 福井章節：恐龍剪影立在鏡頭會經過的路徑左側
addCutout("/images/暴龍.png", { x: -9, y: -2, z: 2, height: 7 });
// 金澤章節：鼓門置中，鏡頭快到這一段時逐漸貼近
addCutout("/images/金澤鼓門.png", { x: 0, y: -2, z: -6, height: 6 });
// 雪山基地章節：纜車吊廂懸在鏡頭路徑右側高處
addCutout("/images/纜車2.png", { x: 7, y: 4, z: -11, height: 4.5 });
// 沿途雪松，近景不吃霧，讓輪廓保持清晰
addCutout("/images/tree2.png", { x: -5, y: -2, z: 12, height: 8, fog: false });
addCutout("/images/tree4.png", { x: 6, y: -2, z: 8, height: 7, fog: false });
addCutout("/images/tree3.png", { x: -8, y: -2, z: -2, height: 5.5 });
addCutout("/images/tree5.png", { x: 9, y: -2, z: -8, height: 4.5 });

// ---- 雪地：吃霧的地面，讓遠景自然沒入夜色 ----
const groundGeo = new THREE.PlaneGeometry(120, 120, 1, 1);
const groundMat = new THREE.MeshStandardMaterial({ color: 0xe2e3ed, roughness: 1, fog: true });
const ground = new THREE.Mesh(groundGeo, groundMat);
ground.rotation.x = -Math.PI / 2;
ground.position.y = -2;
scene.add(ground);

// ---- 飄雪：單一 BufferGeometry + Points，不逐一建 mesh ----
// 每片雪花的水平位置不是固定值，而是「錨點 + 各自相位的 sway」，飄落速度、
// 搖擺頻率、搖擺幅度也都各自隨機，落下軌跡才會亂序、不同步。
// 快落到地面（生命尾段）時，顏色從 Ivory 雪白漸變成 Champagne Gold 金箔色。
const SNOW_COUNT = COARSE ? 900 : 2200;
const SNOW_TOP = 28;
const SNOW_BOTTOM = -2;
const SNOW_WHITE = new THREE.Color(0xededf3);
const SNOW_GOLD = new THREE.Color(0xd4af37);
const snowGeo = new THREE.BufferGeometry();
const snowPos = new Float32Array(SNOW_COUNT * 3);
const snowColor = new Float32Array(SNOW_COUNT * 3);
const snowBaseX = new Float32Array(SNOW_COUNT);
const snowSpeed = new Float32Array(SNOW_COUNT);
const snowSwayAmp = new Float32Array(SNOW_COUNT);
const snowSwayFreq = new Float32Array(SNOW_COUNT);
const snowSwayPhase = new Float32Array(SNOW_COUNT);
function rollSnowFlake(i) {
  snowBaseX[i] = (Math.random() - 0.5) * 60;
  snowSpeed[i] = 1.2 + Math.random() * 1.8;
  snowSwayAmp[i] = 0.6 + Math.random() * 1.8;
  snowSwayFreq[i] = 0.3 + Math.random() * 0.9;
  snowSwayPhase[i] = Math.random() * Math.PI * 2;
}
for (let i = 0; i < SNOW_COUNT; i++) {
  rollSnowFlake(i);
  snowPos[i * 3 + 0] = snowBaseX[i];
  snowPos[i * 3 + 1] = Math.random() * (SNOW_TOP - SNOW_BOTTOM) + SNOW_BOTTOM;
  snowPos[i * 3 + 2] = (Math.random() - 0.5) * 50;
  SNOW_WHITE.toArray(snowColor, i * 3);
}
snowGeo.setAttribute("position", new THREE.BufferAttribute(snowPos, 3));
snowGeo.setAttribute("color", new THREE.BufferAttribute(snowColor, 3));

// PointsMaterial 預設畫方形點，貼一張圓形柔邊的 sprite 貼圖才會是圓的雪花
function buildSnowSprite() {
  const size = 64;
  const c = document.createElement("canvas");
  c.width = c.height = size;
  const ctx = c.getContext("2d");
  const g = ctx.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2);
  g.addColorStop(0, "rgba(255,255,255,1)");
  g.addColorStop(0.6, "rgba(255,255,255,0.7)");
  g.addColorStop(1, "rgba(255,255,255,0)");
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, size, size);
  const tex = new THREE.CanvasTexture(c);
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}
const snowMat = new THREE.PointsMaterial({
  size: 0.16,
  map: buildSnowSprite(),
  vertexColors: true, // 每片雪花要能各自變金箔色，顏色不能是材質統一值
  transparent: true,
  opacity: 0.85,
  depthWrite: false,
  alphaTest: 0.05,
  fog: false, // 雪花是近景疊層，不吃遠景霧，避免整片糊掉
});
const snow = new THREE.Points(snowGeo, snowMat);
scene.add(snow);

// ---- PERF governor：量測實際幀時間，動態調整渲染解析度 ----
const PERF = { scale: 1, acc: 0, n: 0 };
function applyPixelRatio() {
  renderer.setPixelRatio(Math.min(devicePixelRatio || 1, DPR_CAP) * PERF.scale);
}
function resize() {
  const w = vpW();
  const h = vpH();
  camera.aspect = w / h;
  camera.updateProjectionMatrix();
  applyPixelRatio();
  renderer.setSize(w, h, false);
}
applyPixelRatio();
resize();

// ---- 捲動進度：阻尼平滑，不是原始 % 直接映射 ----
const RIG = { progress: 0, smooth: 0 };
let snowClock = 0;
const tmpSnowColor = new THREE.Color();
const _camPos = new THREE.Vector3();
const _camTarget = new THREE.Vector3();
const _camDir = new THREE.Vector3();
function scrollProgress() {
  const max = document.documentElement.scrollHeight - vpH();
  return max > 0 ? Math.min(1, Math.max(0, scrollY / max)) : 0;
}

// ---- 可見性治理：離開視窗或分頁背景就暫停渲染迴圈 ----
let running = false;
let visible = true;
let raf = null;
let last = performance.now();

function frame(now) {
  if (!running) return;
  const dt = Math.min(0.05, (now - last) / 1000);
  last = now;

  RIG.progress = scrollProgress();
  RIG.smooth = REDUCE ? RIG.progress : damp(RIG.smooth, RIG.progress, 3.4, dt);

  // 鏡頭沿一條簡單路徑推進：從港邊高處慢慢貼近雪山、爬升俯瞰
  _camPos.set(Math.sin(RIG.smooth * Math.PI) * 4, 4 + RIG.smooth * 6, 18 - RIG.smooth * 30);
  _camTarget.set(0, 2 + RIG.smooth * 2, -20);

  // 窄長畫面（直立平板、手機）用同一組運鏡座標會裁掉山頭/前景，
  // 所以沿視線方向後退、加大 FOV，構圖比例判斷用長寬比，不是像素寬度斷點。
  const nf = aspectFix();
  if (nf > 0) {
    _camDir.subVectors(_camPos, _camTarget).normalize();
    _camPos.addScaledVector(_camDir, nf * 8);
    _camPos.y += nf * 1.0;
  }
  const fov = BASE_FOV * (1 + nf * 0.4);
  if (Math.abs(camera.fov - fov) > 1e-3) {
    camera.fov = fov;
    camera.updateProjectionMatrix();
  }

  camera.position.copy(_camPos);
  camera.lookAt(_camTarget);

  if (!REDUCE) {
    const pos = snowGeo.attributes.position;
    const col = snowGeo.attributes.color;
    snowClock += dt;
    for (let i = 0; i < SNOW_COUNT; i++) {
      let y = pos.getY(i) - snowSpeed[i] * dt;
      if (y < SNOW_BOTTOM) {
        y = SNOW_TOP;
        rollSnowFlake(i); // 重新落下時整組亂序參數重擲一次，不會每輪都同一批同步飄
      }
      pos.setY(i, y);
      pos.setX(i, snowBaseX[i] + Math.sin(snowClock * snowSwayFreq[i] + snowSwayPhase[i]) * snowSwayAmp[i]);

      // 生命尾段（快落地）漸變成金箔色：0 = 剛落下的雪白，1 = 落地前一刻的金箔
      const fallFrac = 1 - (y - SNOW_BOTTOM) / (SNOW_TOP - SNOW_BOTTOM);
      const goldMix = THREE.MathUtils.smoothstep(fallFrac, 0.72, 1.0);
      tmpSnowColor.copy(SNOW_WHITE).lerp(SNOW_GOLD, goldMix);
      tmpSnowColor.toArray(snowColor, i * 3);
    }
    pos.needsUpdate = true;
    col.needsUpdate = true;
  }

  // PERF governor：每 40 幀或累積誤差夠大就評估一次
  const raw = dt;
  PERF.acc += raw;
  PERF.n++;
  if (PERF.n >= 40) {
    const avg = PERF.acc / PERF.n;
    PERF.acc = 0;
    PERF.n = 0;
    if (avg > 0.023 && PERF.scale > 0.55) {
      PERF.scale = Math.max(0.55, PERF.scale * (avg > 0.05 ? 0.64 : 0.85));
      applyPixelRatio();
    } else if (avg < 0.0138 && PERF.scale < 1) {
      PERF.scale = Math.min(1, PERF.scale + 0.08);
      applyPixelRatio();
    }
    hudFps.textContent = Math.round(1 / avg);
    hudScale.textContent = PERF.scale.toFixed(2);
  }
  hudProgress.textContent = Math.round(RIG.progress * 100) + "%";

  renderer.render(scene, camera);
  raf = requestAnimationFrame(frame);
}

function start() {
  if (running || !visible) return;
  running = true;
  last = performance.now();
  raf = requestAnimationFrame(frame);
}
function stop() {
  running = false;
  if (raf) cancelAnimationFrame(raf);
}

// ---- context loss：優雅退回靜態畫面，不是空白 ----
canvas.addEventListener(
  "webglcontextlost",
  (e) => {
    e.preventDefault();
    stop();
    showFallback("WebGL context lost");
  },
  false,
);
canvas.addEventListener("webglcontextrestored", () => {
  fallback.classList.remove("show");
  canvas.style.display = "block";
  hudMode.textContent = "";
  start();
});

const io = new IntersectionObserver((entries) => {
  visible = entries[entries.length - 1]?.isIntersecting ?? false;
  if (visible) start();
  else stop();
});
io.observe(canvas);

document.addEventListener("visibilitychange", () => {
  if (document.hidden) stop();
  else if (visible) start();
});

addEventListener("resize", resize, { passive: true });
addEventListener("orientationchange", () => setTimeout(resize, 250), { passive: true }); // 手機/平板轉向後版面要重量測
addEventListener("scroll", () => {}, { passive: true }); // scrollProgress() 在 frame() 內主動讀取，這裡只確保不被動阻塞

if (REDUCE) hudMode.textContent = "已偵測 prefers-reduced-motion，鏡頭與飄雪動畫關閉";

resize();
renderer.render(scene, camera); // 先畫一幀，避免首屏是空的
start();

// 除錯用：只在 POC 階段暴露狀態，方便從 console 檢查鏡頭/場景，不會帶進正式站。
window.__poc = { scene, camera, renderer, RIG, get running() { return running; } };
