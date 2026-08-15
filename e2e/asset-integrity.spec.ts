import { test, expect, Page, APIRequestContext } from "@playwright/test";
import {
  ALL_ROUTES,
  BLOG_ROUTES,
  IMAGE_HEAVY_ROUTES,
  PROJECT_ROUTES,
  REDIRECT_ROUTES,
} from "./routes";

/**
 * Asset-integrity gate — the "does every pixel actually load" sweep.
 *
 * A portfolio is a first impression for a hiring manager. A broken `<img>`,
 * a 404 in the Network tab, or an OG card that renders as a grey box when the
 * link is pasted into Slack all read as "this person ships broken things".
 * The existing console-and-links gate covers 11 hand-listed routes; this one
 * derives the route list from the app's own data so new projects and posts are
 * covered automatically, and it additionally asserts that every image element
 * decoded to non-zero intrinsic dimensions rather than merely 200-ing.
 */

// Third-party / Vercel-infra noise that only resolves on the real deployment.
const BENIGN_CONSOLE = [
  /google-analytics/i,
  /googletagmanager/i,
  /vitals\.vercel/i,
  /vercel-insights/i,
  /_vercel\/insights/i,
  /_vercel\/speed-insights/i,
  /clarity\.ms/i,
  /sentry/i,
  /doubleclick/i,
  /NotAllowedError/i,
];
const BENIGN_URLS = [/\/_vercel\/insights/i, /\/_vercel\/speed-insights/i];

type ImageReport = {
  src: string;
  naturalWidth: number;
  naturalHeight: number;
  complete: boolean;
  hidden: boolean;
  alt: string | null;
};

function sameOrigin(url: string, base: string): boolean {
  try {
    return new URL(url, base).host === new URL(base).host;
  } catch {
    return false;
  }
}

/** Point an absolute production URL at the server under test. */
export function toLocal(url: string, base: string): string {
  try {
    const u = new URL(url, base);
    const b = new URL(base);
    u.protocol = b.protocol;
    u.host = b.host;
    return u.toString();
  } catch {
    return url;
  }
}

async function scrollThrough(page: Page) {
  // Force lazy `next/image` payloads below the fold to actually request.
  await page.evaluate(async () => {
    const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));
    const height = document.body.scrollHeight;
    for (let y = 0; y < height; y += 500) {
      globalThis.scrollTo(0, y);
      await sleep(60);
    }
    globalThis.scrollTo(0, 0);
    await sleep(150);
  });
}

async function collectImages(page: Page): Promise<ImageReport[]> {
  return page.$$eval("img", (nodes) =>
    nodes.map((img) => {
      const el = img as HTMLImageElement;
      const style = globalThis.getComputedStyle(el);
      return {
        src: el.currentSrc || el.src || "(no src)",
        naturalWidth: el.naturalWidth,
        naturalHeight: el.naturalHeight,
        complete: el.complete,
        hidden:
          (typeof el.checkVisibility === "function"
            ? !el.checkVisibility()
            : style.display === "none" || style.visibility === "hidden") ||
          el.getAttribute("aria-hidden") === "true",
        alt: el.getAttribute("alt"),
      };
    })
  );
}

test.describe("Every route: no console errors, no failed requests", () => {
  for (const route of IMAGE_HEAVY_ROUTES) {
    test(`${route} — clean console + network`, async ({ page, baseURL }) => {
      const base = baseURL ?? "http://localhost:3000";
      const consoleErrors: string[] = [];
      const badResponses: string[] = [];
      const failedRequests: string[] = [];

      page.on("console", (msg) => {
        if (msg.type() !== "error") return;
        const text = msg.text();
        if (BENIGN_CONSOLE.some((p) => p.test(text))) return;
        if (/Failed to load resource/i.test(text)) return; // paired response event covers it
        consoleErrors.push(text);
      });
      page.on("pageerror", (err) =>
        consoleErrors.push(`pageerror: ${err.message}`)
      );
      page.on("requestfailed", (req) => {
        const url = req.url();
        if (!sameOrigin(url, base)) return;
        if (BENIGN_URLS.some((p) => p.test(url))) return;
        failedRequests.push(`${req.failure()?.errorText ?? "failed"} ${url}`);
      });
      page.on("response", (res) => {
        const url = res.url();
        if (!sameOrigin(url, base)) return;
        if (BENIGN_URLS.some((p) => p.test(url))) return;
        if (res.status() >= 400) badResponses.push(`${res.status()} ${url}`);
      });

      await page.goto(route, { waitUntil: "domcontentloaded" });
      await page
        .waitForLoadState("networkidle", { timeout: 15000 })
        .catch(() => {});
      await scrollThrough(page);
      await page
        .waitForLoadState("networkidle", { timeout: 15000 })
        .catch(() => {});

      expect.soft(consoleErrors, `console errors on ${route}`).toEqual([]);
      expect.soft(badResponses, `internal 4xx/5xx on ${route}`).toEqual([]);
      expect.soft(failedRequests, `failed requests on ${route}`).toEqual([]);
      expect(
        consoleErrors.length + badResponses.length + failedRequests.length
      ).toBe(0);
    });
  }
});

test.describe("Every image decodes with non-zero dimensions", () => {
  for (const route of IMAGE_HEAVY_ROUTES) {
    test(`${route} — all <img> loaded`, async ({ page }) => {
      await page.goto(route, { waitUntil: "domcontentloaded" });
      await page
        .waitForLoadState("networkidle", { timeout: 15000 })
        .catch(() => {});
      await scrollThrough(page);
      await page
        .waitForLoadState("networkidle", { timeout: 15000 })
        .catch(() => {});
      // next/image swaps in the real payload after decode; give it a beat.
      await page.waitForTimeout(400);

      const images = await collectImages(page);
      const visible = images.filter((i) => !i.hidden);
      // Image-bearing routes must actually carry imagery — a project page that
      // silently lost its hero would otherwise pass this spec vacuously.
      // /contact, /services, /now and /statistics are text-only by design.
      const mustHaveImages =
        route.startsWith("/portfolio/") ||
        route.startsWith("/blog/") ||
        ["/", "/about", "/portfolio", "/blogs"].includes(route);
      if (mustHaveImages) {
        expect(images.length, `no <img> at all on ${route}`).toBeGreaterThan(0);
      }

      const broken = visible.filter(
        (i) => !i.complete || i.naturalWidth === 0 || i.naturalHeight === 0
      );
      expect(broken, `images that failed to decode on ${route}`).toEqual([]);

      // An <img> with no alt attribute at all is an a11y + SEO miss; empty
      // alt="" is legitimate for decorative images so only null fails.
      const missingAlt = visible.filter((i) => i.alt === null);
      expect
        .soft(missingAlt, `images missing an alt attribute on ${route}`)
        .toEqual([]);
    });
  }
});

test.describe("Social preview images resolve", () => {
  async function metaImages(
    request: APIRequestContext,
    base: string,
    route: string
  ) {
    const res = await request.get(route);
    expect(res.status(), `${route} did not return 200`).toBe(200);
    const html = await res.text();
    const grab = (prop: string) => {
      const re = new RegExp(
        `<meta[^>]+(?:property|name)="${prop}"[^>]*content="([^"]+)"`,
        "i"
      );
      const alt = new RegExp(
        `<meta[^>]+content="([^"]+)"[^>]*(?:property|name)="${prop}"`,
        "i"
      );
      return html.match(re)?.[1] ?? html.match(alt)?.[1] ?? null;
    };
    return {
      og: grab("og:image"),
      twitter: grab("twitter:image"),
      html,
    };
  }

  const SOCIAL_ROUTES = [
    "/",
    "/about",
    "/portfolio",
    "/blogs",
    "/services",
    ...PROJECT_ROUTES,
    ...BLOG_ROUTES,
  ];

  for (const route of SOCIAL_ROUTES) {
    test(`${route} — og:image + twitter:image return a real image`, async ({
      request,
      baseURL,
    }) => {
      const base = baseURL ?? "http://localhost:3000";
      const { og, twitter } = await metaImages(request, base, route);

      expect(og, `${route} has no og:image`).toBeTruthy();
      expect(twitter, `${route} has no twitter:image`).toBeTruthy();

      for (const [label, url] of [
        ["og:image", og],
        ["twitter:image", twitter],
      ] as const) {
        const target = toLocal(url as string, base);
        const imgRes = await request.get(target);
        expect(
          imgRes.status(),
          `${label} on ${route} → ${target} returned ${imgRes.status()}`
        ).toBe(200);
        const type = imgRes.headers()["content-type"] ?? "";
        expect(type, `${label} on ${route} is not an image (${type})`).toMatch(
          /^image\//
        );
        const body = await imgRes.body();
        expect(
          body.byteLength,
          `${label} on ${route} is a zero-byte image`
        ).toBeGreaterThan(1000);
      }
    });
  }
});

test.describe("Site icons + downloadable assets", () => {
  test("favicon, icon and apple-icon all serve an image", async ({
    request,
  }) => {
    for (const path of ["/favicon.ico", "/icon", "/apple-icon"]) {
      const res = await request.get(path);
      expect(res.status(), `${path} returned ${res.status()}`).toBe(200);
      expect(
        res.headers()["content-type"] ?? "",
        `${path} content-type`
      ).toMatch(/^image\//);
      expect((await res.body()).byteLength, `${path} size`).toBeGreaterThan(
        100
      );
    }
  });

  test("web app manifest is valid JSON with icons", async ({ request }) => {
    const res = await request.get("/manifest.webmanifest");
    expect(res.status()).toBe(200);
    const manifest = JSON.parse(await res.text());
    expect(manifest.name || manifest.short_name).toBeTruthy();
    expect(Array.isArray(manifest.icons)).toBe(true);
  });

  test("resume link serves a real PDF, not a 404 page", async ({
    request,
    page,
  }) => {
    // The href the site actually renders — never a hard-coded guess.
    await page.goto("/", { waitUntil: "domcontentloaded" });
    const hrefs = await page.$$eval("a[href$='.pdf']", (as) =>
      as.map((a) => (a as HTMLAnchorElement).getAttribute("href") ?? "")
    );
    const resumeHref = hrefs.find((h) => /resume/i.test(h)) ?? hrefs[0];
    expect(resumeHref, "no PDF link found on the home page").toBeTruthy();

    const res = await request.get(resumeHref);
    expect(res.status(), `${resumeHref} returned ${res.status()}`).toBe(200);
    expect(res.headers()["content-type"] ?? "").toContain("application/pdf");
    const body = await res.body();
    // %PDF- magic bytes — a Next.js 404 HTML page would 200 in some setups.
    expect(body.subarray(0, 5).toString("utf8")).toBe("%PDF-");
    expect(body.byteLength).toBeGreaterThan(10_000);
  });
});

test.describe("Route inventory", () => {
  test("every derived route returns 200", async ({ request }) => {
    const failures: string[] = [];
    for (const route of ALL_ROUTES) {
      const res = await request.get(route, { maxRedirects: 0 });
      if (res.status() !== 200) failures.push(`${res.status()} ${route}`);
    }
    expect(failures, "routes not returning 200").toEqual([]);
  });

  test("legacy URLs permanently redirect instead of 404ing", async ({
    request,
  }) => {
    for (const { from, to } of REDIRECT_ROUTES) {
      const res = await request.get(from, { maxRedirects: 0 });
      expect([301, 308], `${from} status`).toContain(res.status());
      expect(res.headers()["location"] ?? "", `${from} → location`).toContain(
        to
      );
    }
  });
});
