import robots, { __testing } from "@/app/robots";
import sitemap from "@/app/sitemap";

const { ALLOW, DISALLOW, RETRIEVAL_BOTS, TRAINING_BOTS } = __testing;
const rules = robots().rules as Array<{
  userAgent?: string | string[];
  allow?: string | string[];
  disallow?: string | string[];
}>;
const asList = (v: string | string[] | undefined) =>
  v === undefined ? [] : Array.isArray(v) ? v : [v];

/**
 * Decide a path the way a real crawler does: longest matching rule wins, and
 * Allow beats Disallow on a tie. Order in the file is irrelevant.
 */
function isCrawlable(path: string): boolean {
  const longest = (list: string[]) =>
    list
      .filter((r) => path.startsWith(r))
      .reduce((best, r) => (r.length > best.length ? r : best), "");
  const a = longest(ALLOW);
  const d = longest(DISALLOW);
  return a.length >= d.length;
}

describe("robots.txt", () => {
  /**
   * The real conflict this file exists to prevent.
   *
   * The sitemap annotates routes with `images` pointing at /api/og?... — the
   * per-route OG render. A blanket `Disallow: /api/` forbids fetching exactly
   * those URLs, so the sitemap would advertise images the crawler may not load.
   * Nothing at runtime fails when two static files disagree; only a test can
   * catch it.
   */
  it("does not block any image the sitemap advertises", async () => {
    const entries = await sitemap();
    const images = entries.flatMap((e) => e.images ?? []);
    expect(images.length).toBeGreaterThan(0);
    const blocked = images
      .map((u) => new URL(u).pathname)
      .filter((p) => !isCrawlable(p));
    expect(blocked).toEqual([]);
  });

  it("does not block any page the sitemap advertises", async () => {
    const entries = await sitemap();
    const blocked = entries
      .map((e) => new URL(e.url).pathname)
      .filter((p) => !isCrawlable(p));
    expect(blocked).toEqual([]);
  });

  it("still blocks the non-rendering API endpoints", () => {
    // The carve-out must be surgical: /api/og only, not all of /api/.
    expect(isCrawlable("/api/contact")).toBe(false);
    expect(isCrawlable("/api/statistics")).toBe(false);
    expect(isCrawlable("/api/og")).toBe(true);
  });

  it("never blocks the site root", () => {
    expect(isCrawlable("/")).toBe(true);
    expect(DISALLOW).not.toContain("/");
  });

  /**
   * robots.txt group matching is winner-take-all: a crawler obeys only the most
   * specific group whose user-agent matches it, ignoring `*` entirely. A named
   * group with `allow: "/"` and no disallows GRANTS that bot everything — the
   * failure where adding AI-crawler rules to tighten access loosens it instead.
   */
  it("every named user-agent group repeats the full rule set", () => {
    const named = rules.filter((r) => r.userAgent !== "*");
    expect(named.length).toBeGreaterThan(0);
    for (const rule of named) {
      expect(asList(rule.allow).sort()).toEqual([...ALLOW].sort());
      expect(asList(rule.disallow).sort()).toEqual([...DISALLOW].sort());
    }
  });

  it("names both retrieval and training crawlers", () => {
    const covered = rules.flatMap((r) => asList(r.userAgent));
    for (const bot of [...RETRIEVAL_BOTS, ...TRAINING_BOTS])
      expect(covered).toContain(bot);
  });
});
