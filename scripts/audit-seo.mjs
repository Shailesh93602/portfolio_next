#!/usr/bin/env node
// SEO / GEO / AEO audit across all live portfolio projects.
// Usage: node scripts/audit-seo.mjs

import { setTimeout as sleep } from "node:timers/promises";

const TARGETS = [
  { name: "portfolio_next", url: "https://shaileshchaudhari.vercel.app", kind: "site" },
  { name: "EduScale (FE)", url: "https://eduscale.vercel.app", kind: "site" },
  { name: "DevTrack", url: "https://daily-dev-track.vercel.app", kind: "site" },
  { name: "CodeSenseiSearch (FE)", url: "https://code-sensei-search-web.vercel.app", kind: "site" },
  { name: "CodeSenseiSearch (API)", url: "https://code-sensei-search-api.vercel.app", kind: "api" },
  { name: "redis-battle-demo", url: "https://redis-battle-demo.onrender.com", kind: "site" },
  { name: "KhataGO", url: "https://khatago.vercel.app", kind: "site" },
];

const PROBES = [
  { path: "/favicon.ico", label: "favicon.ico" },
  { path: "/icon.png", label: "icon.png" },
  { path: "/apple-icon.png", label: "apple-icon.png" },
  { path: "/apple-icon", label: "apple-icon-noext" },
  { path: "/apple-touch-icon.png", label: "apple-touch-icon.png" },
  { path: "/manifest.webmanifest", label: "manifest" },
  { path: "/robots.txt", label: "robots.txt" },
  { path: "/sitemap.xml", label: "sitemap.xml" },
  { path: "/llms.txt", label: "llms.txt" },
];

const UA = "ShaileshAudit/1.0 (+https://shaileshchaudhari.vercel.app)";

async function head(url) {
  try {
    const res = await fetch(url, { method: "GET", redirect: "follow", headers: { "user-agent": UA } });
    return { ok: res.ok, status: res.status };
  } catch (e) {
    return { ok: false, status: 0, error: String(e.message || e) };
  }
}

async function fetchText(url) {
  try {
    const res = await fetch(url, { redirect: "follow", headers: { "user-agent": UA } });
    if (!res.ok) return { ok: false, status: res.status };
    const text = await res.text();
    return { ok: true, status: res.status, text };
  } catch (e) {
    return { ok: false, error: String(e.message || e) };
  }
}

function parseHead(html) {
  const get = (re) => { const m = html.match(re); return m ? m[1].trim() : null; };
  const all = (re) => [...html.matchAll(re)].map((m) => m[1].trim());
  return {
    title: get(/<title[^>]*>([^<]*)<\/title>/i),
    description: get(/<meta[^>]+name=["']description["'][^>]+content=["']([^"']*)["']/i),
    canonical: get(/<link[^>]+rel=["']canonical["'][^>]+href=["']([^"']*)["']/i),
    ogTitle: get(/<meta[^>]+property=["']og:title["'][^>]+content=["']([^"']*)["']/i),
    ogDesc: get(/<meta[^>]+property=["']og:description["'][^>]+content=["']([^"']*)["']/i),
    ogImage: get(/<meta[^>]+property=["']og:image["'][^>]+content=["']([^"']*)["']/i),
    ogType: get(/<meta[^>]+property=["']og:type["'][^>]+content=["']([^"']*)["']/i),
    ogSiteName: get(/<meta[^>]+property=["']og:site_name["'][^>]+content=["']([^"']*)["']/i),
    twCard: get(/<meta[^>]+name=["']twitter:card["'][^>]+content=["']([^"']*)["']/i),
    twCreator: get(/<meta[^>]+name=["']twitter:creator["'][^>]+content=["']([^"']*)["']/i),
    twImage: get(/<meta[^>]+name=["']twitter:image["'][^>]+content=["']([^"']*)["']/i),
    icons: all(/<link[^>]+rel=["'](?:icon|shortcut icon|apple-touch-icon)["'][^>]+href=["']([^"']*)["']/gi),
    manifestLink: get(/<link[^>]+rel=["']manifest["'][^>]+href=["']([^"']*)["']/i),
    themeColor: get(/<meta[^>]+name=["']theme-color["'][^>]+content=["']([^"']*)["']/i),
    jsonLd: all(/<script[^>]+type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi),
  };
}

function gradeSite(html, probes) {
  const h = parseHead(html);
  const r = (cond) => (cond ? "OK  " : "MISS");
  const types = (h.jsonLd || []).map((s) => {
    try {
      const j = JSON.parse(s);
      const arr = Array.isArray(j) ? j : j["@graph"] || [j];
      return arr.map((x) => x?.["@type"]).filter(Boolean);
    } catch { return []; }
  }).flat();
  return {
    rows: [
      ["title", r(h.title), h.title || ""],
      ["description", r(h.description), (h.description || "").slice(0, 70)],
      ["canonical", r(h.canonical), h.canonical || ""],
      ["og:title", r(h.ogTitle), ""],
      ["og:description", r(h.ogDesc), ""],
      ["og:image", r(h.ogImage), h.ogImage || ""],
      ["og:type", r(h.ogType), h.ogType || ""],
      ["og:site_name", r(h.ogSiteName), h.ogSiteName || ""],
      ["twitter:card", r(h.twCard), h.twCard || ""],
      ["twitter:creator", r(h.twCreator === "@ShaileshWork"), h.twCreator || "(should be @ShaileshWork)"],
      ["twitter:image", r(h.twImage), ""],
      ["theme-color", r(h.themeColor), h.themeColor || ""],
      ["manifest", r(h.manifestLink || probes.manifest?.ok), ""],
      ["icon links", r((h.icons?.length || 0) > 0), `${h.icons?.length || 0} found`],
      ["favicon.ico", r(probes["favicon.ico"]?.ok), ""],
      ["apple-touch-icon", r(probes["apple-touch-icon.png"]?.ok || probes["apple-icon.png"]?.ok || probes["apple-icon-noext"]?.ok), ""],
      ["robots.txt", r(probes["robots.txt"]?.ok), ""],
      ["sitemap.xml", r(probes["sitemap.xml"]?.ok), ""],
      ["llms.txt", r(probes["llms.txt"]?.ok), ""],
      ["JSON-LD", r(types.length > 0), types.join(", ") || "none"],
    ],
  };
}

function fmt(rows) {
  const w0 = Math.max(...rows.map((r) => r[0].length));
  return rows.map(([k, v, x]) => `  ${k.padEnd(w0)}  ${v}  ${x || ""}`).join("\n");
}

async function auditOne(target) {
  const probes = {};
  for (const p of PROBES) {
    probes[p.label] = await head(target.url + p.path);
    await sleep(40);
  }
  const home = await fetchText(target.url + "/");
  console.log(`\n━━━ ${target.name}  —  ${target.url} ━━━`);
  if (!home.ok) {
    console.log(`  ✗ home unreachable (status ${home.status || "ERR"} ${home.error || ""})`);
    return { target, reachable: false };
  }
  const graded = gradeSite(home.text, probes);
  console.log(fmt(graded.rows));
  return { target, reachable: true, graded };
}

(async () => {
  console.log("SEO / GEO / AEO audit — " + new Date().toISOString());
  const results = [];
  for (const t of TARGETS) results.push(await auditOne(t));
  console.log("\n━━━ SUMMARY ━━━");
  for (const r of results) {
    if (!r.reachable) { console.log(`  ✗ ${r.target.name}: UNREACHABLE`); continue; }
    const misses = r.graded.rows.filter((x) => x[1].trim() === "MISS").map((x) => x[0]);
    const hits = r.graded.rows.length - misses.length;
    console.log(`  ${r.target.name}: ${hits}/${r.graded.rows.length} OK — missing: ${misses.join(", ") || "none"}`);
  }
})();
