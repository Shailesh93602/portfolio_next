import type { IConfig } from "next-sitemap";

const config: IConfig = {
  siteUrl: "https://shaileshchaudhari.vercel.app",
  generateRobotsTxt: true,
  exclude: [],
  changefreq: "daily",
  priority: 0.7,
  sitemapSize: 5000,
  autoLastmod: true,
  transform: async (config, path) => {
    return {
      loc: path,
      changefreq: "weekly",
      priority: path === "/" ? 1 : 0.7,
      lastmod: new Date().toISOString(),
    };
  },
};

export default config;
