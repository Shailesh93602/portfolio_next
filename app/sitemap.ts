import { MetadataRoute } from "next";
import { blogPosts } from "@/lib/blog-data";
import { projects } from "@/constants/projects";
import { SITE_URL } from "@/lib/blog-constants";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // Static routes
  const staticRoutes: MetadataRoute.Sitemap = [
    { url: `${SITE_URL}/`, lastModified: new Date() },
    { url: `${SITE_URL}/blogs`, lastModified: new Date() },
    { url: `${SITE_URL}/about`, lastModified: new Date() },
    { url: `${SITE_URL}/contact`, lastModified: new Date() },
    { url: `${SITE_URL}/portfolio`, lastModified: new Date() },
    { url: `${SITE_URL}/hire`, lastModified: new Date() },
    { url: `${SITE_URL}/statistics`, lastModified: new Date() },
  ];

  // Dynamic blog post routes — `images` is a Google Discover ranking signal
  // and surfaces hero images directly in the search index.
  const dynamicBlogRoutes: MetadataRoute.Sitemap = blogPosts.map((post) => ({
    url: `${SITE_URL}/blog/${post.slug}`,
    lastModified: post.lastModified
      ? new Date(post.lastModified)
      : new Date(post.date),
    changeFrequency: "monthly",
    priority: post.featured ? 0.8 : 0.6,
    images: post.image ? [`${SITE_URL}${post.image}`] : undefined,
  }));

  // Dynamic portfolio project routes — same image-annotation treatment.
  const dynamicPortfolioRoutes: MetadataRoute.Sitemap = projects.map(
    (project) => ({
      url: `${SITE_URL}/portfolio/${project.id}`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: project.isShowcase ? 0.8 : 0.6,
      images: project.image ? [`${SITE_URL}${project.image}`] : undefined,
    })
  );

  return [...staticRoutes, ...dynamicBlogRoutes, ...dynamicPortfolioRoutes];
}
