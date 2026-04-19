export { metadata } from "./metadata";
import BlogsContent from "./BlogsContent";
import { SITE_URL, BLOG_AUTHOR } from "@/lib/blog-constants";
import { blogPosts, getAllTags } from "@/lib/blog-data";

const blogListSchema = {
  "@context": "https://schema.org",
  "@type": "Blog",
  "@id": `${SITE_URL}/blogs`,
  url: `${SITE_URL}/blogs`,
  name: `${BLOG_AUTHOR.name}'s Blog`,
  description:
    "Technical articles on web development, full-stack engineering, and software career by Shailesh Chaudhari.",
  author: { "@id": `${SITE_URL}/#person` },
  breadcrumb: {
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: SITE_URL },
      {
        "@type": "ListItem",
        position: 2,
        name: "Blog",
        item: `${SITE_URL}/blogs`,
      },
    ],
  },
  blogPost: blogPosts.slice(0, 10).map((p) => ({
    "@type": "BlogPosting",
    headline: p.title,
    description: p.description,
    url: `${SITE_URL}/blog/${p.slug}`,
    datePublished: p.date,
    author: { "@id": `${SITE_URL}/#person` },
    keywords: p.tags.join(", "),
  })),
};

export default function BlogPage() {
  const allTags = getAllTags();
  const posts = [...blogPosts];

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(blogListSchema) }}
      />
      {/*
        SEO-only index of every post. Rendered server-side so crawlers (and
        recruiters) see every title + link even when the client-side filter
        view only paginates a subset. Visually hidden with sr-only.
      */}
      <nav aria-label="All blog posts" className="sr-only">
        <h2>All blog posts</h2>
        <ul>
          {posts.map((p) => (
            <li key={p.slug}>
              <a href={`/blog/${p.slug}`}>{p.title}</a>
              <time dateTime={p.date}>{p.date}</time>
              <p>{p.description}</p>
            </li>
          ))}
        </ul>
      </nav>
      <BlogsContent posts={posts} allTags={allTags} />
    </>
  );
}
