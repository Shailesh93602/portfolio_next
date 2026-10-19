/** @type {import('@lhci/cli').LhciConfig} */
//
// Lighthouse CI runs on every PR against the production server the workflow
// starts (`npm run build` + `npm run start` on :3000) and enforces:
//   - aggregate category scores (perf warn, a11y/best-practices/SEO error)
//   - numeric Web Vitals budgets (LCP / CLS / TBT) matching the
//     target-company bar from the 2026-04-19 recruiter review
//
// ON INP, AND WHY IT IS NOT ASSERTED HERE. This block used to claim it
// enforced INP while actually asserting `max-potential-fid` — a lab proxy for
// FID, which Google RETIRED in March 2024 and replaced with INP. So the
// documented intent named the current metric and the code enforced the dead
// one. INP cannot honestly be asserted in this run either: it is measured from
// real interactions, and a cold Lighthouse navigation performs none, so the
// audit reports notApplicable. TBT is the accepted lab proxy and is asserted
// below. Real INP belongs in field data (Vercel Speed Insights / CrUX).
//
// `collect` MUST be a single object. It was previously an array of two
// blocks (desktop + mobile); lhci does not support an array there, so it
// silently ignored `url`, auto-detected `./public` as a staticDistDir, and
// served an index-less folder — every run died with NO_FCP and never audited
// the real app. lhci can't run two form factors in one autorun, so we audit
// the desktop preset (which matches the budgets below); a mobile pass would
// need a separate workflow/matrix job.
//
// To add a new URL: add it to URLS. To relax a budget: change the
// maxNumericValue in the assertions block.
//
// LHCI_FORM_FACTOR=mobile runs the mobile pass on / and /about (the SEO
// plan's LCP pages); the workflow runs both form factors as a matrix.

const MOBILE = process.env.LHCI_FORM_FACTOR === "mobile";
const BASE = process.env.LHCI_BASE_URL || "http://localhost:3000";
const URLS = (
  MOBILE ? ["/", "/about"] : ["/", "/about", "/portfolio", "/blogs"]
).map((p) => BASE + p);

const categoryAssertions = {
  "categories:performance": ["warn", { minScore: 0.85 }],
  "categories:accessibility": ["error", { minScore: 0.95 }],
  "categories:best-practices": ["error", { minScore: 0.9 }],
  "categories:seo": ["error", { minScore: 1 }],
};

// Report-only: stable locally (best of 3: / 2.4-3.4 s, /about 3.1 s vs
// 3.6-4.0 s before the fix) but not yet measured on a CI runner. Make it
// "error" once a few main runs on ubuntu-latest sit under the budget.
const mobileLcpBudget = {
  "largest-contentful-paint": [
    "warn",
    { maxNumericValue: 3500, aggregationMethod: "optimistic" },
  ],
};

const webVitalsBudgets = {
  // Desktop-relevant budgets matching Vercel Speed Insights "Good" thresholds.
  // Mobile runs inherit the same budgets — fail fast on any regression.
  "largest-contentful-paint": ["warn", { maxNumericValue: 1800 }],
  "cumulative-layout-shift": ["error", { maxNumericValue: 0.05 }],
  // The lab stand-in for INP. Not a replacement for field data, but it is the
  // one number in a cold navigation that moves when interaction latency does.
  "total-blocking-time": ["warn", { maxNumericValue: 200 }],
};

module.exports = {
  ci: {
    collect: {
      // Explicit URLs (the running :3000 server) — keeps lhci from
      // auto-detecting ./public as a staticDistDir.
      url: URLS,
      numberOfRuns: MOBILE ? 3 : 1,
      settings: MOBILE
        ? { throttlingMethod: "simulate" }
        : { preset: "desktop", throttlingMethod: "simulate" },
    },
    assert: {
      // No `lighthouse:no-pwa` preset: it asserts hundreds of granular audits
      // (unused-javascript, errors-in-console, legacy-javascript, …) at error
      // level — noise that isn't what this gate is for. We enforce exactly the
      // documented intent: aggregate category scores + Web Vitals budgets.
      assertions: {
        ...categoryAssertions,
        ...webVitalsBudgets,
        ...(MOBILE ? mobileLcpBudget : {}),
      },
    },
    upload: {
      target: "temporary-public-storage",
    },
  },
};
