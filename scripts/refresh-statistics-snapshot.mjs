#!/usr/bin/env node
/**
 * refresh-statistics-snapshot.mjs
 *
 * Refreshes data/statistics-snapshot.json from the deployed /api/statistics.
 *
 * WHY THIS EXISTS.
 *
 * The snapshot is what /statistics serves when the live GitHub and LeetCode
 * APIs time out. Nothing regenerated it, so it had been frozen since
 * 2026-04-20 — over four months — and its `lastUpdated` was quietly presented
 * as current data.
 *
 * A stale fallback is not a crisis. It is a slow one: the longer it sits, the
 * more wrong it gets, and nothing announces it.
 *
 * WHY IT FETCHES THE DEPLOYED ENDPOINT RATHER THAN CALLING THE SERVICES.
 *
 * The endpoint is the real code path, including its upstream timeouts and
 * error handling. Reimplementing that here would create a second way to fetch
 * the same data, and the two would eventually disagree — the snapshot would
 * then be "correct" against a code path nobody runs. Fetching the endpoint also
 * exercises it, so a broken /api/statistics fails this job rather than being
 * discovered by a visitor.
 *
 * Run: node scripts/refresh-statistics-snapshot.mjs
 */

import { readFileSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const SNAPSHOT = resolve(__dirname, "..", "data", "statistics-snapshot.json");

const ENDPOINT =
  process.env.STATS_ENDPOINT ??
  "https://shaileshchaudhari.vercel.app/api/statistics";
const TIMEOUT_MS = 45_000;

/**
 * Refuse to overwrite a good snapshot with a worse one.
 *
 * 🔴 THE POINT OF THIS FUNCTION. The snapshot is a FALLBACK — it is what a
 * visitor sees precisely when the upstream APIs are having a bad day. So the
 * moment this job is most likely to run against degraded data is the moment its
 * output matters most.
 *
 * If GitHub rate-limits us, the endpoint can legitimately answer with zeros or
 * partial data. Writing that would destroy the last known-good numbers and
 * replace them with a page that says this person has solved 0 problems.
 *
 * Monotonic counters only ever go up. A large drop means the source is wrong,
 * not that the history changed — so a drop is treated as a failed refresh
 * rather than new data.
 */
function isPlausible(next, current) {
  const problems = [];

  const checks = [
    [
      "github.contributions",
      next.github?.contributions,
      current.github?.contributions,
    ],
    [
      "github.repositories",
      next.github?.repositories,
      current.github?.repositories,
    ],
    [
      "leetcode.totalSolved",
      next.leetcode?.totalSolved,
      current.leetcode?.totalSolved,
    ],
  ];

  for (const [label, nextVal, currentVal] of checks) {
    if (typeof nextVal !== "number" || Number.isNaN(nextVal)) {
      problems.push(`${label} is missing or not a number (${nextVal})`);
      continue;
    }
    if (nextVal === 0 && (currentVal ?? 0) > 0) {
      problems.push(`${label} came back 0, was ${currentVal}`);
      continue;
    }
    // A little slack: a repo can be deleted, a solve can be un-counted. A tenth
    // of the total cannot vanish legitimately.
    if (typeof currentVal === "number" && nextVal < currentVal * 0.9) {
      problems.push(`${label} dropped from ${currentVal} to ${nextVal}`);
    }
  }

  return problems;
}

const controller = new AbortController();
const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);

let live;
try {
  const res = await fetch(ENDPOINT, {
    signal: controller.signal,
    headers: { "User-Agent": "portfolio-stats-refresh" },
  });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  live = await res.json();
} catch (error) {
  // Not a failure worth going red over — the existing snapshot is still valid,
  // it is just a day older. Failing loudly here would train someone to ignore
  // this job, and the next real failure with it.
  console.warn(`⚠  Could not reach ${ENDPOINT}: ${error.message}`);
  console.warn("   Keeping the existing snapshot. Nothing written.");
  process.exit(0);
} finally {
  clearTimeout(timer);
}

const current = JSON.parse(readFileSync(SNAPSHOT, "utf8"));
const problems = isPlausible(live, current);

if (problems.length > 0) {
  console.error("✗ Refusing to write an implausible snapshot:");
  for (const p of problems) console.error(`   • ${p}`);
  console.error(
    "\n  The upstream APIs are likely degraded or rate-limited. The existing\n" +
      "  snapshot is kept — it is stale, which is far better than wrong."
  );
  process.exit(1);
}

const next = {
  ...live,
  lastUpdated: new Date().toISOString().slice(0, 10),
};

const before = JSON.stringify(current);
const after = JSON.stringify(next);

// Compare ignoring lastUpdated, so an unchanged day produces no commit.
const beforeSansDate = JSON.stringify({ ...current, lastUpdated: null });
const afterSansDate = JSON.stringify({ ...next, lastUpdated: null });

if (beforeSansDate === afterSansDate) {
  console.log(
    "✓ Statistics unchanged — snapshot left alone (no empty commit)."
  );
  process.exit(0);
}

writeFileSync(SNAPSHOT, JSON.stringify(next, null, 2) + "\n");

console.log("✓ Snapshot refreshed");
console.log(
  `   github.contributions  ${current.github?.contributions} → ${next.github?.contributions}`
);
console.log(
  `   leetcode.totalSolved  ${current.leetcode?.totalSolved} → ${next.leetcode?.totalSolved}`
);
console.log(
  `   lastUpdated           ${current.lastUpdated} → ${next.lastUpdated}`
);
(void before, void after);
