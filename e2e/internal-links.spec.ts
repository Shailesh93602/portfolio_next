import { test, expect } from "@playwright/test";
import { ALL_ROUTES } from "./routes";
import { SITE_URL } from "../lib/blog-constants";

/**
 * Every internal path a crawler can pull out of what we serve must resolve.
 *
 * Search Console reported six 404s nobody linked to on purpose:
 * `/validation.pipe`, `/users/user.entity`, `/dto/create-user.dto`,
 * `/transform.interceptor`, `/health`, `/login?error=invalid_request`. Each was
 * a path string from a code sample (`from './validation.pipe'`). Googlebot
 * reads `href`/`src` AND URL-shaped strings in inline script, which is where
 * the post HTML also travels (the RSC payload). So this checks both: every
 * attribute link and every quoted path literal, resolved against the page
 * like a crawler would, must not answer 404 or 410.
 *
 * Runs over the documents (pages, feed, llms files), not the JS chunks.
 *
 * An absolute URL is ours only when it names the canonical origin
 * (SITE_URL); it is then checked as a path on the server under test. Any
 * other origin is skipped, localhost included: the Supabase post's sample
 * `'http://localhost:3000/auth/callback'` is a reader's dev server, not this
 * site, and matching it against the test server's own origin made the check
 * pass on a pinned port and fail on CI's :3000.
 */
const DOCUMENTS = [
  ...ALL_ROUTES,
  "/feed.xml",
  "/sitemap.xml",
  "/robots.txt",
  "/llms.txt",
  "/llms-full.txt",
];

const SITE = new URL(SITE_URL);
const ATTR = /\b(?:href|src|action|poster)\s*=\s*["']([^"'#]+)["']/gi;
// A quote (optionally backslash-escaped, as inside a JS string), an optional
// ./ or ../, a slash, then a path that starts with a word character (React's
// own inline markers such as "/$" and "/&" are not paths).
const QUOTED_PATH =
  /\\?["'`](\.{0,2}\/(?:[A-Za-z0-9_-][A-Za-z0-9_\-./?=&%~+:@]*)?)\\?["'`]/g;

// llms*.txt and robots.txt are Markdown/plain text: links there are
// `[text](/path)` or absolute URLs. A path in backticks is prose about some
// other service's route (`/metrics`), not a link on this site.
const MD_LINK = /\]\((\/[^)\s]*)\)/g;
// Stops at a backslash: inside the RSC payload a URL ends at an escaped
// quote (`\"`), and a trailing `\` would resolve as an extra `/`.
const ABSOLUTE = /https?:\/\/[^\s<>"'`)\]\\]+/g;

function candidates(body: string, page: URL, text: boolean): Set<string> {
  const out = new Set<string>();
  const add = (raw: string, base: URL) => {
    try {
      const u = new URL(raw.replace(/&amp;/g, "&"), base);
      if (u.origin !== base.origin) return;
      out.add(u.pathname + u.search);
    } catch {
      /* not a URL */
    }
  };
  for (const m of body.matchAll(ABSOLUTE)) add(m[0], SITE);
  if (text) {
    for (const m of body.matchAll(MD_LINK)) add(m[1], page);
    return out;
  }
  for (const m of body.matchAll(ATTR)) add(m[1], page);
  for (const m of body.matchAll(QUOTED_PATH)) add(m[1], page);
  return out;
}

test("no served document holds an internal path that 404s", async ({
  request,
  baseURL,
}) => {
  test.setTimeout(300_000);
  const base = baseURL ?? "http://localhost:3000";
  const foundOn = new Map<string, string>();

  for (const path of DOCUMENTS) {
    const res = await request.get(path);
    expect(res.status(), path).toBe(200);
    const text = path.endsWith(".txt");
    const page = new URL(path, base);
    for (const target of candidates(await res.text(), page, text)) {
      if (!foundOn.has(target)) foundOn.set(target, path);
    }
  }

  const dead: string[] = [];
  for (const [target, source] of foundOn) {
    const res = await request.get(target, { maxRedirects: 5 });
    if (res.status() === 404 || res.status() === 410) {
      dead.push(`${res.status()} ${target}  (from ${source})`);
    }
  }
  expect(dead, `checked ${foundOn.size} internal paths`).toEqual([]);
  expect(foundOn.size).toBeGreaterThan(50);
});

test("the de-featured Holdfast page is gone and nothing points at it", async ({
  request,
}) => {
  expect((await request.get("/portfolio/holdfast")).status()).toBe(404);
  expect(await (await request.get("/sitemap.xml")).text()).not.toContain(
    "/portfolio/holdfast"
  );
});
