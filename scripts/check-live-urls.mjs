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
/**
 * Private repos are declared in constants/projects.ts via `githubPrivate: true`,
 * not in a second list here.
 *
 * This used to be a hand-maintained allow-list with an expiry date, and the
 * expiry existed for a good reason: a private repo meant a visitor clicked
 * "Repository" and got a 404, so the state had to be forced to a decision
 * rather than rotting quietly.
 *
 * That is no longer the situation. The portfolio now renders a declared-private
 * repo as "Private repository" instead of a link, and omits it from the
 * `codeRepository` structured data. Nothing is broken for a visitor, so failing
 * a daily build over it would be manufacturing an alarm about a choice.
 *
 * It is still REPORTED, distinctly, so the choice stays visible — and because
 * the flag lives with the URL it describes, the two cannot disagree.
 */

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

    // Applies to the entry just pushed — `githubPrivate` follows `github` in
    // the object literal.
    if (/^\s*githubPrivate:\s*true/.test(line) && urls.length > 0) {
      urls[urls.length - 1].private = true;
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
  // `private` is carried through from the parsed entry — checkUrl builds a
  // fresh object, so anything not spread back in here is silently lost.
  URLS.map(async (entry) => ({
    ...(await checkUrl(entry.name, entry.url)),
    private: Boolean(entry.private),
  }))
);

const maxName = Math.max(...results.map((r) => r.name.length));

console.log("\nURL Health Check\n" + "─".repeat(70));

function statusIcon(ok, allowed) {
  if (ok) return "✓";
  if (allowed) return "~";
  return "✗";
}

for (const r of results) {
  // A repo declared private in projects.ts is expected to 404 here. That is a
  // choice, not a defect — the site renders it as "Private repository" rather
  // than a link, so no visitor ever hits the 404.
  const allowed = Boolean(r.private);
  const icon = statusIcon(r.ok, allowed);
  const statusStr = r.status > 0 ? String(r.status) : "ERR";
  const nameCol = r.name.padEnd(maxName + 2);
  let suffix = "";
  if (!r.ok && r.private) {
    suffix =
      "  (declared private — the site shows no link, so this is expected)";
  }
  const line = `${icon}  ${nameCol} ${statusStr.padEnd(6)} ${r.ms}ms  ${r.url}${suffix}`;
  if (r.ok || allowed) {
    console.log(line);
  } else {
    console.error(line + (r.error ? `  (${r.error})` : ""));
  }
}

console.log("─".repeat(70));

const failed = results.filter((r) => !r.ok && !r.private);
const privateRepos = results.filter((r) => !r.ok && r.private);

if (privateRepos.length > 0) {
  console.log(
    `\n${privateRepos.length} repo(s) are declared private in projects.ts. The site shows ` +
      `"Private repository" instead of a link, so nothing is broken — remove ` +
      `\`githubPrivate\` from a project the day its repo goes public.`
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
    `\nAll ${results.length - privateRepos.length} public URLs healthy.`
  );
}
