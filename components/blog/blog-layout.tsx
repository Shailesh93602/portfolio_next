"use client";
import Link from "next/link";
import { CalendarIcon, ClockIcon, TagIcon } from "@/components/icons";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import AuthorBox from "@/components/author-box";

interface BlogLayoutProps {
  children: React.ReactNode;
  post: {
    title: string;
    description: string;
    date: string;
    readTime: string;
    tags: string[];
    author: {
      name: string;
      avatar: string;
      bio: string;
      role: string;
      social: {
        twitter?: string;
        github?: string;
        linkedin?: string;
      };
    };
    relatedPosts?: {
      slug: string;
      title: string;
    }[];
  };
}

// Lightweight CSS-based transitions replace framer-motion animations here to avoid
// pulling the framer-motion library into the initial client bundle.
// Use Tailwind utility classes for subtle transitions. If you need motion later,
// dynamically import framer-motion in a small client-only wrapper.

export function BlogLayout({ children, post }: BlogLayoutProps) {
  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-background/95">
      <div className="container mx-auto px-4 py-12 md:py-20">
        <div className="grid lg:grid-cols-[1fr,320px] gap-12 max-w-7xl mx-auto">
          <article className="prose prose-invert max-w-none transition-all duration-600 ease-out" aria-labelledby="post-title">
            <header className="mb-12 space-y-6">
              <h1 className="text-4xl md:text-5xl font-bold leading-tight bg-gradient-to-r from-[hsl(var(--hero-gradient-from))] to-[hsl(var(--hero-gradient-to))] bg-clip-text text-transparent">
                {post.title}
              </h1>
              
              <div className="flex flex-wrap items-center gap-6 text-muted-foreground">
                <div className="flex items-center gap-2">
                  <CalendarIcon className="w-4 h-4" />
                  <time dateTime={post.date}>{post.date}</time>
                </div>
                <div className="flex items-center gap-2">
                  <ClockIcon className="w-4 h-4" />
                  <span>{post.readTime}</span>
                </div>
              </div>

              <div className="flex flex-wrap gap-2">
                {post.tags.map((tag) => (
                  <Badge key={tag} variant="secondary" className="bg-primary/10 text-primary border-primary/20">
                    <TagIcon className="w-3 h-3 mr-1" />
                    {tag}
                  </Badge>
                ))}
              </div>

              <div className="p-6 bg-card/50 backdrop-blur-sm rounded-xl border border-border/50 not-prose">
                <AuthorBox author={post.author} />
              </div>
            </header>

            <div className="blog-content relative">
              {children}
            </div>

            <footer className="mt-16 pt-8 border-t border-border">
              <AuthorBox author={post.author} compact showBio={false} />
            </footer>
          </article>

          <aside className="space-y-8 transition-transform duration-500 ease-out">
            <div className="sticky top-24 space-y-6">
              <Card className="p-6 bg-card/50 backdrop-blur-sm border-border/50">
                <div className="text-lg font-semibold mb-4 bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
                  About the Author
                </div>
                <div className="flex flex-col gap-4">
                  <AuthorBox author={post.author} showBio />
                </div>
              </Card>

              {post.relatedPosts && post.relatedPosts.length > 0 && (
                <Card className="p-6 bg-card/50 backdrop-blur-sm border-border/50">
                  <div className="text-lg font-semibold mb-4 bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
                    Related Posts
                  </div>
                  <div className="space-y-3">
                    {post.relatedPosts.map((relatedPost) => (
                      <Link
                        key={relatedPost.slug}
                        href={`/blog/${relatedPost.slug}`}
                        className="block text-sm hover:text-primary transition-all duration-200 p-3 rounded-lg hover:bg-primary/5 border border-transparent hover:border-primary/20"
                      >
                        <div className="font-medium line-clamp-2">{relatedPost.title}</div>
                      </Link>
                    ))}
                  </div>
                </Card>
              )}
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}