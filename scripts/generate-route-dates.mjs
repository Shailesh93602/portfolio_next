#!/usr/bin/env node
/**
 * Generate lib/route-modified.json — the real last-content-change date per route.
 *
 * WHY THIS EXISTS.
 *
 * app/sitemap.ts used to set `lastModified: new Date()` on every static route,
 * evaluated at build time. Every deploy therefore told Google that every page
 * had just changed. Measured against git, that was false by months: /about and
 * /contact last changed 2026-04-14 while the sitemap claimed today.
 *
 * A lastModified that is always "now" is worse than none. Google explicitly
 * discounts the field for sites where it never disagrees with the crawl date,
 * so the one signal that could earn faster recrawls on the pages that DID
 * change gets ignored across the whole site.
 *
 * WHY A GENERATED FILE RATHER THAN CALLING GIT AT BUILD TIME.
 *
 * Vercel builds from a shallow clone, so `git log` there can report the clone
 * date or nothing at all — the fix would silently reintroduce the bug it
 * replaces, and only in production. Committing the dates makes the value
 * identical locally and on Vercel, and reviewable in the diff.
 *
 * STALENESS IS THE SAFE DIRECTION. If this is not re-run, dates UNDERSTATE
 * freshness. Google re-crawls anyway and finds newer content; the failure mode
 * is a missed hint, not a false claim. That asymmetry is deliberate.
 *
 * Usage: npm run gen:route-dates   (also wired into prebuild)
 */
import { execFileSync } from "node:child_process";
import { writeFileSync, readFileSync } from "node:fs";

/**
 * Each route maps to the paths whose content it actually renders — not just
 * page.tsx. /portfolio is driven by constants/projects.ts, so a project edit is
 * a real change to that page even when page.tsx is untouched.
 */
const ROUTES = {
  "/": ["app/page.tsx", "components/Home", "constants/projects.ts"],
  "/blogs": ["app/blogs/page.tsx", "lib/blog-data.ts"],
  "/about": ["app/about/page.tsx"],
  "/contact": ["app/contact/page.tsx"],
  "/portfolio": ["app/portfolio/page.tsx", "constants/projects.ts"],
  "/services": ["app/services/page.tsx"],
  "/engineering": ["app/engineering/page.tsx"],
  "/statistics": ["app/statistics/page.tsx"],
  "/now": ["app/now/page.tsx"],
};

/** Committer date (%cs, YYYY-MM-DD) of the newest commit touching any path. */
function lastChanged(paths) {
  const out = execFileSync(
    "git",
    ["log", "-1", "--format=%cs", "--", ...paths],
    { encoding: "utf8" }
  ).trim();
  return out || null;
}

const target = "lib/route-modified.json";

/** What is already committed — the floor this run must never fall below. */
let committed = {};
try {
  committed = JSON.parse(readFileSync(target, "utf8"));
} catch {
  /* first run */
}

const dates = {};
let degraded = false;
for (const [route, paths] of Object.entries(ROUTES)) {
  let d = null;
  try {
    d = lastChanged(paths);
  } catch (err) {
    // git absent, or not a repository. Both are normal outside a dev checkout.
    d = null;
  }
  if (d) {
    dates[route] = d;
  } else if (committed[route]) {
    // THE IMPORTANT BRANCH. This script runs on `prebuild`, and Vercel builds
    // from a SHALLOW clone where `git log -- <path>` can legitimately return
    // nothing. Without this, a production build would overwrite the committed
    // dates with an empty file, app/sitemap.ts would import that, and every
    // route would fall back to the sentinel date — the script that exists to
    // stop the sitemap lying would be the thing making it lie, in production
    // only, silently.
    dates[route] = committed[route];
    degraded = true;
  } else {
    console.warn(
      `[route-dates] no git history and no committed date for ${route}`
    );
  }
}

// Projects get their own entry: every /portfolio/<id> page renders from the
// same source file, so they share its date rather than inventing one each.
try {
  dates["__projects__"] =
    lastChanged(["constants/projects.ts"]) ?? committed["__projects__"] ?? null;
} catch {
  dates["__projects__"] = committed["__projects__"] ?? null;
}

if (degraded) {
  console.warn(
    "[route-dates] git history unavailable for some routes (expected on a " +
      "shallow CI clone) — keeping the committed dates for those."
  );
}

// Never write a file with fewer routes than the one already committed. A
// partial result is strictly worse than a slightly stale one.
const committedCount = Object.keys(committed).length;
if (committedCount > 0 && Object.keys(dates).length < committedCount) {
  console.warn(
    `[route-dates] refusing to write: would drop ${
      committedCount - Object.keys(dates).length
    } route(s). Keeping ${target} as committed.`
  );
  process.exit(0);
}

const next = JSON.stringify(dates, null, 2) + "\n";
const prev =
  committedCount > 0 ? JSON.stringify(committed, null, 2) + "\n" : "";
if (prev !== next) {
  writeFileSync(target, next);
  console.log(`[route-dates] wrote ${target}`);
} else {
  console.log("[route-dates] unchanged");
}
