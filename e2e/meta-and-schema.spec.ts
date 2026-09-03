import { test, expect, APIRequestContext } from "@playwright/test";
import {
  ALL_ROUTES,
  BLOG_ROUTES,
  PROJECT_ROUTES,
  STATIC_ROUTES,
} from "./routes";

/**
 * Per-route SEO contract.
 *
 * `seo.spec.ts` checks the hand-picked schema blocks; this one is the breadth
 * pass — every route the app can serve must carry a unique title, a
 * description, a self-referencing canonical, an og:type, and JSON-LD that
 * actually parses. A duplicate title across 20 blog posts, or a canonical
 * pointing at the wrong page, quietly costs search visibility.
 */

const SITE_HOST = "shaileshchaudhari.vercel.app";

async function head(request: APIRequestContext, route: string) {
  const res = await request.get(route);
  expect(res.status(), `${route} returned ${res.status()}`).toBe(200);
  const html = await res.text();
  const meta = (prop: string) =>
    html.match(
      new RegExp(
        `<meta[^>]+(?:property|name)="${prop}"[^>]*content="([^"]*)"`,
        "i"
      )
    )?.[1] ??
    html.match(
      new RegExp(
        `<meta[^>]+content="([^"]*)"[^>]*(?:property|name)="${prop}"`,
        "i"
      )
    )?.[1] ??
    null;
  // <title> in the served HTML is entity-escaped ("&quot;", "&#x27;"), which
  // inflates a length check by 5 chars per apostrophe. Measure what a human
  // (and Google) actually sees.
  const decode = (v: string | null) =>
    v === null
      ? null
      : v
          .replace(/&quot;/g, '"')
          .replace(/&#x27;|&apos;|&#39;/g, "'")
          .replace(/&lt;/g, "<")
          .replace(/&gt;/g, ">")
          .replace(/&#x2F;/g, "/")
          .replace(/&amp;/g, "&");
  return {
    html,
    title: decode(html.match(/<title>([^<]*)<\/title>/i)?.[1] ?? null),
    description: meta("description"),
    ogTitle: meta("og:title"),
    ogType: meta("og:type"),
    ogUrl: meta("og:url"),
    canonical:
      html.match(/<link[^>]+rel="canonical"[^>]*href="([^"]+)"/i)?.[1] ??
      html.match(/<link[^>]+href="([^"]+)"[^>]*rel="canonical"/i)?.[1] ??
      null,
  };
}

test.describe("Every route carries a complete head", () => {
  for (const route of ALL_ROUTES) {
    test(`${route} — title, description, canonical, og`, async ({
      request,
    }) => {
      const m = await head(request, route);

      expect(m.title, `${route} has no <title>`).toBeTruthy();
      expect(m.title!.length, `${route} title too short`).toBeGreaterThan(10);

      // The defect this catches: the root layout used to declare a
      // `%s | <siteName>` title template while every page (and both dynamic
      // routes) already branded itself, so the brand landed twice — e.g.
      // "…Algorithm Mastery | Shailesh Chaudhari's Blog | Shailesh Chaudhari's
      // Blog". Any repeat of the owner's name in one <title> is that bug back.
      const nameHits = (m.title!.match(/Shailesh/g) ?? []).length;
      expect(
        nameHits,
        `${route} repeats the brand in its <title>: ${m.title}`
      ).toBeLessThanOrEqual(1);

      // Google renders ~60 chars. Post titles are long-form by nature, so they
      // get a looser cap than the hand-written page titles.
      const cap = route.startsWith("/blog/") ? 95 : 70;
      expect(
        m.title!.length,
        `${route} title too long for SERP (${m.title!.length} > ${cap}): ${m.title}`
      ).toBeLessThanOrEqual(cap);

      expect(m.description, `${route} has no meta description`).toBeTruthy();
      expect(
        m.description!.length,
        `${route} description too short`
      ).toBeGreaterThan(50);

      expect(m.canonical, `${route} has no canonical`).toBeTruthy();
      expect(m.canonical!, `${route} canonical host`).toContain(SITE_HOST);

      expect(m.ogTitle, `${route} has no og:title`).toBeTruthy();
      expect(m.ogType, `${route} has no og:type`).toBeTruthy();
    });
  }
});

test.describe("Canonicals are self-referencing and unique", () => {
  test("no two routes share a canonical or a title", async ({ request }) => {
    // Walks every route serially; the 30s default is not enough under load.
    test.setTimeout(180_000);
    const seenCanonical = new Map<string, string>();
    const seenTitle = new Map<string, string>();
    const canonicalMismatch: string[] = [];
    const duplicateCanonical: string[] = [];
    const duplicateTitle: string[] = [];

    for (const route of ALL_ROUTES) {
      const m = await head(request, route);
      const path = new URL(m.canonical!).pathname.replace(/\/$/, "") || "/";
      const expected = route.replace(/\/$/, "") || "/";
      if (path !== expected) {
        canonicalMismatch.push(`${route} → canonical ${path}`);
      }
      const prevC = seenCanonical.get(m.canonical!);
      if (prevC)
        duplicateCanonical.push(`${route} shares canonical with ${prevC}`);
      else seenCanonical.set(m.canonical!, route);

      const prevT = seenTitle.get(m.title!);
      if (prevT) duplicateTitle.push(`${route} shares <title> with ${prevT}`);
      else seenTitle.set(m.title!, route);
    }

    expect(
      canonicalMismatch,
      "canonical does not point at its own URL"
    ).toEqual([]);
    expect(duplicateCanonical, "duplicate canonicals").toEqual([]);
    expect(duplicateTitle, "duplicate <title> tags").toEqual([]);
  });
});

test.describe("JSON-LD parses everywhere", () => {
  for (const route of [...STATIC_ROUTES, ...PROJECT_ROUTES, BLOG_ROUTES[0]]) {
    test(`${route} — every ld+json block is valid JSON`, async ({ page }) => {
      await page.goto(route, { waitUntil: "domcontentloaded" });
      const bad = await page.evaluate(() =>
        Array.from(
          document.querySelectorAll('script[type="application/ld+json"]')
        )
          .map((s, i) => {
            try {
              const parsed = JSON.parse(s.textContent ?? "");
              return parsed && typeof parsed === "object" ? null : `block ${i}`;
            } catch (e) {
              return `block ${i}: ${(e as Error).message}`;
            }
          })
          .filter(Boolean)
      );
      expect(bad, `invalid JSON-LD on ${route}`).toEqual([]);
    });
  }

  test("project detail pages describe themselves as a SoftwareApplication", async ({
    page,
  }) => {
    const missing: string[] = [];
    for (const route of PROJECT_ROUTES) {
      await page.goto(route, { waitUntil: "domcontentloaded" });
      const types = await page.evaluate(() =>
        Array.from(
          document.querySelectorAll('script[type="application/ld+json"]')
        ).flatMap((s) => {
          try {
            const parsed = JSON.parse(s.textContent ?? "{}");
            const nodes = parsed["@graph"] ?? [parsed];
            return nodes.map((n: { "@type"?: string }) => n["@type"] ?? "");
          } catch {
            return [];
          }
        })
      );
      if (
        !types.some((t) => /SoftwareApplication|CreativeWork|WebPage/.test(t))
      )
        missing.push(`${route} (types: ${types.join(",") || "none"})`);
    }
    expect(missing, "project pages without descriptive JSON-LD").toEqual([]);
  });
});

test.describe("Sitemap and robots agree with what is actually servable", () => {
  test("every sitemap URL resolves to a 200 on this build", async ({
    request,
  }) => {
    // Walks every route serially; the 30s default is not enough under load.
    test.setTimeout(120_000);
    const res = await request.get("/sitemap.xml");
    expect(res.status()).toBe(200);
    const xml = await res.text();
    const paths = [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) =>
      new URL(m[1]).pathname.replace(/\/$/, "")
    );
    expect(paths.length, "sitemap is empty").toBeGreaterThan(10);

    const broken: string[] = [];
    for (const p of paths) {
      const r = await request.get(p === "" ? "/" : p, { maxRedirects: 0 });
      if (r.status() !== 200) broken.push(`${r.status()} ${p || "/"}`);
    }
    expect(broken, "sitemap entries that do not return 200").toEqual([]);
  });

  test("every servable route is in the sitemap", async ({ request }) => {
    const xml = await (await request.get("/sitemap.xml")).text();
    const paths = new Set(
      [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map(
        (m) => new URL(m[1]).pathname.replace(/\/$/, "") || "/"
      )
    );
    const missing = ALL_ROUTES.filter((r) => !paths.has(r));
    expect(missing, "routes missing from the sitemap").toEqual([]);
  });

  test("robots.txt allows crawling and points at the sitemap", async ({
    request,
  }) => {
    const res = await request.get("/robots.txt");
    expect(res.status()).toBe(200);
    const txt = await res.text();
    expect(txt).toMatch(/User-Agent:\s*\*/i);
    expect(txt).toMatch(/Allow:\s*\//i);
    expect(txt).toContain(`https://${SITE_HOST}/sitemap.xml`);
    // Nothing indexable should be disallowed on a portfolio. `/api/` is the
    // one deliberate exception — JSON/POST endpoints with nothing to index —
    // and app/robots.ts pairs it with an explicit `Allow: /api/og` so the
    // sitemap's OG images stay fetchable (asserted in __tests__/robots.test.ts).
    const disallows = [...txt.matchAll(/Disallow:\s*(\S*)/gi)].map((m) => m[1]);
    expect(
      disallows.filter((d) => d && d !== "" && d !== "/api/"),
      "robots.txt disallows an indexable path"
    ).toEqual([]);
    expect(txt).toMatch(/Allow:\s*\/api\/og/i);
  });

  test("redirect targets are not advertised in the sitemap", async ({
    request,
  }) => {
    const xml = await (await request.get("/sitemap.xml")).text();
    for (const legacy of ["/hire", "/hire-me", "/blog"]) {
      expect(
        xml.includes(`>https://${SITE_HOST}${legacy}<`),
        `${legacy} (a redirect) is listed in the sitemap`
      ).toBe(false);
    }
  });
});
