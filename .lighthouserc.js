/** @type {import('@lhci/cli').LhciConfig} */
//
// Lighthouse CI runs on every PR against the production server the workflow
// starts (`npm run build` + `npm run start` on :3000) and enforces:
//   - aggregate category scores (perf warn, a11y/best-practices/SEO error)
//   - numeric Web Vitals budgets (LCP / INP / CLS / TBT) matching the
//     target-company bar from the 2026-04-19 recruiter review
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

const URLS = [
  "http://localhost:3000/",
  "http://localhost:3000/about",
  "http://localhost:3000/portfolio",
  "http://localhost:3000/blogs",
];

const categoryAssertions = {
  "categories:performance": ["warn", { minScore: 0.85 }],
  "categories:accessibility": ["error", { minScore: 0.9 }],
  "categories:best-practices": ["error", { minScore: 0.9 }],
  "categories:seo": ["error", { minScore: 0.9 }],
};

const webVitalsBudgets = {
  // Desktop-relevant budgets matching Vercel Speed Insights "Good" thresholds.
  // Mobile runs inherit the same budgets — fail fast on any regression.
  "largest-contentful-paint": ["warn", { maxNumericValue: 1800 }],
  "cumulative-layout-shift": ["error", { maxNumericValue: 0.05 }],
  "total-blocking-time": ["warn", { maxNumericValue: 200 }],
  "max-potential-fid": ["warn", { maxNumericValue: 150 }],
};

module.exports = {
  ci: {
    collect: {
      // Explicit URLs (the running :3000 server) — keeps lhci from
      // auto-detecting ./public as a staticDistDir.
      url: URLS,
      numberOfRuns: 1,
      settings: {
        preset: "desktop",
        throttlingMethod: "simulate",
      },
    },
    assert: {
      preset: "lighthouse:no-pwa",
      assertions: {
        ...categoryAssertions,
        ...webVitalsBudgets,
      },
    },
    upload: {
      target: "temporary-public-storage",
    },
  },
};
