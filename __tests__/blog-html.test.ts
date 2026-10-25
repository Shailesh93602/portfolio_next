import { readFileSync } from "node:fs";
import { join } from "node:path";
import {
  escapeCodePathLiterals,
  makeScrollRegionsFocusable,
  renderPostHtml,
} from "@/lib/blog-html";
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
    expect(src).toMatch(/__html:\s*renderPostHtml\(post\.content\)/);
  });

  // The client BlogLayout's props land in the RSC payload. Handing it the
  // whole post shipped the raw body a second time, outside this transform.
  it("is the only copy of the body the page ships", () => {
    const src = readFileSync(
      join(process.cwd(), "app", "blog", "[slug]", "page.tsx"),
      "utf8"
    );
    expect(src).not.toMatch(/<BlogLayout\s+post=\{post\}/);
    // One read for the word count, one for the render.
    expect(src.match(/post\.content/g)).toHaveLength(2);
  });
});

describe("escapeCodePathLiterals", () => {
  it("breaks quoted paths inside code so they are no longer path strings", () => {
    const html =
      "<pre><code>import { ValidationPipe } from './validation.pipe';\n" +
      'res.redirect("/login?error=invalid_request");\n' +
      "import x from `../users/user.entity`;</code></pre>";
    const out = escapeCodePathLiterals(html);
    expect(out).toContain("'.&#x2F;validation.pipe'");
    expect(out).toContain('"&#x2F;login?error=invalid_request"');
    expect(out).toContain("`..&#x2F;users/user.entity`");
    expect(out).not.toMatch(/['"`]\.{0,2}\//);
  });

  it("handles entity-encoded quotes and inline <code>", () => {
    expect(escapeCodePathLiterals("<code>&quot;/health&quot;</code>")).toBe(
      "<code>&quot;&#x2F;health&quot;</code>"
    );
    expect(escapeCodePathLiterals("<code>&#39;./a&#39;</code>")).toBe(
      "<code>&#39;.&#x2F;a&#39;</code>"
    );
  });

  it("leaves prose links, comments and division alone", () => {
    const html =
      '<p><a href="/about">about</a> "/not-code"</p>' +
      "<pre><code>// comment\nconst r = a / b; fetch('//cdn.example')</code></pre>";
    expect(escapeCodePathLiterals(html)).toBe(html);
  });

  it("no shipped post body keeps a quoted path inside a code sample", () => {
    const offenders = blogPosts.flatMap((post) =>
      Array.from(
        renderPostHtml(post.content).matchAll(
          /<(pre|code)\b[^>]*>[\s\S]*?<\/\1>/gi
        )
      )
        .filter((m) =>
          /(['"`]|&quot;|&#0?39;|&#x27;|&apos;)\.{0,2}\/(?!\/)/i.test(m[0])
        )
        .map(() => post.slug)
    );
    expect(offenders).toEqual([]);
  });
});
