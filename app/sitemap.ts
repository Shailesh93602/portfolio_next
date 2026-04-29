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

  // Dynamic blog post routes from in-repo data
  const dynamicBlogRoutes: MetadataRoute.Sitemap = blogPosts.map((post) => ({
    url: `${SITE_URL}/blog/${post.slug}`,
    lastModified: post.lastModified
      ? new Date(post.lastModified)
      : new Date(post.date),
  }));

  // Dynamic portfolio project routes
  const dynamicPortfolioRoutes: MetadataRoute.Sitemap = projects.map(
    (project) => ({
      url: `${SITE_URL}/portfolio/${project.id}`,
      lastModified: new Date(),
    })
  );

  return [...staticRoutes, ...dynamicBlogRoutes, ...dynamicPortfolioRoutes];
}
