import { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/blog-constants";

/**
 * /api/og is ALLOWED even though the rest of /api/ is not.
 *
 * app/sitemap.ts annotates most routes with an `images` entry pointing at
 * `${SITE_URL}/api/og?...` — the per-route Open Graph render. A blanket
 * `Disallow: /api/` would forbid fetching exactly those URLs, so the sitemap
 * would advertise images the crawler is not allowed to load: the two files
 * contradicting each other, which is worse than either rule alone. Image
 * indexing and Discover eligibility both depend on the fetch succeeding.
 *
 * robots.txt resolves conflicts by longest match, not by order, so the more
 * specific Allow wins over the broader Disallow in every major crawler.
 * robots.test.ts asserts the two files agree by checking every image URL the
 * sitemap emits against these rules.
 */
const ALLOW = ["/", "/api/og"];

/**
 * /api/contact and /api/statistics are POST/JSON endpoints with no rendered
 * content — nothing to index, and crawling them is wasted budget at best.
 */
const DISALLOW = ["/api/"];

/**
 * AI crawlers, named explicitly in two groups.
 *
 * robots.txt group matching is winner-take-all: a bot obeys only the most
 * specific group matching its user-agent and ignores every other group,
 * INCLUDING `*`. So a named group listing `allow: "/"` with no disallows hands
 * that bot the whole site — the way a robots.txt "tightening" quietly loosens
 * things. Each group below therefore repeats the full rule set.
 *
 * Both groups are allowed, and for this site that is the deliberate call rather
 * than a default: it is a portfolio whose entire purpose is to be found and
 * cited when someone asks about Shailesh Chaudhari's work. Blocking training
 * crawlers here would forfeit exactly the outcome the site exists for.
 */
const RETRIEVAL_BOTS = [
  "OAI-SearchBot",
  "ChatGPT-User",
  "Claude-SearchBot",
  "Claude-User",
  "PerplexityBot",
  "Perplexity-User",
  "Google-Extended",
];

const TRAINING_BOTS = ["GPTBot", "ClaudeBot", "CCBot", "Applebot-Extended"];

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      { userAgent: "*", allow: ALLOW, disallow: DISALLOW },
      { userAgent: RETRIEVAL_BOTS, allow: ALLOW, disallow: DISALLOW },
      { userAgent: TRAINING_BOTS, allow: ALLOW, disallow: DISALLOW },
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  };
}

export const __testing = { ALLOW, DISALLOW, RETRIEVAL_BOTS, TRAINING_BOTS };
