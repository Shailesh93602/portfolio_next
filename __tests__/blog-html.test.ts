import { readFileSync } from "node:fs";
import { join } from "node:path";
import { makeScrollRegionsFocusable } from "@/lib/blog-html";
import { blogPosts } from "@/lib/blog-data";

describe("makeScrollRegionsFocusable", () => {
  it("makes <pre> keyboard-reachable, attributes preserved", () => {
    expect(makeScrollRegionsFocusable("<pre><code>x</code></pre>")).toBe(
      '<pre tabindex="0"><code>x</code></pre>'
    );
    expect(
      makeScrollRegionsFocusable('<pre class="language-ts" data-x="1">y</pre>')
    ).toBe('<pre class="language-ts" data-x="1" tabindex="0">y</pre>');
  });

  it("makes <table> keyboard-reachable without changing its role", () => {
    const out = makeScrollRegionsFocusable(
      "<table><tr><td>1</td></tr></table>"
    );
    expect(out).toBe('<table tabindex="0"><tr><td>1</td></tr></table>');
    expect(out).not.toContain("role=");
  });

  it("leaves an explicit tabindex alone", () => {
    const html = '<pre tabindex="-1">x</pre><table TabIndex="0"></table>';
    expect(makeScrollRegionsFocusable(html)).toBe(html);
  });

  it("does not touch tags that merely start with the same letters", () => {
    const html = "<p>pre</p><preview>x</preview><tablet>y</tablet>";
    expect(makeScrollRegionsFocusable(html)).toBe(html);
  });

  it("every shipped post ends up with no unfocusable scroll region", () => {
    const offenders = blogPosts
      .filter((post) =>
        /<(pre|table)\b(?![^>]*\btabindex=)/i.test(
          makeScrollRegionsFocusable(post.content)
        )
      )
      .map((post) => post.slug);
    expect(offenders).toEqual([]);
  });

  /**
   * A helper that exists but is not on the render path fixes nothing — the
   * a11y sweep only sees what the page actually injects. This pins the call
   * site, the same way the repo's other disk-reading contract tests do.
   */
  it("is what the blog page injects", () => {
    const src = readFileSync(
      join(process.cwd(), "app", "blog", "[slug]", "page.tsx"),
      "utf8"
    );
    expect(src).toMatch(
      /__html:\s*makeScrollRegionsFocusable\(post\.content\)/
    );
  });
});
