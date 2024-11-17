/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: "https://shaileshchaudhari.vercel.app", // Your site's base URL
  generateRobotsTxt: true, // Automatically generate robots.txt
  exclude: [], // Include all pages
  changefreq: "daily", // Indicates content update frequency
  priority: 0.7, // Default priority of pages
  sitemapSize: 5000, // Split sitemap if there are more than 5000 URLs
  autoLastmod: true, // Automatically set `lastmod` for pages
  transform: async (config, path) => {
    // Customize each entry in the sitemap
    return {
      loc: path, // Page location
      changefreq: "weekly", // Page update frequency
      priority: path === "/" ? 1 : 0.7, // Prioritize homepage
      lastmod: new Date().toISOString(),
    };
  },
};
