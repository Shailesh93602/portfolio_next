import { MetadataRoute } from 'next';
import { blogPosts } from '@/lib/blog-data';

const BASE_URL = 'https://shaileshchaudhari.vercel.app';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // Static routes
  const staticRoutes: MetadataRoute.Sitemap = [
    { url: `${BASE_URL}/` , lastModified: new Date() },
    { url: `${BASE_URL}/blogs` , lastModified: new Date() },
    { url: `${BASE_URL}/about` , lastModified: new Date() },
    { url: `${BASE_URL}/contact` , lastModified: new Date() },
    { url: `${BASE_URL}/portfolio` , lastModified: new Date() },
    { url: `${BASE_URL}/statistics` , lastModified: new Date() },
  ];

  // Dynamic blog post routes from in-repo data
  const dynamicRoutes: MetadataRoute.Sitemap = blogPosts.map((post) => ({
    url: `${BASE_URL}/blog/${post.slug}`,
    lastModified: post.lastModified ? new Date(post.lastModified) : new Date(post.date),
  }));

  return [...staticRoutes, ...dynamicRoutes];
}
