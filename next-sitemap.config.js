import fs from 'fs';
import pathModule from 'path';

const siteUrl = "https://shaileshchaudhari.vercel.app";
let blogManifest = null;
try {
  const manifestPath = pathModule.join(process.cwd(), 'data', 'blog-manifest.json');
  if (fs.existsSync(manifestPath)) {
    const raw = fs.readFileSync(manifestPath, 'utf8');
    blogManifest = JSON.parse(raw);
  }
} catch (e) {
  // ignore and fall back to generic lastmod
}

const config = {
  siteUrl,
  generateRobotsTxt: true,
  // Let next-sitemap read the Next.js build manifest and include static pages
  // (including pages created by `generateStaticParams`) automatically.
  generateIndexSitemap: true,
  exclude: [],
  changefreq: "daily",
  priority: 0.7,
  autoLastmod: true,
  transform: async (config, url) => {
    const defaultLastmod = new Date().toISOString();
    let lastmod = defaultLastmod;

    // Use blog manifest dates when available for /blog/* pages
    if (blogManifest && url.startsWith('/blog/')) {
      const slug = url.replace(/^\/blog\//, '').replace(/\/$/, '');
      const entry = blogManifest.find((e) => e.slug === slug);
      if (entry && entry.date) lastmod = entry.date;
    }

    return {
      loc: url,
      changefreq: "weekly",
      priority: url === "/" ? 1 : 0.7,
      lastmod,
    };
  },
};

export default config;
