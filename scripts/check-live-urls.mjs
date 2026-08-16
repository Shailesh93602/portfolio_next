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
 * URLs allowed to 404 without failing the script — private GitHub repos
 * pending a public-flip.
 *
 * Each entry carries an EXPIRY. A grace period that never ends is just a
 * silenced alarm: the khatago entry sat here for ~6 weeks while the
 * recruiter-facing Repository link 404'd and this check reported green every
 * day. Past its expiry an entry stops being a free pass and fails the run, so
 * the decision (flip the repo public, or drop the link from projects.ts) comes
 * back to the surface instead of rotting.
 */
const KNOWN_PRIVATE = new Map([
  [
    "https://github.com/Shailesh93602/khatago",
    { until: "2026-08-29", note: "flip public or remove the link" },
  ],
]);

const today = new Date().toISOString().slice(0, 10);

/** An allow-list entry only counts while it hasn't expired. */
function allowance(url) {
  const entry = KNOWN_PRIVATE.get(url);
  if (!entry) return null;
  return { ...entry, expired: today > entry.until };
}

/**
 * Some "live" URLs are APIs whose root path 404s by design (no `GET /` route).
 * For those, probe a real health endpoint instead of the root. The display URL
 * stays the public demo link; only the fetched path changes.
 *
 * Empty right now — the one entry was Holdfast's `/healthz`, and Holdfast is no
 * longer featured. Kept because the next API-shaped project will need it.
 */
const HEALTH_PATH = {};

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
  const grace = allowance(r.url);
  const allowed = Boolean(grace) && !grace.expired;
  const icon = statusIcon(r.ok, allowed);
  const statusStr = r.status > 0 ? String(r.status) : "ERR";
  const nameCol = r.name.padEnd(maxName + 2);
  let suffix = "";
  if (!r.ok && grace) {
    suffix = grace.expired
      ? `  (grace expired ${grace.until} — ${grace.note})`
      : `  (allowed until ${grace.until}: pending public-flip)`;
  }
  const line = `${icon}  ${nameCol} ${statusStr.padEnd(6)} ${r.ms}ms  ${r.url}${suffix}`;
  if (r.ok || allowed) {
    console.log(line);
  } else {
    console.error(line + (r.error ? `  (${r.error})` : ""));
  }
}

console.log("─".repeat(70));

const stillAllowed = (r) => {
  const grace = allowance(r.url);
  return Boolean(grace) && !grace.expired;
};

const failed = results.filter((r) => !r.ok && !stillAllowed(r));
const allowedFailed = results.filter((r) => !r.ok && stillAllowed(r));

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
