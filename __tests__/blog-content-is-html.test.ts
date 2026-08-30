import fs from "fs";
import path from "path";
import { BLOG_SLUGS } from "@/lib/blog-data";

/**
 * Blog bodies must be HTML, because that is what the renderer assumes.
 *
 * `lib/blog-data.ts` documents the contract — "content/blog/<slug>.mdx (HTML
 * body after frontmatter)" — and `app/blog/[slug]/page.tsx` injects it with
 * `dangerouslySetInnerHTML`. There is no markdown parser anywhere in the
 * project.
 *
 * Three posts were nonetheless authored in Markdown, so every visitor saw
 * literal `## Headings`, `**bold**` and `[text](https://…)` link syntax. They
 * were the three engineering write-ups the /engineering page and the resume
 * both point at as evidence of judgment, which is the worst possible three.
 *
 * Nothing caught it: the pages returned 200, the links were "present" as text,
 * the a11y audit passed because raw markdown is still readable text, and the
 * only reason it surfaced at all was that one raw URL was an unbreakable token
 * wide enough to make the page scroll sideways on a phone.
 *
 * This asserts the property directly, so the next markdown-authored post fails
 * here rather than shipping.
 */

const BLOG_DIR = path.join(process.cwd(), "content", "blog");

function body(slug: string): string {
  const raw = fs.readFileSync(path.join(BLOG_DIR, `${slug}.mdx`), "utf8");
  const parts = raw.split("---");
  return parts.length >= 3 ? parts.slice(2).join("---") : raw;
}

/**
 * Prose only — code blocks removed.
 *
 * Everything this test looks for is legitimate INSIDE a code sample: `#` is a
 * shell comment, `**` can be C or a glob, and a bare `- item` is a YAML list.
 * The first version of this test flagged four healthy posts for lines like
 * `# Start the development server` sitting in a bash snippet. A check that
 * cries wolf on correct content gets suppressed, and then it is not a check.
 */
function prose(slug: string): string {
  return body(slug)
    .replace(/<pre[\s\S]*?<\/pre>/g, "")
    .replace(/<code[\s\S]*?<\/code>/g, "");
}

describe("blog bodies are HTML, not markdown", () => {
  it("has posts to check", () => {
    // Load-bearing: an empty slug list would make every assertion below pass
    // by iterating nothing.
    expect(BLOG_SLUGS.length).toBeGreaterThan(5);
  });

  it.each(BLOG_SLUGS)("%s renders as HTML", (slug) => {
    // Positive: it must actually contain block-level HTML.
    expect(body(slug)).toMatch(/<(p|h2|h3|ul|ol|div|section|pre|blockquote)\b/);

    // Negative: markdown constructs that would render as literal text to a
    // reader. Checked against prose only — see prose() for why.
    const text = prose(slug);
    expect(text).not.toMatch(/(^|\n)#{1,4}\s+\S/);
    expect(text).not.toMatch(/\[[^\]\n]+\]\(https?:\/\/[^)\s]+\)/);
    expect(text).not.toMatch(/(^|\n)[-*]\s+\S.*\n[-*]\s+\S/);
  });

  it("no post contains a bare markdown bold run outside a code block", () => {
    // `**` inside <pre> is legitimate (it can be sample code), so strip those
    // first rather than exempting whole files.
    const offenders = BLOG_SLUGS.filter((slug) =>
      /\*\*\w[^*]*\*\*/.test(prose(slug))
    );
    expect(offenders).toEqual([]);
  });
});
