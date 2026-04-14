import fs from "node:fs";
import pathModule from "node:path";

const siteUrl = "https://shaileshchaudhari.vercel.app";

let blogManifest = null;
try {
  const manifestPath = pathModule.join(
    process.cwd(),
    "data",
    "blog-manifest.json"
  );
  if (fs.existsSync(manifestPath)) {
    const raw = fs.readFileSync(manifestPath, "utf8");
    blogManifest = JSON.parse(raw);
  }
} catch {
  // ignore and fall back to generic lastmod
}

// Per-route priority and changefreq — higher = crawled more often
const PAGE_CONFIG = {
  "/": { priority: 1, changefreq: "weekly" },
  "/about": { priority: 0.9, changefreq: "monthly" },
  "/portfolio": { priority: 0.9, changefreq: "weekly" },
  "/hire": { priority: 0.8, changefreq: "monthly" },
  "/blogs": { priority: 0.8, changefreq: "daily" },
  "/contact": { priority: 0.7, changefreq: "monthly" },
  "/statistics": { priority: 0.6, changefreq: "daily" },
};

const config = {
  siteUrl,
  generateRobotsTxt: true,
  generateIndexSitemap: true,
  exclude: ["/404", "/500"],
  robotsTxtOptions: {
    policies: [
      { userAgent: "*", allow: "/" },
      // Explicitly allow AI crawlers to access LLM content files
      { userAgent: "GPTBot", allow: ["/llms.txt", "/llms-full.txt"] },
      { userAgent: "Claude-Web", allow: ["/llms.txt", "/llms-full.txt"] },
      { userAgent: "PerplexityBot", allow: ["/llms.txt", "/llms-full.txt"] },
      { userAgent: "Googlebot-Extended", allow: ["/llms.txt", "/llms-full.txt"] },
    ],
    additionalSitemaps: [`${siteUrl}/sitemap.xml`],
  },
  transform: async (config, url) => {
    const defaultLastmod = new Date().toISOString();
    let lastmod = defaultLastmod;

    if (blogManifest && url.startsWith("/blog/")) {
      const slug = url.replace(/^\/blog\//, "").replace(/\/$/, "");
      const entry = blogManifest.find((e) => e.slug === slug);
      if (entry?.date) lastmod = new Date(entry.date).toISOString();
    }

    let defaultPriority = 0.6;
    if (url.startsWith("/blog/")) defaultPriority = 0.7;
    else if (url.startsWith("/portfolio/")) defaultPriority = 0.8;

    const pageConf = PAGE_CONFIG[url] ?? {
      priority: defaultPriority,
      changefreq: url.startsWith("/blog/") ? "monthly" : "weekly",
    };

    return {
      loc: url,
      changefreq: pageConf.changefreq,
      priority: pageConf.priority,
      lastmod,
    };
  },
};

export default config;
