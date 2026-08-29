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

const projects = readFileSync(PROJECTS_TS, "utf8");
let failures = 0;

console.log("Verifying portfolio claims against upstream repositories\n");

for (const claim of CLAIMS) {
  const localMatch = projects.match(claim.localPattern);
  if (!localMatch) {
    // The claim was reworded or removed. Not automatically wrong — but this
    // checker can no longer vouch for it, and silently passing would be the
    // failure mode the whole script exists to prevent.
    console.error(
      `✗  ${claim.what}: no longer found in projects.ts — update or remove this check`
    );
    failures++;
    continue;
  }
  const stated = localMatch[1];

  let upstream;
  try {
    const text = await fetchAtHead(claim.repo, claim.path);
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
    `${failures} claim(s) no longer match. Update constants/projects.ts — ` +
      `a number that was true when written is still false now.`
  );
  process.exit(1);
}
console.log("All verifiable claims match.");
