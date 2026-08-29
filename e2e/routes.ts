import { projects } from "../constants/projects";
import { BLOG_SLUGS } from "../lib/blog-data";

/**
 * Single source of truth for "every route a visitor can land on".
 *
 * Derived from the same data the app renders from, so adding a project or a
 * blog post automatically widens the asset / a11y / SEO gates instead of
 * silently shipping an unchecked page.
 */

/** Routes that render their own page (redirects live in REDIRECT_ROUTES). */
export const STATIC_ROUTES = [
  "/",
  "/about",
  "/portfolio",
  "/blogs",
  "/contact",
  "/services",
  "/engineering",
  "/now",
  "/statistics",
] as const;

/** `/portfolio/<id>` for every project in the portfolio data. */
export const PROJECT_ROUTES = projects.map((p) => `/portfolio/${p.id}`);

/** `/blog/<slug>` for every published post. */
export const BLOG_ROUTES = BLOG_SLUGS.map((slug) => `/blog/${slug}`);

/** Legacy/guessable URLs that must permanently redirect, not 404. */
export const REDIRECT_ROUTES: { from: string; to: string }[] = [
  { from: "/blog", to: "/blogs" },
  { from: "/hire", to: "/services" },
  { from: "/hire-me", to: "/services" },
];

export const ALL_ROUTES: string[] = [
  ...STATIC_ROUTES,
  ...PROJECT_ROUTES,
  ...BLOG_ROUTES,
];

/**
 * A smaller cross-section used by the slower per-page browser sweeps:
 * every static page, every project detail page (these carry the most
 * imagery), and three blog posts covering the oldest / newest / longest
 * content shapes.
 */
export const IMAGE_HEAVY_ROUTES: string[] = [
  ...STATIC_ROUTES,
  ...PROJECT_ROUTES,
  "/blog/building-inventory-engine-never-oversells-concurrency",
  "/blog/introduction-to-nestjs-for-backend-development",
  "/blog/solving-700-dsa-problems",
];
