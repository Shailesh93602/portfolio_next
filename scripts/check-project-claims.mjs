#!/usr/bin/env node
/**
 * check-project-claims.mjs
 *
 * Verifies the NUMBERS this portfolio states about other repositories against
 * what those repositories currently say.
 *
 * WHY THIS EXISTS.
 *
 * Every false claim ever found on this portfolio started as a true one. The
 * BALLAST entry said "Vitest (147)" — accurate when written, wrong four merges
 * later. Before that it claimed a "Redis-backed idempotency guard" for a
 * project that has no Redis at all.
 *
 * `check-live-urls.mjs` already catches links that rot. Numbers rot the same
 * way and nothing was watching them, which is worse: a dead link announces
 * itself with a 404, while a stale number keeps looking authoritative.
 *
 * The claim is the source of truth for what to check; the upstream repo is the
 * source of truth for whether it is true. Adding a claim here without a way to
 * verify it should feel like the omission it is.
 *
 * Run: node scripts/check-project-claims.mjs
 */

import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const PROJECTS_TS = resolve(__dirname, "..", "constants", "projects.ts");
const HOME_CONTENT = resolve(__dirname, "..", "app", "HomeContent.tsx");

/**
 * Where a claim can live.
 *
 * 🔴 THE GAP THIS CLOSES. Until now this script read only projects.ts, while
 * the HOME PAGE carries its own hardcoded prose about the same projects —
 * "Redlock over Redis to prevent duplicate battle starts", "8 simultaneous
 * deliveries produce exactly one ledger write".
 *
 * So the claims a recruiter reads FIRST were the only ones nothing verified.
 * Every claim this file has ever caught was true when written; there is no
 * reason the home page's would age differently.
 */
const CLAIMS_TS = resolve(__dirname, "..", "lib", "claims.ts");

/**
 * Personal facts (lib/profile.ts) — the GeeksforGeeks problem count lives here
 * and is checked against the profile itself, not a repository.
 */
const PROFILE_TS = resolve(__dirname, "..", "lib", "profile.ts");

const LOCAL_SOURCES = {
  projects: PROJECTS_TS,
  home: HOME_CONTENT,
  profile: PROFILE_TS,
  // Numbers that more than one page repeats live here ONCE (`/engineering`
  // said six, `/portfolio/ballast` said eight, the ledger said nine). The
  // pages import the constant; this script checks the constant.
  claims: CLAIMS_TS,
};

const TIMEOUT_MS = 20_000;

/**
 * Each claim names where it can be checked and how.
 *
 * `pattern` runs against the upstream file and must capture the number the
 * upstream currently states. If the pattern stops matching, that is a failure
 * too — it means the upstream reworded and the claim is no longer verifiable,
 * which is exactly when a number starts drifting unnoticed.
 */
const CLAIMS = [
  {
    what: "BALLAST test count",
    // What this portfolio says — one constant, rendered by the project card,
    // and held against the resume and llms.txt by claims-consistency.test.ts.
    // (It read 197 on three surfaces while the README said 202.)
    localFile: "claims",
    localPattern: /BALLAST_TEST_COUNT = (\d+)/,
    // Where the truth lives.
    repo: "Shailesh93602/ballast",
    path: "README.md",
    sourcePattern: /- \*\*(\d+) tests\*\*/,
  },
  // ── Home page prose ───────────────────────────────────────────────────
  //
  // These use `sourceMustMatch` rather than capturing a number: the claim is
  // that a MECHANISM exists, so the check is that the code implementing it is
  // still there.
  //
  // 🔴 EVERY ONE OF THESE POINTS AT A CALL SITE, NOT AT package.json. A
  // dependency being installed is not a feature being used — that is the exact
  // confusion that produced an unwired audit helper, an unwired retention job
  // and two unwired validation schemas elsewhere in this codebase. Checking the
  // manifest would let every one of these claims stay "true" while the code
  // that made it true was deleted.
  //
  // Verified against DevScale, the PUBLIC mirror of EduScale. The private repo
  // is unreachable to an unauthenticated cron; the mirror is re-synced after
  // every merge batch, so it is the right source for a daily check.
  {
    what: "home page: Redlock guards battle starts",
    localFile: "home",
    localPattern: /(Redlock) over Redis to prevent duplicate battle starts/,
    repo: "Shailesh93602/DevScale",
    path: "Backend/src/repositories/battleRepository.ts",
    // Not merely "the file mentions a lock" — startBattle must still TAKE one.
    // Removing the lock from that one method is the change this claim is
    // about, and a file-wide search for "withBattleLock" would sail past it,
    // since two other methods also take it.
    //
    // Expressed as "inside startBattle's body" rather than as a character
    // window. My first attempt used /async startBattle[\s\S]{0,800}?/ and
    // reported this true claim as FALSE — the real distance is ~1270
    // characters. A magic number there does not encode the claim, it encodes
    // today's formatting, and it fails the moment someone adds a comment.
    sourceCheck: (text) =>
      withinMethod(text, "async startBattle", "withBattleLock"),
  },
  {
    what: "home page: socket.io Redis adapter",
    localFile: "home",
    localPattern: /(@socket\.io\/redis-adapter) for horizontal scaling/,
    repo: "Shailesh93602/DevScale",
    path: "Backend/src/services/socket.ts",
    sourceMustMatch: /@socket\.io\/redis-adapter|createAdapter/,
  },
  {
    what: "home page: opossum circuit breaker",
    localFile: "home",
    localPattern: /(opossum) circuit breaker/,
    repo: "Shailesh93602/DevScale",
    path: "Backend/src/utils/codeExecutor.ts",
    sourceMustMatch: /opossum/,
  },
  {
    what: "home page: prom-client /metrics endpoint",
    localFile: "home",
    localPattern: /(prom-client) \/metrics/,
    repo: "Shailesh93602/DevScale",
    path: "Backend/src/main.ts",
    // The endpoint, not just the import — a metrics library with no route
    // exposed would make the claim false in the way that matters.
    sourceMustMatch: /['\`"]\/metrics['\`"][\s\S]{0,400}?register\.metrics\(\)/,
  },
  {
    what: "home page: 8 simultaneous deliveries, one stored row",
    localFile: "home",
    // Reworded 2026-09-05. This used to read "produce exactly one ledger
    // write", and the test it points at does not assert that: it counts
    // WhatsappMessage rows and 202s. A claim checker that verifies the NUMBER
    // against a test proving a DIFFERENT property is the subtlest way a true
    // number backs a false sentence. The ledger-level guarantee is the next
    // claim, with its own test.
    localPattern:
      /(\d+) simultaneous deliveries of one message collapse to one stored row/,
    repo: "Shailesh93602/KhataGO",
    path: "tests/integration/whatsapp-webhook.integration.test.ts",
    sourcePattern: /const CONCURRENCY = (\d+);/,
    // KhataGO is private, so an unauthenticated cron gets a 404 and this is
    // reported as UNVERIFIABLE rather than passing quietly. That is the point:
    // it makes the cost of the repo being private visible every day instead of
    // leaving one claim silently unchecked. It starts working by itself the
    // moment the repo goes public (MANUAL item 4).
    privateRepo: true,
  },
  {
    what: "home page: 8 concurrent executors, one ledger row",
    localFile: "home",
    localPattern:
      /(\d+) concurrent executors of one agent write step commit exactly one ledger row/,
    repo: "Shailesh93602/KhataGO",
    // "N concurrent executors of one planned write step produce ONE transaction
    // row and ONE result" — the tool's ledger write and the step's move to
    // DONE are one Postgres transaction, and the move is conditional.
    path: "tests/integration/agent-run.integration.test.ts",
    sourcePattern: /const CONCURRENCY = (\d+);/,
    privateRepo: true,
  },
  {
    what: "BALLAST ledger findings",
    localFile: "claims",
    localPattern: /BALLAST_LEDGER_FINDINGS = (\d+)/,
    repo: "Shailesh93602/ballast",
    path: "docs/LEDGER.md",
    // Counts the rows in the ledger's summary table.
    sourceCount: /^\| L\d+ /gm,
  },
  {
    what: "KhataGO Gemini tool count",
    localFile: "claims",
    localPattern: /KHATAGO_TOOL_COUNT = (\d+)/,
    repo: "Shailesh93602/KhataGO",
    path: "lib/ai/tools.ts",
    // One `name: "..."` per declared function tool.
    sourceCount: /^\s*name: "/gm,
    // Private today (see the claim above); checks itself once public.
    privateRepo: true,
  },
  {
    what: "KhataGO eval count",
    localFile: "claims",
    localPattern: /KHATAGO_EVAL_COUNT = (\d+)/,
    repo: "Shailesh93602/KhataGO",
    path: "evals/cases.ts",
    // One `id: "..."` per fixture conversation. The same number is what
    // `npm run evals` reports as its case count under either engine.
    sourceCount: /^\s*id: "/gm,
    privateRepo: true,
  },
  // ── GeeksforGeeks ─────────────────────────────────────────────────────
  //
  // The site says "Institute Rank 1 on GeeksforGeeks (650+ problems solved)".
  // The profile page is a Next.js app whose RSC payload embeds the profile
  // record as JSON — `"total_problems_solved":650,"institute_rank":1` — so
  // the two fields are matched by their JSON keys rather than by page
  // structure. If GfG moves them, the claim becomes UNVERIFIABLE (a warning
  // that names the reason), not a failure: a page redesign is not a false
  // claim, and scraping the rendered HTML instead would make this the
  // flakiest check in the file.
  //
  // "650+" is a floor, so the comparison is `atLeast`: the upstream figure may
  // grow past the stated one without making the claim false. It is reported
  // when it does, so the number can be raised.
  {
    what: "GeeksforGeeks problems solved (stated as a floor)",
    localFile: "profile",
    localPattern: /problemsSolved: (\d+)/,
    url: "https://www.geeksforgeeks.org/user/thenameisshaileshbhai/",
    // The JSON is string-escaped inside the RSC script tag, hence the optional
    // backslash before the closing quote.
    sourcePattern: /total_problems_solved\\?":(\d+)/,
    compare: "atLeast",
    fragile: true,
  },
  {
    what: "GeeksforGeeks institute rank",
    localFile: "profile",
    localPattern: /geeksforgeeksRank: (\d+)/,
    url: "https://www.geeksforgeeks.org/user/thenameisshaileshbhai/",
    sourcePattern: /institute_rank\\?":(\d+)/,
    fragile: true,
  },
];

const WORDS = {
  1: "one",
  2: "two",
  3: "three",
  4: "four",
  5: "five",
  6: "six",
  7: "seven",
  8: "eight",
  9: "nine",
  10: "ten",
};

const GH_HEADERS = {
  Accept: "application/vnd.github+json",
  "User-Agent": "portfolio-claim-check",
  // Present in Actions; absent locally, where the unauthenticated limit of 60
  // requests an hour is far more than this needs.
  ...(process.env.GITHUB_TOKEN
    ? { Authorization: `Bearer ${process.env.GITHUB_TOKEN}` }
    : {}),
};

/** Resolved once per repo per run — the SHA cannot change mid-run. */

/**
 * Does `needle` appear inside the body of `methodSignature`?
 *
 * Bounded by the NEXT method declaration rather than by a character count, so
 * the check keeps meaning what it means when the method grows or is
 * reformatted. Class methods here are indented two spaces, which is what marks
 * the boundary.
 */
function withinMethod(text, methodSignature, needle) {
  const start = text.indexOf(methodSignature);
  if (start === -1) return false;
  const after = text.slice(start + methodSignature.length);
  const nextMethod = after.search(
    /\n {2}(?:public |private |protected |static )*(?:async )?[A-Za-z_$][\w$]*\s*[(=]/
  );
  const body = nextMethod === -1 ? after : after.slice(0, nextMethod);
  return body.includes(needle);
}

/** Resolved once per repo per run — the SHA cannot change mid-run. */
const shaCache = new Map();

async function request(url, headers = GH_HEADERS) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);
  try {
    const res = await fetch(url, { signal: controller.signal, headers });
    if (!res.ok) throw new Error(`HTTP ${res.status} for ${url}`);
    return res;
  } finally {
    clearTimeout(timer);
  }
}

/**
 * Fetch a file at the CURRENT COMMIT of a repo's default branch.
 *
 * WHY NOT JUST raw.githubusercontent.com/<repo>/main/<path>.
 *
 * That URL is mutable — its content changes as `main` moves — so the CDN in
 * front of it serves stale objects for minutes after a push. This check would
 * then report a FALSE FAILURE in precisely the window that matters most: the
 * minutes after a merge, when someone is watching.
 *
 * That is not theoretical. Three consecutive runs against the same unchanged
 * file disagreed — two saw the new content, one saw the pre-merge version.
 * Cache-busting query parameters did not help; the CDN normalises them away.
 *
 * A flaky checker is worse than no checker: it wastes the investigation it
 * triggers, and it teaches everyone to disregard the next alert.
 *
 * Resolving the branch to a SHA first and fetching THAT makes the URL
 * immutable, so caching becomes correct instead of harmful — a cached response
 * for a SHA-pinned path is by definition the right content.
 */
async function fetchAtHead(repo, path) {
  let sha = shaCache.get(repo);
  if (sha === undefined) {
    const res = await request(
      `https://api.github.com/repos/${repo}/commits/HEAD`
    );
    sha = (await res.json()).sha;
    shaCache.set(repo, sha);
  }

  const res = await request(
    `https://raw.githubusercontent.com/${repo}/${sha}/${path}`,
    { "User-Agent": "portfolio-claim-check" }
  );
  return res.text();
}

const localText = Object.fromEntries(
  Object.entries(LOCAL_SOURCES).map(([key, file]) => [
    key,
    readFileSync(file, "utf8"),
  ])
);
const LOCAL_LABELS = {
  projects: "constants/projects.ts",
  home: "app/HomeContent.tsx",
  claims: "lib/claims.ts",
  profile: "lib/profile.ts",
};

/** A plain page, for claims whose source is not a GitHub repository. */
async function fetchPage(url) {
  const res = await request(url, {
    "User-Agent":
      "Mozilla/5.0 (compatible; portfolio-claim-check; +https://shaileshchaudhari.vercel.app)",
    Accept: "text/html",
  });
  return res.text();
}
let failures = 0;
let unverifiable = 0;

console.log("Verifying portfolio claims against upstream repositories\n");

for (const claim of CLAIMS) {
  const whichLocal = claim.localFile ?? "projects";
  const localMatch = localText[whichLocal].match(claim.localPattern);
  if (!localMatch) {
    // The claim was reworded or removed. Not automatically wrong — but this
    // checker can no longer vouch for it, and silently passing would be the
    // failure mode the whole script exists to prevent.
    const where = LOCAL_LABELS[whichLocal];
    console.error(
      `✗  ${claim.what}: no longer found in ${where} — update or remove this check`
    );
    failures++;
    continue;
  }
  const stated = localMatch[1];

  let upstream;
  try {
    const text = claim.url
      ? await fetchPage(claim.url)
      : await fetchAtHead(claim.repo, claim.path);
    if (claim.sourceCheck || claim.sourceMustMatch) {
      const ok = claim.sourceCheck
        ? claim.sourceCheck(text)
        : claim.sourceMustMatch.test(text);
      // Presence-shaped claim: the mechanism either is still implemented there
      // or it is not.
      if (!ok) {
        console.error(
          `✗  ${claim.what}: ${claim.path} no longer implements this — the claim is now FALSE`
        );
        failures++;
      } else {
        console.log(`✓  ${claim.what}: still implemented in ${claim.path}`);
      }
      continue;
    }
    if (claim.sourceCount) {
      upstream = String((text.match(claim.sourceCount) ?? []).length);
    } else {
      const m = text.match(claim.sourcePattern);
      if (!m) {
        if (claim.fragile) {
          // The source is a third-party page, not a file this project's
          // owner controls. Its shape changing says nothing about the claim.
          unverifiable++;
          console.warn(
            `⚠  ${claim.what}: portfolio says ${stated}, but ${claim.url} no longer ` +
              `exposes the field this check reads — UNVERIFIABLE until the check is updated.`
          );
          continue;
        }
        console.error(
          `✗  ${claim.what}: upstream no longer states this — the claim is unverifiable`
        );
        failures++;
        continue;
      }
      upstream = m[1];
    }
  } catch (error) {
    if (claim.fragile) {
      unverifiable++;
      console.warn(
        `⚠  ${claim.what}: could not read ${claim.url} (${error.message}) — UNVERIFIABLE this run.`
      );
      continue;
    }
    if (claim.privateRepo && /HTTP 404/.test(error.message)) {
      // Distinguished from an outage ON PURPOSE. A private repo is not a
      // transient failure that will clear itself — it is a claim that CANNOT
      // be checked until something changes, and reporting it as a skipped
      // network blip would hide that indefinitely.
      unverifiable++;
      console.warn(
        `⚠  ${claim.what}: portfolio says ${stated}, but ${claim.repo} is private ` +
          `so this cannot be verified. It will check itself once the repo is public.`
      );
      continue;
    }
    // A network failure is not a false claim. Say so rather than failing the
    // build for someone else's outage.
    console.warn(
      `⚠  ${claim.what}: could not reach source (${error.message}) — skipped`
    );
    continue;
  }

  const expected = claim.asWord
    ? (WORDS[Number(upstream)] ?? upstream)
    : upstream;

  if (claim.compare === "atLeast") {
    const statedN = Number(stated);
    const upstreamN = Number(upstream);
    if (upstreamN >= statedN) {
      console.log(
        `✓  ${claim.what}: portfolio says ${stated}+, upstream says ${upstream}` +
          (upstreamN > statedN ? " — the floor can be raised" : "")
      );
    } else {
      console.error(
        `✗  ${claim.what}: portfolio says ${stated}+, upstream says ${upstream}`
      );
      failures++;
    }
    continue;
  }

  if (stated === expected) {
    console.log(`✓  ${claim.what}: portfolio says ${stated}, upstream agrees`);
  } else {
    console.error(
      `✗  ${claim.what}: portfolio says ${stated}, upstream says ${expected}`
    );
    failures++;
  }
}

console.log();
if (failures > 0) {
  console.error(
    `${failures} claim(s) no longer match. Update constants/projects.ts, ` +
      `app/HomeContent.tsx, lib/claims.ts or lib/profile.ts — a claim that ` +
      `was true when written is still false now.`
  );
  process.exit(1);
}
console.log("All verifiable claims match.");
if (unverifiable > 0) {
  console.log(
    `${unverifiable} claim(s) could not be verified (private repository, or a ` +
      `third-party page that could not be read). Not a failure — but those are ` +
      `the claims that can drift without anything noticing.`
  );
}
