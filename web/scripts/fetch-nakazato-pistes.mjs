// 從 OpenStreetMap（Overpass API）抓湯沢中里スノーリゾート的雪道、纜車與雪場範圍，
// 轉成 GeoJSON 存進 src/data/nakazatoPistes.json，讓網站直接打包靜態資料、執行時不打 Overpass。
// 雪道資料更新時重跑：node scripts/fetch-nakazato-pistes.mjs
import { writeFile } from "node:fs/promises";

const RESORT_WAY_ID = 680041845; // OSM landuse=winter_sports「湯沢中里スキーリゾート」
const OUT = new URL("../src/data/nakazatoPistes.json", import.meta.url);

const query = `[out:json][timeout:60];
way(${RESORT_WAY_ID});map_to_area->.r;
way(${RESORT_WAY_ID})->.p;
(way["piste:type"](area.r);way["aerialway"](area.r););
out geom;
.p out geom;`;

const res = await fetch("https://overpass-api.de/api/interpreter", {
  method: "POST",
  headers: {
    "Content-Type": "application/x-www-form-urlencoded",
    Accept: "application/json",
    "User-Agent": "2027snowboard-trip-site/1.0",
  },
  body: new URLSearchParams({ data: query }),
});
if (!res.ok) throw new Error(`Overpass ${res.status}`);
const { elements } = await res.json();

const round = (n) => Math.round(n * 1e6) / 1e6;
const coords = (geom) => geom.map((p) => [round(p.lon), round(p.lat)]);

const features = [];
for (const el of elements) {
  if (el.type !== "way" || !el.geometry) continue;
  const t = el.tags ?? {};
  let props;
  if (t.landuse === "winter_sports") {
    props = { kind: "boundary", name: t.name ?? null };
    features.push({ type: "Feature", properties: props, geometry: { type: "Polygon", coordinates: [coords(el.geometry)] } });
    continue;
  }
  if (t["piste:type"] === "downhill") {
    props = { kind: "piste", name: t.name ?? null, difficulty: t["piste:difficulty"] ?? "easy" };
  } else if (t["piste:type"] === "connection") {
    props = { kind: "connection", name: null, difficulty: t["piste:difficulty"] ?? "easy" };
  } else if (t["piste:type"] === "playground") {
    props = { kind: "playground", name: "キッズパーク" };
  } else if (t.aerialway === "magic_carpet") {
    props = { kind: "carpet", name: null };
  } else if (t.aerialway) {
    props = { kind: "lift", name: t.name ?? null, occupancy: t["aerialway:occupancy"] ? Number(t["aerialway:occupancy"]) : null };
  } else continue;
  props.osmId = el.id;
  features.push({ type: "Feature", properties: props, geometry: { type: "LineString", coordinates: coords(el.geometry) } });
}

await writeFile(OUT, JSON.stringify({ type: "FeatureCollection", features }) + "\n");
console.log(`寫入 ${features.length} 筆 → ${OUT.pathname}`);
