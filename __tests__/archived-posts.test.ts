/**
 * Archived posts: served, noindexed, out of the sitemap, crawlable.
 *
 * The 2024 batch was unlisted on 2026-09-03 but stayed in sitemap.xml with no
 * robots directive, so "Solving 700+ DSA Problems" kept ranking for his name
 * two days later. Three things have to hold together, and the third is the
 * one that is easy to get backwards:
 *
 *   1. The URL still returns 200 — inbound links keep working.
 *   2. The served HTML carries <meta name="robots" content="noindex, follow">,
 *      emitted by generateMetadata on the server (a client-side tag is read
 *      by nobody that matters).
 *   3. robots.txt does NOT disallow the post. A crawler that may not fetch a
 *      page never reads its noindex, so Disallow + noindex leaves the URL
 *      indexed forever. This is asserted with the same longest-match logic a
 *      crawler uses.
 *
 * e2e/meta-and-schema.spec.ts checks the same three against the built site.
 */
import { readFileSync } from "node:fs";
import { join } from "node:path";

import sitemap from "@/app/sitemap";
import { __testing } from "@/app/robots";
import { blogPosts, publishedPosts } from "@/lib/blog-data";
import { generateMetadata } from "@/app/blog/[slug]/page";

const archived = blogPosts.filter((p) => p.archived);
const meta = (slug: string) =>
  generateMetadata({ params: Promise.resolve({ slug }) });

describe("archived posts", () => {
  it("exist, so the assertions below are not vacuous", () => {
    expect(archived.length).toBeGreaterThan(10);
    expect(publishedPosts.length).toBeGreaterThan(3);
  });

  it("are absent from the sitemap while every published post is present", async () => {
    const paths = new Set(
      (await sitemap()).map((e) => new URL(e.url).pathname)
    );
    const leaked = archived
      .map((p) => `/blog/${p.slug}`)
      .filter((r) => paths.has(r));
    expect(leaked).toEqual([]);
    const missing = publishedPosts
      .map((p) => `/blog/${p.slug}`)
      .filter((r) => !paths.has(r));
    expect(missing).toEqual([]);
  });

  it("carry noindex, follow from the server-side generateMetadata", async () => {
    for (const p of archived) {
      const m = await meta(p.slug);
      expect(m.robots).toEqual({ index: false, follow: true });
      // Still a real page: canonical and description are intact.
      expect(m.alternates?.canonical).toContain(`/blog/${p.slug}`);
      expect(m.description).toBeTruthy();
    }
  });

  it("published posts carry no robots directive at all", async () => {
    for (const p of publishedPosts) {
      const m = await meta(p.slug);
      expect(m.robots).toBeUndefined();
    }
  });

  it("are NOT disallowed in robots.txt (Disallow would cancel the noindex)", () => {
    const { ALLOW, DISALLOW } = __testing;
    const longest = (list: readonly string[], path: string) =>
      list
        .filter((r) => path.startsWith(r))
        .reduce((best, r) => (r.length > best.length ? r : best), "");
    for (const p of archived) {
      const path = `/blog/${p.slug}`;
      const a = longest(ALLOW, path);
      const d = longest(DISALLOW, path);
      expect(a.length >= d.length).toBe(true);
    }
    // And nobody adds a /blog disallow "to be safe".
    expect(DISALLOW.some((d) => d.startsWith("/blog"))).toBe(false);
  });

  it("the page module is a server component, so the tag is in the HTML", () => {
    // `export const metadata` / generateMetadata in a "use client" file is
    // silently ignored — the tag would never ship and nothing would say so.
    const src = readFileSync(
      join(process.cwd(), "app", "blog", "[slug]", "page.tsx"),
      "utf8"
    );
    expect(src).not.toMatch(/^\s*["']use client["']/m);
    expect(src).toMatch(/export async function generateMetadata/);
  });
});
