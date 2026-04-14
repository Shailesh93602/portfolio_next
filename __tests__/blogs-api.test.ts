import { blogPosts } from "@/lib/blog-posts";

// Unit-test the filtering logic extracted from the API route
function filterPosts(
  posts: typeof blogPosts,
  { tag, search }: { tag?: string; search?: string }
) {
  let result = posts;
  if (tag) {
    result = result.filter((p) => p.tags.includes(tag));
  }
  if (search) {
    const q = search.toLowerCase();
    result = result.filter(
      (p) =>
        p.title.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q)
    );
  }
  return result;
}

describe("Blog post filtering logic", () => {
  it("returns all posts when no filters applied", () => {
    expect(filterPosts(blogPosts, {})).toHaveLength(blogPosts.length);
  });

  it("filters by tag (case-sensitive)", () => {
    const tag = blogPosts[0]?.tags[0];
    if (!tag) return;
    const result = filterPosts(blogPosts, { tag });
    expect(result.every((p) => p.tags.includes(tag))).toBe(true);
  });

  it("returns empty array for a tag that does not exist", () => {
    expect(filterPosts(blogPosts, { tag: "__nonexistent_tag__" })).toHaveLength(
      0
    );
  });

  it("filters by search term in title (case-insensitive)", () => {
    const firstTitle = blogPosts[0]?.title ?? "";
    const term = firstTitle.slice(0, 4).toUpperCase();
    const result = filterPosts(blogPosts, { search: term });
    expect(result.length).toBeGreaterThanOrEqual(1);
    result.forEach((p) =>
      expect(
        p.title.toLowerCase().includes(term.toLowerCase()) ||
          p.description.toLowerCase().includes(term.toLowerCase())
      ).toBe(true)
    );
  });

  it("filters by search term in description", () => {
    const firstDesc = blogPosts[0]?.description ?? "";
    const term = firstDesc.split(" ")[0];
    const result = filterPosts(blogPosts, { search: term });
    expect(result.length).toBeGreaterThanOrEqual(1);
  });

  it("returns empty array when search matches nothing", () => {
    expect(filterPosts(blogPosts, { search: "zzznomatchzzz" })).toHaveLength(0);
  });

  it("every post has required public fields", () => {
    blogPosts.forEach((p) => {
      expect(p.slug).toBeTruthy();
      expect(p.title).toBeTruthy();
      expect(p.description).toBeTruthy();
      expect(p.date).toBeTruthy();
      expect(Array.isArray(p.tags)).toBe(true);
    });
  });
});
