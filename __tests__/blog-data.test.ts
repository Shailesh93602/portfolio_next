/**
 * Tests for lib/blog-data.ts — covers BLOG_SLUGS, blogPosts array,
 * and all exported helper functions.
 * Uses real MDX files on disk (no fs mock needed).
 */

import {
  BLOG_SLUGS,
  blogPosts,
  getPostBySlug,
  getRelatedPosts,
  getFeaturedPosts,
  getAllTags,
  getPostsByTag,
} from "@/lib/blog-data";

describe("BLOG_SLUGS", () => {
  it("is an array of strings", () => {
    expect(Array.isArray(BLOG_SLUGS)).toBe(true);
  });

  it("has 17 entries", () => {
    expect(BLOG_SLUGS).toHaveLength(17);
  });

  it("contains only non-empty strings", () => {
    BLOG_SLUGS.forEach((slug) => {
      expect(typeof slug).toBe("string");
      expect(slug.length).toBeGreaterThan(0);
    });
  });

  it("has no duplicate slugs", () => {
    const unique = new Set(BLOG_SLUGS);
    expect(unique.size).toBe(BLOG_SLUGS.length);
  });
});

describe("blogPosts", () => {
  it("has the same length as BLOG_SLUGS", () => {
    expect(blogPosts.length).toBe(BLOG_SLUGS.length);
  });

  it("contains no null/undefined entries", () => {
    blogPosts.forEach((post) => {
      expect(post).not.toBeNull();
      expect(post).not.toBeUndefined();
    });
  });

  it("each post has required string fields", () => {
    blogPosts.forEach((post) => {
      expect(typeof post.slug).toBe("string");
      expect(post.slug.length).toBeGreaterThan(0);
      expect(typeof post.title).toBe("string");
      expect(post.title.length).toBeGreaterThan(0);
      expect(typeof post.description).toBe("string");
      expect(post.description.length).toBeGreaterThan(0);
    });
  });

  it("each post has a date matching YYYY-MM-DD", () => {
    blogPosts.forEach((post) => {
      expect(post.date).toMatch(/^\d{4}-\d{2}-\d{2}$/);
    });
  });

  it("each post has a tags array", () => {
    blogPosts.forEach((post) => {
      expect(Array.isArray(post.tags)).toBe(true);
    });
  });
});

describe("getPostBySlug", () => {
  it("returns a post whose slug matches the argument", () => {
    const slug = BLOG_SLUGS[0];
    const post = getPostBySlug(slug);
    expect(post).toBeDefined();
    expect(post!.slug).toBe(slug);
  });

  it("returns undefined for an unknown slug", () => {
    expect(getPostBySlug("totally-unknown-slug-xyz")).toBeUndefined();
  });

  it("returns the correct post for the last slug too", () => {
    const slug = BLOG_SLUGS[BLOG_SLUGS.length - 1];
    const post = getPostBySlug(slug);
    expect(post).toBeDefined();
    expect(post!.slug).toBe(slug);
  });
});

describe("getFeaturedPosts", () => {
  it("returns an array", () => {
    expect(Array.isArray(getFeaturedPosts())).toBe(true);
  });

  it("returns only posts with featured === true", () => {
    const featured = getFeaturedPosts();
    featured.forEach((post) => {
      expect(post.featured).toBe(true);
    });
  });

  it("is a subset of blogPosts", () => {
    const featured = getFeaturedPosts();
    const slugs = new Set(blogPosts.map((p) => p.slug));
    featured.forEach((post) => {
      expect(slugs.has(post.slug)).toBe(true);
    });
  });
});

describe("getAllTags", () => {
  it("returns a non-empty array", () => {
    const tags = getAllTags();
    expect(tags.length).toBeGreaterThan(0);
  });

  it("contains only strings", () => {
    getAllTags().forEach((tag) => {
      expect(typeof tag).toBe("string");
    });
  });

  it("has no duplicate tags", () => {
    const tags = getAllTags();
    const unique = new Set(tags);
    expect(unique.size).toBe(tags.length);
  });
});

describe("getRelatedPosts", () => {
  it("returns at most 3 posts by default", () => {
    const related = getRelatedPosts(BLOG_SLUGS[0]);
    expect(related.length).toBeLessThanOrEqual(3);
  });

  it("respects a custom limit", () => {
    const related = getRelatedPosts(BLOG_SLUGS[0], 2);
    expect(related.length).toBeLessThanOrEqual(2);
  });

  it("does not include the source post itself", () => {
    const slug = BLOG_SLUGS[0];
    const related = getRelatedPosts(slug);
    related.forEach((post) => {
      expect(post.slug).not.toBe(slug);
    });
  });

  it("returns an empty array for an unknown slug", () => {
    expect(getRelatedPosts("nonexistent-slug-abc")).toHaveLength(0);
  });
});

describe("getPostsByTag", () => {
  it("returns only posts that include the given tag", () => {
    const tags = getAllTags();
    if (tags.length === 0) return;
    const tag = tags[0];
    const posts = getPostsByTag(tag);
    expect(posts.length).toBeGreaterThanOrEqual(1);
    posts.forEach((post) => {
      expect(post.tags).toContain(tag);
    });
  });

  it("returns an empty array for a nonexistent tag", () => {
    expect(getPostsByTag("__no_such_tag__")).toHaveLength(0);
  });
});
