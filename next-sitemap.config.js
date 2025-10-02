const config = {
  siteUrl: "https://shaileshchaudhari.vercel.app",
  generateRobotsTxt: true,
  generateIndexSitemap: false,
  exclude: [],
  changefreq: "daily",
  priority: 0.7,
  autoLastmod: true,
  additionalPaths: async () => {
    const blogSlugs = [
      "solving-700-dsa-problems",
      "first-year-software-engineer-lessons",
      "internship-to-engineer-journey",
      "how-team-collaboration-made-me-better-developer",
      "building-portfolio-website-nextjs-tailwindcss",
      "challenges-junior-developer-overcame",
      "importance-code-reviews-learning-senior-mrs",
      "transitioning-learning-to-real-world-applications",
    ];

    return blogSlugs.map((slug) => ({
      loc: `/blog/${slug}`,
      changefreq: "monthly",
      priority: 0.8,
      lastmod: new Date().toISOString(),
    }));
  },
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
