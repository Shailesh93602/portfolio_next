/**
 * Nothing in `public/` may serve a page of its own.
 *
 * WHY THIS EXISTS.
 *
 * Everything under `public/` is copied verbatim to the deployment root and
 * answers 200 forever, with no route, no layout, no metadata and no test
 * touching it. It is the one part of this site that is published without
 * being rendered — so it is the one part that can rot without anything going
 * red.
 *
 * It did. On 2026-09-20, `https://shaileshchaudhari.vercel.app/index.html`
 * returned the static site this Next app replaced in 2024:
 *
 *   - `<meta name="description">` offering "freelance services for small
 *     businesses and startups", and "Freelancer, Freelance Designer" in the
 *     keywords — the exact copy `no-hire-copy.test.ts` exists to keep off this
 *     site, on a URL that test did not read.
 *   - Person JSON-LD with `"jobTitle": "Full-Stack Web Developer"` and
 *     `"worksFor": { "name": "eSparkBiz" }` — a former employer, published as
 *     the current one, to every crawler that fetched the file.
 *   - `<meta name="robots" content="index,follow">` plus a canonical pointing
 *     at the homepage, so the stale copy was offered to the index under the
 *     live domain.
 *   - An empty `<div id="root">` and no bundle: a human who opened it saw a
 *     blank page with a third-party chat widget and an AdSense script.
 *
 * It shipped in every deploy for months. No page linked it, which is exactly
 * why nobody found it — an unlinked page is invisible to a crawl of the site
 * and perfectly visible to anyone with the URL, including Google.
 *
 * The rule, therefore: `public/` holds assets, never documents. A page belongs
 * in `app/`, where it gets metadata, a canonical, the layout, the a11y sweep
 * and the SEO contract in `e2e/meta-and-schema.spec.ts`.
 */
import { readdirSync, readFileSync, statSync } from "node:fs";
import { join, relative } from "node:path";

const ROOT = process.cwd();
const PUBLIC = join(ROOT, "public");

/**
 * Search Console's verification file is an HTML file only by extension: one
 * line holding the token, with no markup and nothing to index. It is named
 * here rather than matched by shape so that removing the verification is a
 * deliberate edit to this list.
 */
const ALLOWED_HTML = new Set(["google5c16a36058a0e9e7.html"]);

/**
 * Host-specific routing files. `_redirects` is Netlify/Cloudflare Pages; this
 * site deploys on Vercel, where the file is inert — which is the danger. It
 * said `/*  /index.html  200`, so on any host that reads it, every route on
 * the site would have served the 2024 shell above instead of the app.
 */
const HOST_ROUTING_FILES = ["_redirects", "_headers", "netlify.toml"];

function walk(dir: string): string[] {
  const out: string[] = [];
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry);
    if (statSync(full).isDirectory()) out.push(...walk(full));
    else out.push(full);
  }
  return out;
}

const files = walk(PUBLIC).map((f) => relative(PUBLIC, f));

describe("public/ serves assets, not pages", () => {
  it("finds the public directory at all", () => {
    // Guards everything below: if this ever resolves to an empty directory the
    // assertions pass while checking nothing, which is worse than not running.
    expect(files.length).toBeGreaterThan(10);
  });

  it("holds no HTML document other than the verification stub", () => {
    const offenders = files
      .filter((f) => f.endsWith(".html") && !ALLOWED_HTML.has(f))
      .map(
        (f) =>
          `public/${f} — anything in public/ is served at its own URL with no ` +
          `metadata, no canonical and no test. Move the page under app/, or delete it.`
      );
    expect(offenders).toEqual([]);
  });

  it("holds no host routing file that could shadow the app's routes", () => {
    const offenders = files
      .filter((f) => HOST_ROUTING_FILES.includes(f))
      .map(
        (f) =>
          `public/${f} — a rewrite rule for a host this site does not deploy to. ` +
          `It does nothing here and hijacks every route somewhere else.`
      );
    expect(offenders).toEqual([]);
  });

  it("names no former employer in any file it does serve", () => {
    // The stale JSON-LD is the half of the incident that a copy scan catches
    // and a file-extension rule does not: it would have been just as wrong
    // inside a .txt or a .json.
    const offenders: string[] = [];
    for (const f of files) {
      if (!/\.(html|txt|json|xml|webmanifest)$/.test(f)) continue;
      const text = readFileSync(join(PUBLIC, f), "utf8");
      // "worksFor" / "jobTitle" are the schema.org fields that publish a
      // CURRENT employer. Prose mentioning eSparkBiz as a past role is fine
      // and appears in llms.txt on purpose.
      for (const field of ["worksFor", "jobTitle"]) {
        if (text.includes(field)) {
          offenders.push(
            `public/${f} declares schema.org "${field}". Structured data about ` +
              `the current role belongs in app/layout.tsx, which renders it from lib/profile.ts.`
          );
        }
      }
    }
    expect(offenders).toEqual([]);
  });
});
