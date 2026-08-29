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
const LOCAL_SOURCES = {
  projects: PROJECTS_TS,
  home: HOME_CONTENT,
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
    // What this portfolio says.
    localPattern: /"Tests: Vitest \((\d+)\)"/,
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
    what: "home page: 8 concurrent deliveries, one ledger write",
    localFile: "home",
    localPattern:
      /(\d+) simultaneous deliveries of the same message produce exactly one ledger write/,
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
    what: "BALLAST ledger findings",
    localPattern: /The suite found (\w+) real bugs/,
    repo: "Shailesh93602/ballast",
    path: "docs/LEDGER.md",
    // Counts the rows in the ledger's summary table.
    sourceCount: /^\| L\d+ /gm,
    // The portfolio writes the number as a word.
    asWord: true,
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

const localText = {
  projects: readFileSync(PROJECTS_TS, "utf8"),
  home: readFileSync(HOME_CONTENT, "utf8"),
};
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
    const where =
      whichLocal === "home" ? "app/HomeContent.tsx" : "constants/projects.ts";
    console.error(
      `✗  ${claim.what}: no longer found in ${where} — update or remove this check`
    );
    failures++;
    continue;
  }
  const stated = localMatch[1];

  let upstream;
  try {
    const text = await fetchAtHead(claim.repo, claim.path);
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
        console.error(
          `✗  ${claim.what}: upstream no longer states this — the claim is unverifiable`
        );
        failures++;
        continue;
      }
      upstream = m[1];
    }
  } catch (error) {
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
    `${failures} claim(s) no longer match. Update constants/projects.ts or ` +
      `app/HomeContent.tsx — a claim that was true when written is still ` +
      `false now.`
  );
  process.exit(1);
}
console.log("All verifiable claims match.");
if (unverifiable > 0) {
  console.log(
    `${unverifiable} claim(s) could not be verified because their repository ` +
      `is private. Not a failure — but those are the claims that can drift ` +
      `without anything noticing.`
  );
}
