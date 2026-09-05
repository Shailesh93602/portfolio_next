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
