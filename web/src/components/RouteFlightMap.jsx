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
      style: "mapbox://styles/mapbox/dark-v11",
      center: [first.lng, first.lat],
      zoom: 8,
      pitch: 55,
      bearing: 0,
      antialias: true,
    });
    mapRef.current = map;

    map.on("load", () => {
      map.addSource("mapbox-dem", {
        type: "raster-dem",
        url: "mapbox://mapbox.terrain-rgb",
        tileSize: 512,
        maxzoom: 14,
      });
      map.setTerrain({ source: "mapbox-dem", exaggeration: 1.4 });
      map.addLayer({
        id: "sky",
        type: "sky",
        paint: { "sky-type": "atmosphere", "sky-atmosphere-sun-intensity": 8 },
      });

      map.addSource("route-line", {
        type: "geojson",
        data: {
          type: "Feature",
          geometry: {
            type: "LineString",
            coordinates: routeFlightStops.map((s) => [s.lng, s.lat]),
          },
        },
      });
      map.addLayer({
        id: "route-line-glow",
        type: "line",
        source: "route-line",
        paint: { "line-color": "#5266eb", "line-width": 8, "line-opacity": 0.25, "line-blur": 3 },
      });
      map.addLayer({
        id: "route-line",
        type: "line",
        source: "route-line",
        layout: { "line-cap": "round", "line-join": "round" },
        paint: { "line-color": "#5266eb", "line-width": 3 },
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

        for (let i = 0; i < routeFlightStops.length; i++) {
          const stop = routeFlightStops[i];
          const next = routeFlightStops[i + 1];
          map.flyTo({
            center: [stop.lng, stop.lat],
            zoom: 8.7,
            pitch: 55,
            bearing: next ? bearing([stop.lng, stop.lat], [next.lng, next.lat]) : 0,
            duration: 2600,
            essential: true,
          });
          await waitForMoveEnd(map);
        }

        // 最後拉遠看整條路線的全貌
        const bounds = routeFlightStops.reduce(
          (b, s) => b.extend([s.lng, s.lat]),
          new mapboxgl.LngLatBounds([first.lng, first.lat], [first.lng, first.lat]),
        );
        map.fitBounds(bounds, { padding: 60, pitch: 45, duration: 2000 });
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
