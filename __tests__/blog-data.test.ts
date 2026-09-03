/**
 * Tests for lib/blog-data.ts — covers BLOG_SLUGS, blogPosts array,
 * and all exported helper functions.
 * Uses real MDX files on disk (no fs mock needed).
 */

import { existsSync, readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";

import {
  BLOG_SLUGS,
  blogPosts,
  publishedPosts,
  getPostBySlug,
  getRelatedPosts,
  getFeaturedPosts,
  getAllTags,
  getPostsByTag,
} from "@/lib/blog-data";

const BLOG_DIR = join(process.cwd(), "content", "blog");

/**
 * The archive boundary. Seventeen posts dated 2024-09-28 → 2024-10-09 were
 * written for search traffic; they stay online (URLs keep returning 200, they
 * stay in the sitemap) but are not surfaced anywhere the site chooses what to
 * show. Anything dated on or before this is expected to be archived, and
 * anything after it is expected not to be.
 */
const ARCHIVE_CUTOFF = "2024-12-31";

describe("archived posts", () => {
  it("every 2024 post is archived, and no later post is", () => {
    const wrong = blogPosts
      .filter((p) => p.date <= ARCHIVE_CUTOFF !== p.archived)
      .map((p) => `${p.slug} (${p.date}, archived=${p.archived})`);
    expect(wrong).toEqual([]);
  });

  it("archives the 2024 batch, which is a known size", () => {
    expect(blogPosts.filter((p) => p.archived)).toHaveLength(17);
  });

  it("archived posts still load by slug (their URLs must keep working)", () => {
    for (const p of blogPosts.filter((p) => p.archived)) {
      expect(getPostBySlug(p.slug)).toBeDefined();
    }
  });

  it("publishedPosts excludes every archived post and nothing else", () => {
    expect(publishedPosts.every((p) => !p.archived)).toBe(true);
    expect(publishedPosts.length + 17).toBe(blogPosts.length);
  });

  it("featured, tags, by-tag and related never surface an archived post", () => {
    expect(getFeaturedPosts().some((p) => p.archived)).toBe(false);
    for (const tag of getAllTags()) {
      expect(getPostsByTag(tag).some((p) => p.archived)).toBe(false);
    }
    for (const p of blogPosts) {
      expect(getRelatedPosts(p.slug).some((r) => r.archived)).toBe(false);
    }
  });

  it("still leaves the blog with something to show", () => {
    expect(publishedPosts.length).toBeGreaterThanOrEqual(5);
    expect(getFeaturedPosts().length).toBeGreaterThanOrEqual(3);
  });
});

describe("BLOG_SLUGS", () => {
  it("is an array of strings", () => {
    expect(Array.isArray(BLOG_SLUGS)).toBe(true);
  });

  // Was `toHaveLength(20)`. A hardcoded count fails every time a post is added
  // and passes for every bug that matters — it cannot tell a missing post from
  // a miscounted one. Replaced with the correspondence that actually breaks
  // things: a slug without a file is a 404, and a file without a slug is a post
  // that silently never appears on the site.
  it("has an MDX file for every slug", () => {
    const missing = BLOG_SLUGS.filter(
      (slug) => !existsSync(join(BLOG_DIR, `${slug}.mdx`))
    );
    expect(missing).toEqual([]);
  });

  // An MDX file missing from BLOG_SLUGS is invisible on the site. That is
  // sometimes deliberate — there are unfinished drafts here, each still full of
  // literal TODO markers — and sometimes it is a finished post someone forgot
  // to list, which nobody would ever notice, because the symptom is the absence
  // of something.
  //
  // So the assertion is not "no orphans". It is that every orphan is visibly
  // UNFINISHED. A draft riddled with TODOs explains its own absence; one
  // without them is a finished post nobody can read.
  it("every unpublished MDX file is a visibly unfinished draft", () => {
    const onDisk = readdirSync(BLOG_DIR)
      .filter((f) => f.endsWith(".mdx"))
      .map((f) => f.replace(/\.mdx$/, ""));

    const finishedButUnpublished = onDisk
      .filter((slug) => !BLOG_SLUGS.includes(slug))
      .filter((slug) => {
        const body = readFileSync(join(BLOG_DIR, `${slug}.mdx`), "utf8");
        return !body.includes("TODO");
      });

    expect(finishedButUnpublished).toEqual([]);
  });

  // The complementary direction, which the assertion above does NOT cover.
  //
  // That one catches a finished post nobody can read — an absence, and the
  // less costly of the two. This catches the opposite and worse case: a post
  // that IS published while still carrying literal TODO markers, which a
  // visitor reads as unfinished work shipped by someone who did not check.
  //
  // Three drafts sit in this directory right now with 9, 13 and 18 TODOs. All
  // three are correctly unlisted. Publishing one is a single line in
  // BLOG_SLUGS, and nothing else would have stopped it.
  it("no published post still contains TODO markers", () => {
    const unfinishedButPublished = BLOG_SLUGS.filter((slug) => {
      const path = join(BLOG_DIR, `${slug}.mdx`);
      if (!existsSync(path)) return false; // a separate assertion's job
      return readFileSync(path, "utf8").includes("TODO");
    });

    expect(unfinishedButPublished).toEqual([]);
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
