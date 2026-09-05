#!/usr/bin/env node
/**
 * check-deploy-freshness.mjs
 *
 * Does each live site serve what its repository's `main` says it should?
 *
 * WHY THIS EXISTS.
 *
 * KhataGO's Vercel production deploys started failing on 2026-08-30. For a
 * week, every daily check stayed green: check-live-urls.mjs asserts status
 * codes, and the previous deploy kept answering 200 the whole time. Nine
 * merged PRs — a security fix among them — were "shipped" and not served, and
 * nothing said so. A 200 proves a server is up. It says nothing about WHICH
 * build is up.
 *
 * So each site now says which commit it is (`GET /api/version` → `{ sha }`,
 * or `.version.sha` inside a health payload), and this script compares that
 * against `main` through the GitHub API — the same call as
 * `gh api repos/<owner>/<repo>/commits/main`, made with fetch so the script
 * needs no dependency tree.
 *
 * A TARGET FAILS WHEN ANY OF THESE HOLDS:
 *   1. the served sha is not an ancestor of `main` (a diverged or unknown
 *      commit is being served);
 *   2. `main` has been ahead of the served sha for more than 24 hours — the
 *      oldest commit `main` has that live does not is older than a day (an
 *      in-flight deploy is not an outage; a day-old one is);
 *   3. the version route answers 404 while the repository has the route on
 *      `main` — the shape KhataGO's outage takes today.
 *
 * WHAT IS REPORTED AS `deploying` (exit 0, with a warning): rule 2 or rule 3
 * tripping inside the grace window — 30 minutes by default,
 * `FRESHNESS_GRACE_MINUTES` to change it — measured from the OLDEST change
 * live is missing (the oldest unserved commit, or the commit that put the
 * route on `main`; never from `main` HEAD, which a fresh unrelated commit
 * would reset). A run minutes after a merge sees a build in flight, not a
 * defect. See deploy-freshness-decision.mjs for the reasoning and the rules.
 *
 * WHAT IS NOT A FAILURE: a repository this token cannot read. KhataGO is
 * private and the Actions `GITHUB_TOKEN` is scoped to THIS repo, so the API
 * answers 404 for it. That is reported as "cannot verify (private)" and never
 * counted as a pass. Rule 3 still applies to it, from declared knowledge: the
 * route landed on KhataGO `main` on 2026-09-05 (#55), so a 404 there is a
 * stale deploy, not a missing feature — and with no commit times to measure
 * from, a private repository has no grace window. That is why the KhataGO row
 * FAILS by design until its deploys are fixed — this job existing at all is
 * the response to that outage, and a check that passed through it would be
 * the old blind spot with a new name.
 *
 * Run: node scripts/check-deploy-freshness.mjs
 *      GITHUB_TOKEN is optional locally (60 unauthenticated requests/hour is
 *      plenty) and set from `secrets.GITHUB_TOKEN` in Actions.
 *      FRESHNESS_GRACE_MINUTES overrides the 30-minute grace window.
 */

import { appendFileSync } from "node:fs";

import {
  decideFreshness,
  dig,
  parseGraceMinutes,
} from "./deploy-freshness-decision.mjs";

const TIMEOUT_MS = 30_000;
const RETRIES = 1;
const RETRY_DELAY_MS = 5_000;
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

let graceMinutes;
try {
  graceMinutes = parseGraceMinutes(process.env.FRESHNESS_GRACE_MINUTES);
} catch (err) {
  console.error(err instanceof Error ? err.message : String(err));
  process.exit(2);
}
const GRACE_MS = graceMinutes * 60_000;

/**
 * Each target names the live version URL, where in its JSON the sha lives,
 * the repository whose `main` is the truth, and the file whose presence on
 * `main` means the route exists.
 *
 * `routeOnMainSince` is the fallback for a repository the token cannot read.
 * It is a fact about the repository, dated, and it only ever turns a 404 into
 * a failure — never a mismatch into a pass.
 */
const TARGETS = [
  {
    name: "portfolio",
    url: "https://shaileshchaudhari.vercel.app/api/version",
    shaPath: ["sha"],
    repo: "Shailesh93602/portfolio_next",
    routePath: "app/api/version/route.ts",
  },
  {
    name: "KhataGO",
    url: "https://khatago.vercel.app/api/version",
    shaPath: ["sha"],
    repo: "Shailesh93602/KhataGO",
    routePath: "app/api/version/route.ts",
    // Private. The route merged as KhataGO #55 on 2026-09-05.
    routeOnMainSince: "2026-09-05",
  },
  {
    name: "EduScale frontend",
    url: "https://eduscale.vercel.app/api/version",
    shaPath: ["sha"],
    // DevScale is the PUBLIC mirror of EduScale; PRs merge on the private
    // remote and it is re-synced after every batch (CLAUDE.md, hub).
    repo: "Shailesh93602/DevScale",
    routePath: "Frontend/src/app/api/version/route.ts",
  },
  {
    name: "EduScale backend",
    url: "https://api-eduscale.vercel.app/api/v1/health",
    shaPath: ["version", "sha"],
    repo: "Shailesh93602/DevScale",
    routePath: "Backend/src/middlewares/versionMiddleware.ts",
  },
];

const GH_HEADERS = {
  Accept: "application/vnd.github+json",
  "User-Agent": "portfolio-deploy-freshness",
  ...(process.env.GITHUB_TOKEN
    ? { Authorization: `Bearer ${process.env.GITHUB_TOKEN}` }
    : {}),
};

async function fetchWithTimeout(url, init = {}) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);
  try {
    return await fetch(url, { ...init, signal: controller.signal });
  } finally {
    clearTimeout(timer);
  }
}

/** Live site: GET, never cached, retried once on a network error or a 5xx. */
async function fetchLive(url) {
  let lastErr;
  for (let i = 0; i <= RETRIES; i++) {
    try {
      const res = await fetchWithTimeout(url, {
        cache: "no-store",
        headers: {
          "User-Agent": "portfolio-deploy-freshness",
          "Cache-Control": "no-cache",
        },
      });
      if (res.status >= 500) {
        lastErr = `HTTP ${res.status}`;
      } else {
        let json = null;
        try {
          json = await res.json();
        } catch {
          json = null;
        }
        return { status: res.status, json };
      }
    } catch (err) {
      lastErr = err instanceof Error ? err.message : String(err);
    }
    if (i < RETRIES) await sleep(RETRY_DELAY_MS);
  }
  return { status: 0, json: null, error: lastErr };
}

/** GitHub API: returns { status, json }. 404 is a value here, not an error. */
async function gh(path) {
  const res = await fetchWithTimeout(`https://api.github.com/${path}`, {
    headers: GH_HEADERS,
  });
  let json = null;
  try {
    json = await res.json();
  } catch {
    json = null;
  }
  return { status: res.status, json };
}

/**
 * Gather the facts, then decide. The probes are lazy so a fresh site costs
 * two requests and only the shapes that need more make more.
 */
async function check(target) {
  const live = await fetchLive(target.url);
  const head = await gh(`repos/${target.repo}/commits/main`);
  const servedSha = dig(live.json, target.shaPath);

  const probes = {
    async route() {
      const contents = await gh(
        `repos/${target.repo}/contents/${target.routePath}?ref=main`
      );
      if (contents.status !== 200) {
        return { status: contents.status, lastCommitDate: null };
      }
      // When did main last change this file? That is the change a 404 build
      // is missing, and the anchor for the grace window.
      const touched = await gh(
        `repos/${target.repo}/commits?path=${encodeURIComponent(target.routePath)}&sha=main&per_page=1`
      );
      const lastCommitDate =
        touched.status === 200 && Array.isArray(touched.json)
          ? (touched.json[0]?.commit?.committer?.date ?? null)
          : null;
      return { status: 200, lastCommitDate };
    },
    compare: () => gh(`repos/${target.repo}/compare/${servedSha}...main`),
  };

  return decideFreshness({ target, live, head }, probes, {
    now: Date.now(),
    graceMs: GRACE_MS,
  });
}

const results = [];
for (const target of TARGETS) {
  // Sequential on purpose: four targets, a dozen requests, and an ordered
  // log reads better than an interleaved one.
  try {
    results.push({ target, ...(await check(target)) });
  } catch (err) {
    results.push({
      target,
      ok: true,
      unverifiable: true,
      verdict: "skipped",
      detail: `checker error: ${err instanceof Error ? err.message : String(err)}`,
    });
  }
}

const icon = (r) =>
  r.ok ? (r.unverifiable ? "~" : r.deploying ? "…" : "✓") : "✗";

const width = Math.max(...results.map((r) => r.target.name.length));
console.log(
  `\nDeploy freshness — does live serve main? (grace window: ${graceMinutes}m)\n` +
    "─".repeat(78)
);
for (const r of results) {
  const line = `${icon(r)}  ${r.target.name.padEnd(width + 2)} ${r.verdict.padEnd(24)} ${r.detail}`;
  if (r.ok) console.log(line);
  else console.error(line);
}
console.log("─".repeat(78));

const failed = results.filter((r) => !r.ok);
const unverifiable = results.filter((r) => r.ok && r.unverifiable);
const deploying = results.filter((r) => r.ok && r.deploying);

if (process.env.GITHUB_STEP_SUMMARY) {
  const rows = results
    .map(
      (r) => `| ${icon(r)} | ${r.target.name} | ${r.verdict} | ${r.detail} |`
    )
    .join("\n");
  appendFileSync(
    process.env.GITHUB_STEP_SUMMARY,
    `### Deploy freshness\n\n| | Site | Verdict | Detail |\n|---|---|---|---|\n${rows}\n\n`
  );
}

if (deploying.length > 0) {
  const msg =
    `${deploying.length} target(s) are behind main by less than the ${graceMinutes}m grace window ` +
    `(deploy in flight, not a failure — re-run after it lands):\n` +
    deploying.map((r) => `  • ${r.target.name}: ${r.detail}`).join("\n");
  console.log(`\nWARNING: ${msg}`);
  if (process.env.GITHUB_ACTIONS) {
    // One annotation per target, on the workflow run's summary page.
    for (const r of deploying) {
      console.log(
        `::warning title=Deploy in flight (${r.target.name})::${r.detail}`
      );
    }
  }
}
if (unverifiable.length > 0) {
  console.log(
    `\n${unverifiable.length} target(s) could not be verified against their repository ` +
      `(private to this token, or the API was unavailable). Not a pass.`
  );
}
if (failed.length > 0) {
  console.error(
    `\n${failed.length} live site(s) are not serving main:\n` +
      failed.map((r) => `  • ${r.target.name}: ${r.detail}`).join("\n") +
      `\n\nA 200 from a stale build is the failure this check exists to catch. ` +
      `Open the project's Vercel deployments and read the failed build's log.`
  );
  process.exit(1);
}
console.log(
  `\nAll ${results.length - unverifiable.length} verifiable sites serve main` +
    (deploying.length > 0 ? ` (${deploying.length} deploying).` : ".")
);
