import { SITE_URL } from "@/lib/blog-constants";
import { getPostBySlug } from "@/lib/blog-data";
import { BlogLayout } from "@/components/blog/blog-layout";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { Metadata } from "next";
import { notFound } from "next/navigation";

const POST_SLUG = "internship-to-engineer-journey";

export async function generateMetadata(): Promise<Metadata> {
  const post = getPostBySlug(POST_SLUG);
  if (!post) return {};
  
  const title = `${post.title} | Shailesh Chaudhari's Blog`;
  const description = `${post.description} Written by Shailesh Chaudhari, Full-Stack Developer and Software Engineer.`;

  return {
    title,
    description,
    keywords: post.seoKeywords,
    authors: [{ name: "Shailesh Chaudhari" }],
    openGraph: {
      title,
      description,
      type: "article",
      publishedTime: post.date,
      authors: ["Shailesh Chaudhari"],
      tags: post.tags,
      images: [`${SITE_URL}${post.image}`],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      creator: "@shailesh93602",
      images: [`${SITE_URL}${post.image}`],
    },
  };
}

export default function BlogPost() {
  const blogPost = getPostBySlug(POST_SLUG);
  
  if (!blogPost) {
    notFound();
  }

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    "headline": blogPost.title,
    "description": blogPost.description,
    "author": {
      "@type": "Person",
      "name": "Shailesh Chaudhari",
      "alternateName": ["Shaileshbhai", "Shaileshbhai Chaudhari", "Shailesh"],
      "url": SITE_URL
    },
    "datePublished": blogPost.date,
    "image": `${SITE_URL}${blogPost.image}`,
    "keywords": blogPost.seoKeywords,
    "publisher": {
      "@type": "Person",
      "name": "Shailesh Chaudhari"
    }
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      
      <div className="min-h-screen">
        <div className="container mx-auto px-4 py-8">
          <Link href="/blogs" className="inline-block mb-8">
            <Button variant="ghost" className="group">
              <ArrowLeft className="mr-2 h-4 w-4 transition-transform group-hover:-translate-x-1" />
              Back to Blogs
            </Button>
          </Link>
        </div>

        <BlogLayout post={blogPost}>
          <div 
            className="prose prose-invert prose-lg max-w-none blog-content"
            dangerouslySetInnerHTML={{ __html: blogPost.content }}
          />
        </BlogLayout>
      </div>
    </>
  );
}