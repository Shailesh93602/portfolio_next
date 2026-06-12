#!/usr/bin/env node
/**
 * check-live-urls.mjs
 *
 * Reads every `live` and `github` URL from constants/projects.ts,
 * fetches each, reports status + response time. Exits 1 if any
 * non-2xx response is seen.
 *
 * Originally only checked a hand-maintained list of live URLs. Now
 * sources from projects.ts directly so it never drifts — both a
 * recruiter-facing Repository link pointing at a 404'd GitHub repo
 * and a dead deploy URL will break this check.
 *
 * Use as a pre-deploy check or weekly cron.
 *
 * Run: node scripts/check-live-urls.mjs
 */

import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const PROJECTS_TS = resolve(__dirname, "..", "constants", "projects.ts");

// Render free-tier apps spin down when idle and cold-start in 30–60s, so the
// first request after a quiet period is slow (this cron is partly what wakes
// them). Use a generous per-attempt timeout and retry: the first attempt warms
// the dyno, a later one confirms it's actually serving.
const TIMEOUT_MS = 30_000;
const RETRIES = 2;
const RETRY_DELAY_MS = 5_000;
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

/**
 * URLs allowed to 404 without failing the script.
 * Typically private GitHub repos that are pending a public-flip —
 * remove entries here as each repo goes public.
 *
 * Leaving an entry here for too long defeats the purpose of the check,
 * so treat this as a 7-day maximum.
 */
const KNOWN_PRIVATE = new Set(["https://github.com/Shailesh93602/khatago"]);

/**
 * Some "live" URLs are APIs whose root path 404s by design (no `GET /` route).
 * For those, probe a real health endpoint instead of the root. The display URL
 * stays the public demo link; only the fetched path changes.
 */
const HEALTH_PATH = {
  "https://holdfast-50gt.onrender.com": "/healthz",
};

function fetchTarget(url) {
  for (const [base, path] of Object.entries(HEALTH_PATH)) {
    if (url === base || url === `${base}/`) return base + path;
  }
  return url;
}

/**
 * Parse URLs out of constants/projects.ts by walking the file for
 * `live:` and `github:` string-literal lines. Avoids importing the TS
 * file directly so the script can run under plain node without ts-node.
 */
function parseProjectUrls() {
  const src = readFileSync(PROJECTS_TS, "utf8");
  const lines = src.split("\n");

  const urls = [];
  let currentId = null;

  for (const line of lines) {
    const idMatch = line.match(/^\s*id:\s*"([^"]+)"/);
    if (idMatch) currentId = idMatch[1];

    const liveMatch = line.match(/^\s*live:\s*"(https?:\/\/[^"]+)"/);
    if (liveMatch && currentId) {
      urls.push({
        name: `${currentId} (live)`,
        url: liveMatch[1],
        kind: "live",
      });
    }

    const githubMatch = line.match(/^\s*github:\s*"(https?:\/\/[^"]+)"/);
    if (githubMatch && currentId) {
      urls.push({
        name: `${currentId} (github)`,
        url: githubMatch[1],
        kind: "github",
      });
    }
  }

  // Portfolio itself isn't in projects.ts — add it explicitly.
  urls.unshift({
    name: "Portfolio",
    url: "https://shaileshchaudhari.vercel.app",
    kind: "live",
  });

  return urls;
}

async function attempt(url) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);
  try {
    const res = await fetch(url, {
      method: "HEAD",
      signal: controller.signal,
      redirect: "follow",
    });
    return { status: res.status, ok: res.status >= 200 && res.status < 300 };
  } finally {
    clearTimeout(timer);
  }
}

async function checkUrl(name, url) {
  const start = Date.now();
  const target = fetchTarget(url);
  let lastErr;
  for (let i = 0; i <= RETRIES; i++) {
    try {
      const { status, ok } = await attempt(target);
      // A 2xx on any attempt is a pass. A definite non-2xx (e.g. 404) is final
      // — no point retrying a real error.
      if (
        ok ||
        (status >= 400 && status < 500 && status !== 408 && status !== 429)
      ) {
        return { name, url, status, ms: Date.now() - start, ok };
      }
      lastErr = `HTTP ${status}`;
    } catch (err) {
      lastErr = err instanceof Error ? err.message : String(err);
    }
    if (i < RETRIES) await sleep(RETRY_DELAY_MS);
  }
  return {
    name,
    url,
    status: 0,
    ms: Date.now() - start,
    ok: false,
    error: lastErr,
  };
}

const URLS = parseProjectUrls();
const results = await Promise.all(
  URLS.map(({ name, url }) => checkUrl(name, url))
);

const maxName = Math.max(...results.map((r) => r.name.length));

console.log("\nURL Health Check\n" + "─".repeat(70));

function statusIcon(ok, allowed) {
  if (ok) return "✓";
  if (allowed) return "~";
  return "✗";
}

for (const r of results) {
  const allowed = KNOWN_PRIVATE.has(r.url);
  const icon = statusIcon(r.ok, allowed);
  const statusStr = r.status > 0 ? String(r.status) : "ERR";
  const nameCol = r.name.padEnd(maxName + 2);
  const suffix = !r.ok && allowed ? "  (allowed: pending public-flip)" : "";
  const line = `${icon}  ${nameCol} ${statusStr.padEnd(6)} ${r.ms}ms  ${r.url}${suffix}`;
  if (r.ok || allowed) {
    console.log(line);
  } else {
    console.error(line + (r.error ? `  (${r.error})` : ""));
  }
}

console.log("─".repeat(70));

const failed = results.filter((r) => !r.ok && !KNOWN_PRIVATE.has(r.url));
const allowedFailed = results.filter((r) => !r.ok && KNOWN_PRIVATE.has(r.url));

if (allowedFailed.length > 0) {
  console.log(
    `\n${allowedFailed.length} URL(s) are allow-listed as pending public-flip — trim KNOWN_PRIVATE once each repo is public.`
  );
}

if (failed.length > 0) {
  console.error(`\n${failed.length} URL(s) failed:\n`);
  for (const r of failed) {
    console.error(`  • ${r.name}: ${r.url}`);
    if (r.error) console.error(`    ${r.error}`);
  }
  process.exit(1);
} else {
  console.log(
    `\nAll ${results.length - allowedFailed.length} non-allow-listed URLs healthy.`
  );
}
