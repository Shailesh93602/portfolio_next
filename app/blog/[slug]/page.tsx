import { Metadata } from "next";
import { notFound } from "next/navigation";
import { BlogLayout } from "@/components/blog/blog-layout";
import { ArrowLeftIcon } from "@/components/icons";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { getPostBySlug, getRelatedPosts, blogPosts } from "@/lib/blog-data";
import { SITE_URL, META_DEFAULTS } from "@/lib/blog-constants";
import { ReadingProgressBar } from "@/components/ReadingProgressBar";

const getPostData = (slug: string) => {
  const post = getPostBySlug(slug);
  if (!post) return null;

  const relatedPosts = getRelatedPosts(slug, 3).map(({ slug, title }) => ({
    slug,
    title,
  }));

  return {
    ...post,
    relatedPosts,
  };
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const slug = (await params)?.slug;
  const post = await getPostData(slug);
  if (!post) return {};

  const title = `${post.title} | Shailesh Chaudhari's Blog`;
  const description = `${post.description} Written by Shailesh Chaudhari, Full-Stack Developer and Software Engineer.`;

  return {
    title,
    description,
    keywords: [
      ...post.tags,
      "Shailesh Chaudhari",
      "Shaileshbhai",
      "Full Stack Developer",
      "Software Engineer",
    ],
    authors: [{ name: "Shailesh Chaudhari" }],
    openGraph: {
      title,
      description,
      type: "article",
      publishedTime: post.date,
      authors: ["Shailesh Chaudhari"],
      tags: post.tags,
      images: [
        {
          url: `/api/og?title=${encodeURIComponent(post.title)}&type=blog`,
          width: 1200,
          height: 630,
          alt: post.title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      creator: META_DEFAULTS.twitterHandle,
      site: META_DEFAULTS.twitterHandle,
      images: [post.image],
    },
    alternates: {
      canonical: `${SITE_URL}/blog/${slug}`,
    },
  };
}

interface Props {
  params: Promise<{ slug: string }>;
}

export default async function Page({ params }: Props) {
  const slug = (await params)?.slug;
  const post = await getPostData(slug);

  if (!post) {
    notFound();
  }

  // Strip HTML for word-count — Google uses wordCount + timeRequired as
  // ranking signals for in-depth articles, and AI summarizers use them to
  // decide how much of the post to quote.
  const plain = post.content.replaceAll(/<[^>]+>/g, " ").replaceAll(/\s+/g, " ").trim();
  const wordCount = plain ? plain.split(" ").length : 0;
  // ISO 8601 duration — readTime in frontmatter is "16 min read"; extract digits.
  const readMin = Number.parseInt(post.readTime?.match(/\d+/)?.[0] || "5", 10);
  const articleSection = post.tags?.[0] || "Software Engineering";

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    "@id": `${SITE_URL}/blog/${slug}#article`,
    mainEntityOfPage: { "@type": "WebPage", "@id": `${SITE_URL}/blog/${slug}` },
    headline: post.title,
    description: post.description,
    author: { "@id": `${SITE_URL}/#person` },
    datePublished: post.date,
    dateModified: post.lastModified || post.date,
    image: `${SITE_URL}${post.image}`,
    keywords: [...post.tags, "Shailesh Chaudhari", "Full Stack Development"],
    publisher: { "@id": `${SITE_URL}/#person` },
    inLanguage: "en-US",
    wordCount,
    timeRequired: `PT${readMin}M`,
    articleSection,
    url: `${SITE_URL}/blog/${slug}`,
    isAccessibleForFree: true,
  };

  // BreadcrumbList — Google uses this for the search result breadcrumb trail.
  const breadcrumbLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: SITE_URL },
      {
        "@type": "ListItem",
        position: 2,
        name: "Blog",
        item: `${SITE_URL}/blogs`,
      },
      {
        "@type": "ListItem",
        position: 3,
        name: post.title,
        item: `${SITE_URL}/blog/${slug}`,
      },
    ],
  };

  return (
    <>
      <ReadingProgressBar />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }}
      />

      <div className="min-h-screen">
        <div className="container mx-auto px-4 py-8">
          <Link href="/blogs" className="mb-8 inline-block">
            <Button variant="ghost" className="group">
              <ArrowLeftIcon className="mr-2 h-4 w-4 transition-transform group-hover:-translate-x-1" />
              Back to Blogs
            </Button>
          </Link>
        </div>

        <BlogLayout post={post}>
          <div
            className="prose prose-invert prose-lg max-w-none"
            dangerouslySetInnerHTML={{ __html: post.content }}
          />
        </BlogLayout>
      </div>
    </>
  );
}

export function generateStaticParams() {
  return blogPosts.map((post) => ({
    slug: post.slug,
  }));
}
