import { test, expect } from "@playwright/test";
import { BLOG_ROUTES } from "./routes";
import { blogPosts } from "../lib/blog-data";

/**
 * Blog reading journey + syndication health.
 *
 * The blog is the "can this person explain a system in writing?" evidence, so
 * a post that renders its raw HTML as text, a feed that isn't valid XML, or a
 * missing cover image all cost more than a normal content bug would.
 */

const samplePost = blogPosts.find(
  (p) => p.slug === "building-inventory-engine-never-oversells-concurrency"
)!;

test.describe("Blog journey", () => {
  test("listing → post → body renders as HTML, not escaped source", async ({
    page,
  }) => {
    await page.goto("/blogs", { waitUntil: "networkidle" });

    const link = page.locator(`a[href="/blog/${samplePost.slug}"]`).first();
    await expect(link, "sample post not linked from the listing").toBeVisible();
    // Activate by keyboard: the card is taller than the viewport, so Playwright
    // scrolls its centre into view and the sticky header then sits over the
    // computed click point. Enter-on-focus is both reliable and a real user
    // path (it is how a keyboard-only visitor opens the post).
    await link.focus();
    await link.press("Enter");
    await page.waitForURL(`**/blog/${samplePost.slug}`);

    await expect(page.locator("h1").first()).toContainText(
      samplePost.title.slice(0, 30)
    );

    // The MDX body is authored as HTML; if it were injected as text the page
    // would literally show "<p>" and there would be no rendered <p>/<h2>.
    const article = page.locator("article, main").first();
    const text = await article.innerText();
    expect(text, "raw HTML tags leaked into the rendered body").not.toContain(
      "<p>"
    );
    expect(
      await page.locator("main p").count(),
      "post body rendered no paragraphs"
    ).toBeGreaterThan(3);
    expect(
      await page.locator("main h2, article h2").count(),
      "post body rendered no section headings"
    ).toBeGreaterThan(0);
  });

  test("every listed post links to a page that exists", async ({
    page,
    request,
  }) => {
    await page.goto("/blogs", { waitUntil: "networkidle" });
    const hrefs = await page.$$eval('a[href^="/blog/"]', (as) => [
      ...new Set(
        as.map((a) => (a as HTMLAnchorElement).getAttribute("href") ?? "")
      ),
    ]);
    expect(hrefs.length).toBeGreaterThan(0);

    const broken: string[] = [];
    for (const href of hrefs) {
      const res = await request.get(href);
      if (res.status() !== 200) broken.push(`${res.status()} ${href}`);
    }
    expect(broken, "blog cards pointing at non-200 pages").toEqual([]);

    // Every published slug should be reachable from the listing — a post that
    // exists but is never linked is invisible to a human reader.
    const missing = BLOG_ROUTES.filter((r) => !hrefs.includes(r));
    expect(missing, "published posts not linked from /blogs").toEqual([]);
  });

  test("RSS feed is well-formed XML with real items", async ({ request }) => {
    const res = await request.get("/feed.xml");
    expect(res.status()).toBe(200);
    expect(res.headers()["content-type"] ?? "").toMatch(/xml/);

    const xml = await res.text();
    expect(xml.trimStart().startsWith("<?xml")).toBe(true);
    expect(xml).toContain("<rss");
    expect(xml).toContain("<channel>");

    const items = xml.match(/<item>/g) ?? [];
    expect(items.length, "feed has no items").toBeGreaterThan(5);

    // Unescaped raw & is the classic way an RSS feed silently fails to parse
    // in a reader. Allow entities and CDATA, reject bare ampersands.
    const withoutCdata = xml.replace(/<!\[CDATA\[[\s\S]*?\]\]>/g, "");
    const badAmp = withoutCdata.match(
      /&(?!(amp|lt|gt|quot|apos|#\d+|#x[\da-f]+);)/gi
    );
    expect(badAmp ?? [], "unescaped ampersands in feed.xml").toEqual([]);

    // Every <link> in the feed must point at a real post URL shape.
    const links = [...xml.matchAll(/<link>([^<]+)<\/link>/g)].map((m) => m[1]);
    expect(links.length).toBeGreaterThan(0);
    for (const link of links) {
      expect(() => new URL(link)).not.toThrow();
    }
  });

  test("a specific post's cover/OG image resolves to a real image", async ({
    request,
    baseURL,
  }) => {
    const base = baseURL ?? "http://localhost:3000";
    const res = await request.get(`/blog/${samplePost.slug}`);
    const html = await res.text();

    const og = html.match(
      /<meta[^>]+property="og:image"[^>]*content="([^"]+)"/i
    )?.[1];
    expect(og, "post has no og:image").toBeTruthy();

    const local = new URL(og!, base);
    local.protocol = new URL(base).protocol;
    local.host = new URL(base).host;

    const img = await request.get(local.toString());
    expect(img.status(), `${local} returned ${img.status()}`).toBe(200);
    expect(img.headers()["content-type"] ?? "").toMatch(/^image\//);
    expect((await img.body()).byteLength).toBeGreaterThan(1000);
  });

  test("post pages carry BlogPosting JSON-LD with an author and date", async ({
    page,
  }) => {
    await page.goto(`/blog/${samplePost.slug}`, {
      waitUntil: "domcontentloaded",
    });
    const schemas = await page.evaluate(() =>
      Array.from(
        document.querySelectorAll('script[type="application/ld+json"]')
      ).map((s) => {
        try {
          return JSON.parse(s.textContent ?? "{}");
        } catch {
          return { __invalid: true };
        }
      })
    );
    expect(
      schemas.some((s) => s.__invalid),
      "a JSON-LD block on the post page is not parseable JSON"
    ).toBe(false);

    const flat = schemas.flatMap((s) => (s["@graph"] ? s["@graph"] : [s]));
    const posting = flat.find((s) =>
      ["BlogPosting", "Article", "TechArticle"].includes(s["@type"])
    );
    expect(posting, "no BlogPosting/Article JSON-LD on the post").toBeDefined();
    expect(posting.headline || posting.name).toBeTruthy();
    expect(posting.author).toBeTruthy();
    expect(posting.datePublished).toBeTruthy();
  });
});
