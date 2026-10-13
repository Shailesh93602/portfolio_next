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

import { CLAIMS } from "./claims/claim-list.mjs";
import { LEVEL, evaluateClaim } from "./claims/evaluate.mjs";
import { fetchAtHead, fetchPage, fetchTree } from "./claims/fetchers.mjs";

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

const LOCAL_LABELS = {
  projects: "constants/projects.ts",
  home: "app/HomeContent.tsx",
  claims: "lib/claims.ts",
  profile: "lib/profile.ts",
};

const local = Object.fromEntries(
  Object.entries(LOCAL_SOURCES).map(([key, file]) => [
    key,
    { label: LOCAL_LABELS[key], text: readFileSync(file, "utf8") },
  ])
);
const readers = { fetchAtHead, fetchPage, fetchTree };

let failures = 0;
let unverifiable = 0;

console.log("Verifying portfolio claims against upstream repositories\n");

for (const claim of CLAIMS) {
  const { outcome, message } = await evaluateClaim(claim, local, readers);
  console[LEVEL[outcome]](message);
  if (outcome === "fail") failures++;
  if (outcome === "unverifiable") unverifiable++;
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
