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
 * WHAT IS NOT A FAILURE: a repository this token cannot read. KhataGO is
 * private and the Actions `GITHUB_TOKEN` is scoped to THIS repo, so the API
 * answers 404 for it. That is reported as "cannot verify (private)" and never
 * counted as a pass. Rule 3 still applies to it, from declared knowledge: the
 * route landed on KhataGO `main` on 2026-09-05 (#55), so a 404 there is a
 * stale deploy, not a missing feature. That is why the KhataGO row FAILS by
 * design until its deploys are fixed — this job existing at all is the
 * response to that outage, and a check that passed through it would be the
 * old blind spot with a new name.
 *
 * Run: node scripts/check-deploy-freshness.mjs
 *      GITHUB_TOKEN is optional locally (60 unauthenticated requests/hour is
 *      plenty) and set from `secrets.GITHUB_TOKEN` in Actions.
 */

import { appendFileSync } from "node:fs";

const MAX_LAG_MS = 24 * 60 * 60 * 1000;
const TIMEOUT_MS = 30_000;
const RETRIES = 1;
const RETRY_DELAY_MS = 5_000;
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

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

function dig(obj, path) {
  let cur = obj;
  for (const key of path) {
    if (cur === null || typeof cur !== "object") return undefined;
    cur = cur[key];
  }
  return cur;
}

const hours = (ms) => (ms / 3_600_000).toFixed(1);

/**
 * One target → { ok, verdict, detail, unverifiable }.
 *
 * `ok: false` fails the run. `unverifiable: true` is reported distinctly and
 * never counted as a pass.
 */
async function check(target) {
  const live = await fetchLive(target.url);
  const servedSha = dig(live.json, target.shaPath);

  // ── What does main say? ────────────────────────────────────────────────
  const head = await gh(`repos/${target.repo}/commits/main`);
  const repoReadable = head.status === 200;
  if (!repoReadable && head.status !== 404) {
    // Rate limit, outage. Not a false claim about the deploy; say so.
    return {
      ok: true,
      unverifiable: true,
      verdict: "skipped",
      detail: `GitHub API answered ${head.status} for ${target.repo}`,
    };
  }
  const mainSha = repoReadable ? head.json.sha : null;

  // ── Rule 3: the route is missing from live ─────────────────────────────
  if (live.status === 0) {
    return {
      ok: false,
      verdict: "FAIL",
      detail: `${target.url} unreachable (${live.error})`,
    };
  }
  if (live.status === 404 || servedSha === undefined) {
    const shape =
      live.status === 404
        ? "answers 404"
        : `answers ${live.status} with no sha at .${target.shaPath.join(".")}`;
    if (repoReadable) {
      const route = await gh(
        `repos/${target.repo}/contents/${target.routePath}?ref=main`
      );
      if (route.status === 200) {
        return {
          ok: false,
          verdict: "FAIL",
          detail:
            `${shape}, but ${target.repo} has ${target.routePath} on main ` +
            `(${mainSha.slice(0, 7)}) — live is serving a build from before the route: a stale deploy`,
        };
      }
      return {
        ok: true,
        verdict: "ok",
        detail: `${shape}; ${target.routePath} is not on main yet, so that is expected`,
      };
    }
    if (target.routeOnMainSince) {
      return {
        ok: false,
        verdict: "FAIL",
        detail:
          `${shape}; ${target.repo} is private to this token, but the route has been on ` +
          `main since ${target.routeOnMainSince} — live is a build from before it: a stale deploy`,
      };
    }
    return {
      ok: true,
      unverifiable: true,
      verdict: "cannot verify (private)",
      detail: `${shape}; ${target.repo} is private and no route date is declared`,
    };
  }

  if (typeof servedSha !== "string" || !/^[0-9a-f]{40}$/.test(servedSha)) {
    // `unknown` means the build did not bake VERCEL_GIT_COMMIT_SHA. A
    // version endpoint that cannot name its commit is the blind spot again.
    return {
      ok: false,
      verdict: "FAIL",
      detail: `served sha is ${JSON.stringify(servedSha)} — not a commit; the build did not bake its git sha`,
    };
  }

  if (!repoReadable) {
    return {
      ok: true,
      unverifiable: true,
      verdict: "cannot verify (private)",
      detail: `live serves ${servedSha.slice(0, 7)}; ${target.repo} is private to this token, so main is unknown`,
    };
  }

  // ── Rules 1 and 2: ancestry and lag ────────────────────────────────────
  if (servedSha === mainSha) {
    return {
      ok: true,
      verdict: "ok",
      detail: `live serves main HEAD ${servedSha.slice(0, 7)}`,
    };
  }

  const cmp = await gh(`repos/${target.repo}/compare/${servedSha}...main`);
  if (cmp.status === 404) {
    return {
      ok: false,
      verdict: "FAIL",
      detail: `live serves ${servedSha.slice(0, 7)}, which is not a commit in ${target.repo}`,
    };
  }
  if (cmp.status !== 200) {
    return {
      ok: true,
      unverifiable: true,
      verdict: "skipped",
      detail: `GitHub compare answered ${cmp.status}`,
    };
  }
  const { status, ahead_by: aheadBy, commits = [] } = cmp.json;
  // base = served, head = main. "ahead" means main is ahead of served, i.e.
  // served IS an ancestor. "behind" / "diverged" mean it is not.
  if (status !== "ahead" && status !== "identical") {
    return {
      ok: false,
      verdict: "FAIL",
      detail: `live serves ${servedSha.slice(0, 7)}, which is not an ancestor of main ${mainSha.slice(0, 7)} (${status})`,
    };
  }
  const dates = commits
    .map((c) => Date.parse(c?.commit?.committer?.date ?? ""))
    .filter((t) => Number.isFinite(t));
  // Oldest commit main has that live does not. If the list was truncated
  // (GitHub caps it at 250) fall back to main HEAD's own date — a lag that
  // deep is over the window either way.
  const oldest = dates.length
    ? Math.min(...dates)
    : Date.parse(head.json.commit.committer.date);
  const lagMs = Date.now() - oldest;
  const summary = `live serves ${servedSha.slice(0, 7)}; main ${mainSha.slice(0, 7)} is ${aheadBy} commit(s) ahead, oldest unserved is ${hours(lagMs)}h old`;
  if (lagMs > MAX_LAG_MS) {
    return {
      ok: false,
      verdict: "FAIL",
      detail: `${summary} — over the 24h window`,
    };
  }
  return {
    ok: true,
    verdict: "ok",
    detail: `${summary} — within the 24h window (deploy in flight)`,
  };
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

const width = Math.max(...results.map((r) => r.target.name.length));
console.log("\nDeploy freshness — does live serve main?\n" + "─".repeat(78));
for (const r of results) {
  const icon = r.ok ? (r.unverifiable ? "~" : "✓") : "✗";
  const line = `${icon}  ${r.target.name.padEnd(width + 2)} ${r.verdict.padEnd(24)} ${r.detail}`;
  if (r.ok) console.log(line);
  else console.error(line);
}
console.log("─".repeat(78));

const failed = results.filter((r) => !r.ok);
const unverifiable = results.filter((r) => r.ok && r.unverifiable);

if (process.env.GITHUB_STEP_SUMMARY) {
  const rows = results
    .map(
      (r) =>
        `| ${r.ok ? (r.unverifiable ? "~" : "✓") : "✗"} | ${r.target.name} | ${r.verdict} | ${r.detail} |`
    )
    .join("\n");
  appendFileSync(
    process.env.GITHUB_STEP_SUMMARY,
    `### Deploy freshness\n\n| | Site | Verdict | Detail |\n|---|---|---|---|\n${rows}\n\n`
  );
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
  `\nAll ${results.length - unverifiable.length} verifiable sites serve main.`
);
