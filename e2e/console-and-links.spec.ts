import { test, expect, Page } from "@playwright/test";

/**
 * Broken-links + console-error gate.
 *
 * For each key route we:
 *   1. Visit the page
 *   2. Fail if any console error fires
 *   3. Fail if any same-origin fetch/xhr/navigation returns 4xx or 5xx
 *
 * Recruiters open DevTools. One red-underlined 404 in the Network tab is
 * a credibility hit. This keeps CI honest before anyone else notices.
 *
 * Internal-link-only — we don't chase off-site links (GitHub / LinkedIn
 * timeouts are noisy and out of our control).
 */

const ROUTES = [
  "/",
  "/about",
  "/portfolio",
  "/portfolio/eduscale",
  "/portfolio/devtrack",
  "/portfolio/khatago",
  "/portfolio/stripe-payments-demo",
  "/portfolio/redis-battle-demo",
  "/contact",
  "/blogs",
  "/statistics",
];

function isInternal(url: string, base: string): boolean {
  try {
    const u = new URL(url, base);
    const b = new URL(base);
    return u.host === b.host;
  } catch {
    return false;
  }
}

async function collect(
  page: Page,
  base: string,
  path: string
): Promise<{ consoleErrors: string[]; badResponses: string[] }> {
  const consoleErrors: string[] = [];
  const badResponses: string[] = [];

  // Ignore benign third-party + Vercel-infra console noise.
  // Vercel Insights / Speed Insights scripts only resolve on the real
  // deployment; they 404 against a local `next start` build, which
  // isn't a code bug.
  const benignMsgPatterns = [
    /google-analytics/i,
    /googletagmanager/i,
    /vitals\.vercel/i,
    /vercel-insights/i,
    /_vercel\/insights/i,
    /_vercel\/speed-insights/i,
    /clarity\.ms/i,
    /sentry/i,
    /doubleclick/i,
    /NotAllowedError/i, // audio autoplay blocked
  ];
  // URLs whose 4xx/5xx response we deliberately ignore (infra-only in prod).
  const benignUrlPatterns = [
    /\/_vercel\/insights/i,
    /\/_vercel\/speed-insights/i,
  ];

  page.on("console", (msg) => {
    if (msg.type() !== "error") return;
    const text = msg.text();
    if (benignMsgPatterns.some((p) => p.test(text))) return;
    // A generic "Failed to load resource" usually pairs with a separate
    // response event — skip it here and let the response listener catch
    // a real 4xx/5xx on a non-whitelisted URL.
    if (/Failed to load resource/i.test(text)) return;
    consoleErrors.push(text);
  });

  page.on("pageerror", (err) => {
    consoleErrors.push(`pageerror: ${err.message}`);
  });

  page.on("response", (response) => {
    const url = response.url();
    if (!isInternal(url, base)) return;
    if (benignUrlPatterns.some((p) => p.test(url))) return;
    const status = response.status();
    // 304 Not Modified + 3xx redirects are fine
    if (status >= 400) {
      badResponses.push(`${status} ${url}`);
    }
  });

  await page.goto(path, { waitUntil: "networkidle" });
  // Small settle time for lazy subscriptions (recharts etc.)
  await page.waitForTimeout(500);

  return { consoleErrors, badResponses };
}

test.describe("Broken-links + console-error gate", () => {
  for (const route of ROUTES) {
    test(`${route} — no console errors, no internal 4xx/5xx`, async ({
      page,
      baseURL,
    }) => {
      const base = baseURL ?? "http://localhost:3000";
      const { consoleErrors, badResponses } = await collect(page, base, route);
      expect.soft(consoleErrors, `console errors on ${route}`).toEqual([]);
      expect.soft(badResponses, `internal 4xx/5xx on ${route}`).toEqual([]);
      // Surface all soft failures at once so the report is useful
      expect(consoleErrors.length + badResponses.length).toBe(0);
    });
  }
});
