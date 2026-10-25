/**
 * Post bodies are HTML strings (content/blog/*.mdx carries HTML, injected
 * with dangerouslySetInnerHTML), so anything the markup needs at render time
 * has to be added here rather than in a component.
 *
 * `.blog-content pre` and `.blog-content table` scroll horizontally
 * (`overflow-x: auto` in globals.css) so a long code line scrolls inside its
 * box instead of dragging the whole page sideways on a phone. A region that
 * scrolls must also be reachable by keyboard, or the overflow is unreachable
 * without a mouse — WCAG 2.1.1, reported by axe as
 * `scrollable-region-focusable` (serious). The a11y job was red on every CI
 * run from 2026-08-30 for exactly this: at 390px the two sample posts that
 * contain code blocks overflowed, and nothing was focusable.
 *
 * `tabindex="0"` alone satisfies the rule and matches what GitHub and MDN do
 * for code blocks. No role is added: `role="region"` on a `<table>` would
 * strip its table semantics, and a landmark per code block is noise.
 */
export function makeScrollRegionsFocusable(html: string): string {
  return html.replace(
    /<(pre|table)\b([^>]*)>/gi,
    (match: string, tag: string, attrs: string) =>
      /\btabindex\s*=/i.test(attrs) ? match : `<${tag}${attrs} tabindex="0">`
  );
}

/**
 * Path literals inside code samples are not links, but crawlers treat them as
 * links. Search Console reported `/validation.pipe`, `/users/user.entity`,
 * `/dto/create-user.dto`, `/transform.interceptor`, `/health` and
 * `/login?error=invalid_request` as 404s: each is a string from a code sample
 * (`import { ValidationPipe } from './validation.pipe'`,
 * `res.redirect('/login?error=invalid_request')`). The post HTML also ships
 * inside the page's inline RSC payload as a JavaScript string, and Googlebot
 * pulls URL-shaped strings out of script.
 *
 * So inside `<pre>` and `<code>`, the slash that starts a quoted path
 * (`'/x`, `"./x`, `` `../x ``) is written as `&#x2F;`. The browser shows and
 * copies a plain `/`; the HTML and the payload no longer hold a path string.
 */
const CODE_BLOCK = /<(pre|code)\b[^>]*>[\s\S]*?<\/\1>/gi;
const QUOTED_PATH_START =
  /(['"`]|&quot;|&#0?39;|&#x27;|&apos;)(\.{1,2})?\/(?!\/)/gi;

export function escapeCodePathLiterals(html: string): string {
  return html.replace(CODE_BLOCK, (block) =>
    block.replace(QUOTED_PATH_START, "$1$2&#x2F;")
  );
}

/** Everything a post body needs before it is injected. */
export function renderPostHtml(html: string): string {
  return makeScrollRegionsFocusable(escapeCodePathLiterals(html));
}
