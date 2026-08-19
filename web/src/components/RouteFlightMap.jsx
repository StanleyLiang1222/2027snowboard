import { useEffect, useRef } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import { routeFlightStops } from "../data/routeFlight";

const TOKEN = import.meta.env.VITE_MAPBOX_TOKEN;

function bearing([lng1, lat1], [lng2, lat2]) {
  const toRad = (d) => (d * Math.PI) / 180;
  const y = Math.sin(toRad(lng2 - lng1)) * Math.cos(toRad(lat2));
  const x =
    Math.cos(toRad(lat1)) * Math.sin(toRad(lat2)) -
    Math.sin(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.cos(toRad(lng2 - lng1));
  return ((Math.atan2(y, x) * 180) / Math.PI + 360) % 360;
}

function waitForMoveEnd(map) {
  return new Promise((resolve) => map.once("moveend", resolve));
}

// 神戶 → 福井 → 金澤 → 高崎 → 越後湯澤 → 羽田 的真實地形飛行動畫。
// 捲到這個區塊第一次進入視窗時，鏡頭依序飛過每個城市，展現本州中部的山脈起伏。
export function RouteFlightMap() {
  const containerRef = useRef(null);
  const mapRef = useRef(null);
  const playedRef = useRef(false);

  useEffect(() => {
    if (!TOKEN || !containerRef.current) return;
    mapboxgl.accessToken = TOKEN;

    const first = routeFlightStops[0];
    const map = new mapboxgl.Map({
      container: containerRef.current,
      style: "mapbox://styles/mapbox/standard",
      center: [first.lng, first.lat],
      zoom: 8,
      pitch: 55,
      bearing: 0,
      antialias: true,
    });
    mapRef.current = map;

    // 這是純展示用的飛行動畫，不是給使用者操作的互動地圖——
    // 關掉滾輪縮放/拖曳/雙擊縮放，滑鼠滾輪停在地圖上時才會正常捲動頁面，
    // 不會被地圖攔截變成縮放地圖，卡住捲不下去。
    map.scrollZoom.disable();
    map.dragPan.disable();
    map.dragRotate.disable();
    map.doubleClickZoom.disable();
    map.touchZoomRotate.disable();
    map.keyboard.disable();

    // Standard 樣式的設定要在 style.load 之後才能呼叫 setConfigProperty，
    // 跟舊版 dark-v11 這種靜態樣式的 load 時機不一樣。
    map.on("style.load", () => {
      // Night 光照預設——Standard 樣式內建的大氣/天空效果會跟著這個設定走，
      // 不用再像舊版那樣手動加 sky 圖層。
      map.setConfigProperty("basemap", "lightPreset", "night");

      map.addSource("mapbox-dem", {
        type: "raster-dem",
        url: "mapbox://mapbox.terrain-rgb",
        tileSize: 512,
        maxzoom: 14,
      });
      map.setTerrain({ source: "mapbox-dem", exaggeration: 2.0 });

      // 初始只給起點一個點，路線會在飛行動畫過程中即時長出來，不是一開始就畫好整條。
      map.addSource("route-line", {
        type: "geojson",
        data: {
          type: "Feature",
          geometry: {
            type: "LineString",
            coordinates: [[first.lng, first.lat]],
          },
        },
      });
      map.addLayer({
        id: "route-line-glow",
        type: "line",
        source: "route-line",
        slot: "top",
        paint: { "line-color": "#d4af37", "line-width": 8, "line-opacity": 0.25, "line-blur": 3 },
      });
      map.addLayer({
        id: "route-line",
        type: "line",
        source: "route-line",
        slot: "top",
        layout: { "line-cap": "round", "line-join": "round" },
        paint: { "line-color": "#d4af37", "line-width": 3 },
      });

      routeFlightStops.forEach((stop) => {
        const el = document.createElement("div");
        el.style.display = "flex";
        el.style.flexDirection = "column";
        el.style.alignItems = "center";
        el.style.gap = "4px";
        el.innerHTML = `
          <span style="display:flex;align-items:center;justify-content:center;width:30px;height:30px;border-radius:9999px;background:#5266eb;color:#fff;font-size:12px;font-weight:600;font-family:Inter,sans-serif;box-shadow:0 0 0 3px rgba(82,102,235,0.25);">${stop.day}</span>
          <span style="font-size:11px;color:#ededf3;background:rgba(23,23,33,0.75);padding:2px 8px;border-radius:9999px;white-space:nowrap;font-family:Inter,sans-serif;">${stop.name}</span>
        `;
        new mapboxgl.Marker({ element: el, anchor: "bottom" })
          .setLngLat([stop.lng, stop.lat])
          .addTo(map);
      });
    });

    const observer = new IntersectionObserver(
      async ([entry]) => {
        if (!entry.isIntersecting || playedRef.current) return;
        playedRef.current = true;

        if (!map.isStyleLoaded()) {
          await new Promise((resolve) => map.once("load", resolve));
        }

        const flownCoords = [[first.lng, first.lat]];
        const lineSource = () => map.getSource("route-line");
        const setLine = (coords) =>
          lineSource()?.setData({
            type: "Feature",
            geometry: { type: "LineString", coordinates: coords },
          });

        for (let i = 1; i < routeFlightStops.length; i++) {
          const stop = routeFlightStops[i];
          const next = routeFlightStops[i + 1];

          // 飛行過程中即時把目前鏡頭中心接到已飛過的座標後面，畫出「正在前進」的線段。
          const onMove = () => {
            const c = map.getCenter();
            setLine([...flownCoords, [c.lng, c.lat]]);
          };
          map.on("move", onMove);

          map.flyTo({
            center: [stop.lng, stop.lat],
            zoom: 8.7,
            pitch: 55,
            bearing: next ? bearing([stop.lng, stop.lat], [next.lng, next.lat]) : 0,
            duration: 2600,
            essential: true,
          });
          await waitForMoveEnd(map);

          map.off("move", onMove);
          flownCoords.push([stop.lng, stop.lat]);
          setLine(flownCoords);
        }

        // 飛到最後一站（羽田）就停住，不再自動拉遠看全貌——
        // 使用者這時候應該已經可以繼續往下捲，不用等地圖再跑一段動畫。
      },
      { threshold: 0.4 },
    );
    observer.observe(containerRef.current);

    return () => {
      observer.disconnect();
      map.remove();
    };
  }, []);

  if (!TOKEN) return null;

  return <div ref={containerRef} className="h-[70vh] w-full rounded-cards" />;
}
