import { useEffect, useRef, useState } from "react";
import { Map as MapLibreMap, NavigationControl, FullscreenControl, Popup, LngLatBounds, setWorkerUrl } from "maplibre-gl";
import workerUrl from "maplibre-gl/dist/maplibre-gl-worker.mjs?url";
import "maplibre-gl/dist/maplibre-gl.css";
import pistes from "../data/nakazatoPistes.json";

// Vite 打包後 import.meta.url 會指向合併後的 chunk，MapLibre 找不到預設的 worker 檔，
// 所以把 worker 當成靜態資源輸出，再明確告訴 MapLibre 去哪裡載。
setWorkerUrl(workerUrl);

// 日本雪場慣用配色：初級綠、中級紅、上級黑（與 index.css 的 --color-piste-* 同步）。
const DIFFICULTY_COLOR = {
  novice: "#2e9e4f",
  easy: "#2e9e4f",
  intermediate: "#d6343a",
  advanced: "#1d1d26",
  expert: "#1d1d26",
};
const DIFFICULTY_LABEL = { novice: "初級", easy: "初級", intermediate: "中級", advanced: "上級", expert: "上級" };
const LIFT_COLOR = "#5266eb";

// 雪場落差只有約 244m，照真實比例看起來很平，地形高度放大讓雪道起伏看得出來。
const EXAGGERATION = 1.8;
// 從山腳（車站側、西邊）往山頂（東邊）看，像傳統雪道圖的視角。
const DEFAULT_VIEW = { bearing: 78, pitch: 62 };

const difficultyColor = [
  "match",
  ["get", "difficulty"],
  ...Object.entries(DIFFICULTY_COLOR).flat(),
  DIFFICULTY_COLOR.easy,
];

function boundsOf(collection) {
  const b = new LngLatBounds();
  for (const f of collection.features) {
    const rings = f.geometry.type === "Polygon" ? f.geometry.coordinates : [f.geometry.coordinates];
    for (const ring of rings) for (const c of ring) b.extend(c);
  }
  return b;
}

function addTrailLayers(map) {
  map.addSource("terrain", {
    type: "raster-dem",
    tiles: ["https://tiles.mapterhorn.com/{z}/{x}/{y}.webp"],
    encoding: "terrarium",
    tileSize: 512,
    maxzoom: 14,
    attribution: "© Mapterhorn",
  });
  map.addSource("hillshade-dem", {
    type: "raster-dem",
    tiles: ["https://tiles.mapterhorn.com/{z}/{x}/{y}.webp"],
    encoding: "terrarium",
    tileSize: 512,
    maxzoom: 14,
  });
  map.setTerrain({ source: "terrain", exaggeration: EXAGGERATION });

  map.addLayer({
    id: "hillshade",
    type: "hillshade",
    source: "hillshade-dem",
    paint: { "hillshade-exaggeration": 0.45, "hillshade-shadow-color": "#3b4252" },
  });

  map.addSource("pistes", {
    type: "geojson",
    data: pistes,
    attribution: "雪道與纜車 © OpenStreetMap contributors（ODbL）",
  });

  map.addLayer({
    id: "resort-area",
    type: "fill",
    source: "pistes",
    filter: ["==", ["get", "kind"], "boundary"],
    paint: { "fill-color": "#ffffff", "fill-opacity": 0.35 },
  });
  map.addLayer({
    id: "piste-casing",
    type: "line",
    source: "pistes",
    filter: ["in", ["get", "kind"], ["literal", ["piste", "connection"]]],
    layout: { "line-cap": "round", "line-join": "round" },
    paint: { "line-color": "#ffffff", "line-width": ["interpolate", ["linear"], ["zoom"], 13, 4, 17, 10], "line-opacity": 0.9 },
  });
  map.addLayer({
    id: "piste",
    type: "line",
    source: "pistes",
    filter: ["in", ["get", "kind"], ["literal", ["piste", "connection"]]],
    layout: { "line-cap": "round", "line-join": "round" },
    paint: { "line-color": difficultyColor, "line-width": ["interpolate", ["linear"], ["zoom"], 13, 2, 17, 6] },
  });
  map.addLayer({
    id: "playground",
    type: "line",
    source: "pistes",
    filter: ["==", ["get", "kind"], "playground"],
    layout: { "line-cap": "round" },
    paint: { "line-color": "#d4af37", "line-width": ["interpolate", ["linear"], ["zoom"], 13, 3, 17, 8] },
  });
  map.addLayer({
    id: "lift",
    type: "line",
    source: "pistes",
    filter: ["in", ["get", "kind"], ["literal", ["lift", "carpet"]]],
    paint: {
      "line-color": LIFT_COLOR,
      "line-width": ["interpolate", ["linear"], ["zoom"], 13, 1.5, 17, 3.5],
      "line-dasharray": [2, 1],
    },
  });
  map.addLayer({
    id: "piste-label",
    type: "symbol",
    source: "pistes",
    filter: ["all", ["==", ["get", "kind"], "piste"], ["has", "name"]],
    layout: {
      "symbol-placement": "line",
      "text-field": ["get", "name"],
      "text-size": 13,
      "text-font": ["Noto Sans Bold"],
      "text-max-angle": 40,
    },
    paint: { "text-color": "#1d1d26", "text-halo-color": "#ffffff", "text-halo-width": 2 },
  });
  map.addLayer({
    id: "lift-label",
    type: "symbol",
    source: "pistes",
    filter: ["all", ["==", ["get", "kind"], "lift"], ["has", "name"]],
    layout: {
      "symbol-placement": "line-center",
      "text-field": ["get", "name"],
      "text-size": 12,
      "text-font": ["Noto Sans Regular"],
    },
    paint: { "text-color": LIFT_COLOR, "text-halo-color": "#ffffff", "text-halo-width": 2 },
  });
}

function popupHtml(p) {
  if (p.kind === "lift") {
    const seats = p.occupancy ? `${p.occupancy} 人座吊椅` : "吊椅";
    return `<strong>${p.name ?? "吊椅"}</strong><br/>${seats}`;
  }
  if (p.kind === "carpet") return "<strong>魔毯</strong>";
  if (p.kind === "playground") return "<strong>キッズパーク</strong>";
  return `<strong>${p.name ?? "未命名雪道"}</strong><br/>${DIFFICULTY_LABEL[p.difficulty] ?? "初級"}`;
}

// 湯沢中里スノーリゾート的 3D 雪道圖：MapLibre＋Mapterhorn 地形＋OpenFreeMap 底圖＋OSM 雪道。
// 開啟 cooperativeGestures：桌機要按 Ctrl/⌘ 加滾輪才縮放、手機要雙指才拖曳，
// 一般捲動頁面經過地圖時不會被攔截。
export default function SkiTrailMap() {
  const containerRef = useRef(null);
  const mapRef = useRef(null);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    if (!containerRef.current) return;
    const bounds = boundsOf(pistes);

    let map;
    try {
      map = new MapLibreMap({
        container: containerRef.current,
        style: "https://tiles.openfreemap.org/styles/liberty",
        bounds,
        fitBoundsOptions: { padding: 40, ...DEFAULT_VIEW },
        maxPitch: 80,
        cooperativeGestures: true,
        attributionControl: { compact: true },
      });
    } catch {
      setFailed(true);
      return;
    }
    mapRef.current = map;

    map.addControl(new NavigationControl({ visualizePitch: true }), "top-right");
    map.addControl(new FullscreenControl(), "top-right");

    map.on("load", () => {
      addTrailLayers(map);
      map.fitBounds(bounds, { padding: 40, ...DEFAULT_VIEW, duration: 0 });
    });

    const popup = new Popup({ closeButton: false, offset: 8 });
    for (const layer of ["piste", "lift", "playground"]) {
      map.on("click", layer, (e) => {
        popup.setLngLat(e.lngLat).setHTML(popupHtml(e.features[0].properties)).addTo(map);
      });
      map.on("mouseenter", layer, () => (map.getCanvas().style.cursor = "pointer"));
      map.on("mouseleave", layer, () => (map.getCanvas().style.cursor = ""));
    }

    return () => {
      map.remove();
      mapRef.current = null;
    };
  }, []);

  const resetView = () => {
    mapRef.current?.fitBounds(boundsOf(pistes), { padding: 40, ...DEFAULT_VIEW, duration: 1200 });
  };

  if (failed) {
    return (
      <div className="flex aspect-4/3 items-center justify-center rounded-cards bg-obsidian-button text-sm text-ash-text">
        這台裝置無法顯示 3D 地圖（需要 WebGL）
      </div>
    );
  }

  return (
    <div className="relative">
      <div ref={containerRef} className="aspect-4/5 w-full overflow-hidden rounded-cards sm:aspect-16/9" />
      <button
        type="button"
        onClick={resetView}
        className="absolute top-3 left-3 rounded-buttons bg-graphite-card/90 px-4 py-2 text-xs font-medium text-ivory-text shadow"
      >
        回到預設視角
      </button>
    </div>
  );
}
