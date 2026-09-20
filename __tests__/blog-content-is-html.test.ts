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

/**
 * `matchAll` with `for…of` does not compile under this project's ES5 target
 * (TS2802). An exec loop is the portable form; the `g` flag is required and
 * asserted so a caller cannot silently produce an infinite loop.
 */
function allMatches(re: RegExp, text: string): RegExpExecArray[] {
  if (!re.global) throw new Error(`allMatches needs a /g regex: ${re}`);
  const out: RegExpExecArray[] = [];
  re.lastIndex = 0;
  let m: RegExpExecArray | null;
  while ((m = re.exec(text)) !== null) {
    out.push(m);
    if (m[0] === "") re.lastIndex += 1;
  }
  return out;
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

  /**
   * The mirror image of the markdown problem, and it cost more.
   *
   * These files end in `.mdx`, so Prettier parses them as MDX/JSX — and on
   * 2026-04 (#18) it "fixed 26 files that had drifted", inserting 42 `{" "}`
   * JSX whitespace expressions as line-wrap separators across the three
   * flagship engineering posts.
   *
   * In real MDX that expression evaluates to a space. Here nothing evaluates
   * it: `lib/blog-data.ts` hands the body straight to `dangerouslySetInnerHTML`
   * and there is no MDX compiler in the project. So all 42 shipped as six
   * literal characters mid-sentence, live, for months:
   *
   *   "…lets the server run the operation{" "} at most once…"
   *
   * The root cause is fixed in `.prettierignore` (content/blog/ is excluded —
   * removing the tokens by hand does not work, `prettier --write .` puts every
   * one of them back). This asserts the symptom as well, because the next
   * tool that decides these are JSX will not be Prettier.
   */
  it("no post contains a JSX expression, which nothing here evaluates", () => {
    const offenders: string[] = [];
    for (const slug of BLOG_SLUGS) {
      // prose(), not body(): `import { Repository } from …` inside a <pre> is
      // ordinary sample code, and the first version of this assertion flagged
      // 30 of them across the tutorial posts. Same lesson as prose() itself.
      for (const m of allMatches(
        /\{\s*(["'][^"']*["']|\w+)\s*\}/g,
        prose(slug)
      )) {
        offenders.push(`${slug}: ${m[0]} at offset ${m.index}`);
      }
    }
    expect(offenders).toEqual([]);
  });

  /**
   * `<pre>` preserves whitespace, so reflowing its contents is not cosmetic.
   * The same Prettier run turned
   *
   *   // DON'T do this — it has a race
   *   const seen = await store.get(key);
   *
   * into one wrapped line beginning with `//`, which comments the rest out.
   * A reader who copies that sample gets a no-op. Two other samples lost the
   * newline before a trailing `#` shell comment the same way.
   *
   * The tell is structural and cheap to assert: a healthy block in these files
   * opens `<pre><code`, on one line. `<pre>` alone on a line is the reflowed
   * shape.
   */
  it("no code block has been reflowed by a formatter", () => {
    const offenders: string[] = [];
    for (const slug of BLOG_SLUGS) {
      for (const m of allMatches(/<pre\b[^>]*>(\s*)<code/g, body(slug))) {
        if (m[1].includes("\n")) {
          offenders.push(
            `${slug}: <pre> and <code> are on separate lines at offset ${m.index} — ` +
              `the block's newlines were reflowed away. Restore it as <pre><code>…`
          );
        }
      }
    }
    expect(offenders).toEqual([]);
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
