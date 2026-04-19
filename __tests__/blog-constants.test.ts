/**
 * Tests for lib/blog-constants.ts — sanity-checks exported constants so
 * mis-edits (missing fields, broken URLs) fail in CI rather than silently.
 */
import {
  BLOG_AUTHOR,
  SEO_KEYWORDS,
  SITE_URL,
  BLOG_CATEGORIES,
} from "@/lib/blog-constants";

describe("BLOG_AUTHOR", () => {
  it("is defined", () => {
    expect(BLOG_AUTHOR).toBeDefined();
  });

  it("has a non-empty name", () => {
    expect(typeof BLOG_AUTHOR.name).toBe("string");
    expect(BLOG_AUTHOR.name.length).toBeGreaterThan(0);
  });

  it("has a non-empty role", () => {
    expect(typeof BLOG_AUTHOR.role).toBe("string");
    expect(BLOG_AUTHOR.role.length).toBeGreaterThan(0);
  });

  it("has a non-empty bio", () => {
    expect(typeof BLOG_AUTHOR.bio).toBe("string");
    expect(BLOG_AUTHOR.bio.length).toBeGreaterThan(0);
  });

  it("has a valid avatar path", () => {
    expect(BLOG_AUTHOR.avatar).toMatch(/^\/Images\//);
  });

  it("has social links object with github entry", () => {
    expect(BLOG_AUTHOR.social).toBeDefined();
    expect(BLOG_AUTHOR.social.github).toMatch(/^https?:\/\//);
  });
});

describe("SEO_KEYWORDS", () => {
  it("is a non-empty array", () => {
    expect(Array.isArray(SEO_KEYWORDS)).toBe(true);
    expect(SEO_KEYWORDS.length).toBeGreaterThan(0);
  });

  it("contains the author's name", () => {
    expect(SEO_KEYWORDS).toContain("Shailesh Chaudhari");
  });

  it("all entries are non-empty strings", () => {
    SEO_KEYWORDS.forEach((kw) => {
      expect(typeof kw).toBe("string");
      expect(kw.length).toBeGreaterThan(0);
    });
  });
});

describe("SITE_URL", () => {
  it("is a valid HTTPS URL", () => {
    expect(SITE_URL).toMatch(/^https:\/\//);
  });

  it("does not have a trailing slash", () => {
    expect(SITE_URL).not.toMatch(/\/$/);
  });
});

describe("BLOG_CATEGORIES", () => {
  it("is a non-empty array", () => {
    expect(Array.isArray(BLOG_CATEGORIES)).toBe(true);
    expect(BLOG_CATEGORIES.length).toBeGreaterThan(0);
  });

  it("contains Web Development category", () => {
    expect(BLOG_CATEGORIES).toContain("Web Development");
  });
});
