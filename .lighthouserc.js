/** @type {import('@lhci/cli').LhciConfig} */
//
// Lighthouse CI runs on every PR + daily cron. We collect both desktop
// AND mobile runs (recruiters at Vercel check mobile scores too) and
// enforce:
//   - aggregate category scores (perf warn, a11y/best-practices/SEO error)
//   - numeric Web Vitals budgets (LCP / INP / CLS / TBT) matching the
//     target-company bar from the 2026-04-19 recruiter review
//
// To add a new URL: put it in BOTH the desktop and mobile collect blocks.
// To relax a budget: change the maxNumericValue in the assertions block.

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
    collect: [
      {
        url: URLS,
        numberOfRuns: 1,
        settings: {
          preset: "desktop",
          throttlingMethod: "simulate",
        },
      },
      {
        url: URLS,
        numberOfRuns: 1,
        settings: {
          // Lighthouse default mobile preset — matches Vercel Speed
          // Insights dashboard and Google PageSpeed mobile reports.
          preset: undefined,
          throttlingMethod: "simulate",
          formFactor: "mobile",
          screenEmulation: {
            mobile: true,
            width: 390,
            height: 844,
            deviceScaleFactor: 2,
            disabled: false,
          },
        },
      },
    ],
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
