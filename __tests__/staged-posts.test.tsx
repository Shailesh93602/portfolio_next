import { existsSync, readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";
import matter from "gray-matter";
import { render } from "@testing-library/react";

import type * as BlogData from "@/lib/blog-data";
import Page, { generateMetadata } from "@/app/blog/[slug]/page";
import sitemap from "@/app/sitemap";
import { projects } from "@/constants/projects";
import { SITE_URL } from "@/lib/blog-constants";
import { stagedBatch, stagedSlugs } from "./helpers/staged-posts";

// Renders the batch as if published: the mocked module lists every batch post.
jest.mock("@/lib/blog-data", () => {
  const actual = jest.requireActual("@/lib/blog-data") as typeof BlogData;
  const { stagedSlugs: staged } = jest.requireActual("./helpers/staged-posts");
  const extra = (staged() as string[]).map((s) => actual.loadPost(s)!);
  const all = [...actual.blogPosts, ...extra];
  const published = all.filter((p) => !p.archived);
  return {
    ...actual,
    blogPosts: all,
    publishedPosts: published,
    getPostBySlug: (slug: string) => all.find((p) => p.slug === slug),
    getRelatedPosts: (slug: string, limit = 3) => {
      const post = all.find((p) => p.slug === slug);
      if (!post) return [];
      return published
        .filter(
          (p) => p.slug !== slug && p.tags.some((t) => post.tags.includes(t))
        )
        .slice(0, limit);
    },
  };
});

jest.mock("next/image", () => ({
  __esModule: true,
  default: ({ alt, src }: { alt: string; src: string }) => (
    // eslint-disable-next-line @next/next/no-img-element
    <img alt={alt} src={src} />
  ),
}));

beforeAll(() => {
  class NoopObserver {
    observe() {}
    unobserve() {}
    disconnect() {}
    takeRecords() {
      return [];
    }
  }
  Object.assign(window, { IntersectionObserver: NoopObserver });
});

const actual = jest.requireActual("@/lib/blog-data") as typeof BlogData;
const BLOG_DIR = join(process.cwd(), "content", "blog");
const batch = stagedBatch();
const slugs = batch.map((e) => e.slug);
const fm = (slug: string) =>
  matter(readFileSync(join(BLOG_DIR, `${slug}.mdx`), "utf8"));
const LLMS_FULL = readFileSync(
  join(process.cwd(), "public", "llms-full.txt"),
  "utf8"
);

describe("STAGED 2026-10 batch", () => {
  it("is the ten-post batch, each with a file", () => {
    expect(slugs).toHaveLength(10);
    expect(new Set(slugs).size).toBe(10);
    for (const s of slugs)
      expect(existsSync(join(BLOG_DIR, `${s}.mdx`))).toBe(true);
  });

  it("staged posts are not served: absent from BLOG_SLUGS", () => {
    for (const s of stagedSlugs()) expect(actual.BLOG_SLUGS).not.toContain(s);
  });

  it("the retired Redis Cluster draft is gone", () => {
    expect(readdirSync(BLOG_DIR)).not.toContain(
      "eduscale-redis-distributed-locks-real-time.mdx"
    );
  });

  describe.each(slugs)("%s", (slug) => {
    it("has valid frontmatter", () => {
      const { data, content } = fm(slug);
      expect(typeof data.title).toBe("string");
      expect(data.title.length).toBeGreaterThan(10);
      expect(data.title.length).toBeLessThanOrEqual(60);
      expect(data.description.length).toBeGreaterThan(50);
      expect(data.description.length).toBeLessThanOrEqual(155);
      expect(data.date).toMatch(/^\d{4}-\d{2}-\d{2}$/);
      expect(data.date > "2024-12-31").toBe(true);
      expect(data.readTime).toMatch(/^\d+ min read$/);
      expect(data.tags.length).toBeGreaterThan(0);
      expect(data.seoKeywords).toContain("Shailesh Chaudhari");
      expect(data.archived).toBeUndefined();
      expect(typeof data.llmsTopic).toBe("string");
      expect(content).not.toContain("TODO");
      expect(content).not.toMatch(/<h1\b/); // the layout renders the title as h1
    });

    it("parses through loadPost", () => {
      const post = actual.loadPost(slug);
      expect(post).not.toBeNull();
      expect(post!.title).toBe(fm(slug).data.title);
      expect(post!.content.length).toBeGreaterThan(2000);
      expect(post!.image).toMatch(/^\/api\/og\?/);
    });

    it("renders with BlogPosting JSON-LD once published", async () => {
      const el = await Page({ params: Promise.resolve({ slug }) });
      const { container } = render(el);
      expect(container.querySelector("h1")?.textContent).toBe(
        fm(slug).data.title
      );
      expect(container.querySelectorAll(".prose h2").length).toBeGreaterThan(2);
      const ld = Array.from(
        container.querySelectorAll('script[type="application/ld+json"]')
      ).map((s) => JSON.parse(s.textContent ?? "{}"));
      const article = ld.find((n) => n["@type"] === "BlogPosting");
      expect(article).toMatchObject({
        headline: fm(slug).data.title,
        url: `${SITE_URL}/blog/${slug}`,
        datePublished: fm(slug).data.date,
      });
      expect(article.wordCount).toBeGreaterThan(800);
    });

    it("has canonical, OG image and indexable metadata once published", async () => {
      const m = await generateMetadata({ params: Promise.resolve({ slug }) });
      expect(m.alternates?.canonical).toBe(`${SITE_URL}/blog/${slug}`);
      expect(m.robots).toBeUndefined();
      const og = m.openGraph as { type?: string; images?: { url: string }[] };
      expect(og.type).toBe("article");
      expect(og.images?.[0].url).toMatch(/^\/api\/og\?title=/);
    });

    it("is in the sitemap once published", async () => {
      const urls = (await sitemap()).map((e) => e.url);
      expect(urls).toContain(`${SITE_URL}/blog/${slug}`);
    });

    it("is in llms-full.txt exactly when published", () => {
      const topic = fm(slug).data.llmsTopic as string;
      const published = actual.BLOG_SLUGS.includes(slug);
      expect({ slug, inLlmsFull: LLMS_FULL.includes(topic) }).toEqual({
        slug,
        inLlmsFull: published,
      });
    });
  });
});

describe("internal links in posts resolve", () => {
  const staticPages = new Set(
    readdirSync(join(process.cwd(), "app"), { withFileTypes: true })
      .filter((d) => d.isDirectory())
      .filter((d) => existsSync(join(process.cwd(), "app", d.name, "page.tsx")))
      .map((d) => `/${d.name}`)
  );
  const projectIds = new Set(projects.map((p) => p.id));
  const hrefs = (slug: string) =>
    Array.from(fm(slug).content.matchAll(/href="(\/[^"#?]*)/g), (m) => m[1]);

  it.each([...actual.BLOG_SLUGS, ...stagedSlugs()])("%s", (slug) => {
    const isPublished = actual.BLOG_SLUGS.includes(slug);
    const broken: string[] = [];
    for (const href of hrefs(slug)) {
      const [, section, id] = href.split("/");
      if (section === "blog") {
        // A published post may only link published posts; a staged one may link the batch.
        const ok = isPublished
          ? actual.BLOG_SLUGS.includes(id)
          : actual.BLOG_SLUGS.includes(id) || slugs.includes(id);
        if (!ok) broken.push(`${href} (publish ${id} first or together)`);
      } else if (section === "portfolio" && id) {
        if (!projectIds.has(id)) broken.push(href);
      } else if (!staticPages.has(`/${section}`) && href !== "/") {
        broken.push(href);
      }
    }
    expect(broken).toEqual([]);
  });
});
