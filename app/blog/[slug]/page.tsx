import { Metadata } from "next";
import { notFound } from "next/navigation";
import { BlogLayout } from "@/components/blog/blog-layout";
import { ArrowLeftIcon } from "@/components/icons";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { getPostBySlug, getRelatedPosts, blogPosts } from "@/lib/blog-data";

const getPostData = (slug: string) => {
  const post = getPostBySlug(slug);
  if (!post) return null;
  
  const relatedPosts = getRelatedPosts(slug, 3)
    .map(({ slug, title }) => ({ slug, title }));
  
  return {
    ...post,
    relatedPosts
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
    keywords: [...post.tags, "Shailesh Chaudhari", "Shaileshbhai", "Full Stack Developer", "Software Engineer"],
    authors: [{ name: "Shailesh Chaudhari" }],
    openGraph: {
      title,
      description,
      type: "article",
      publishedTime: post.date,
      authors: ["Shailesh Chaudhari"],
      tags: post.tags,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      creator: "@shaileshwork",
    },
    alternates: {
      canonical: `https://shaileshchaudhari.vercel.app/blog/${slug}`,
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

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    "headline": post.title,
    "description": post.description,
    "author": {
      "@type": "Person",
      "name": "Shailesh Chaudhari",
      "url": "https://shaileshchaudhari.vercel.app"
    },
    "datePublished": post.date,
    "image": `https://shaileshchaudhari.vercel.app${post.image}`,
    "keywords": [...post.tags, "Shailesh Chaudhari", "Full Stack Development"],
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