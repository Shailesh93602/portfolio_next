"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { TagIcon } from "@/components/icons";
import { Badge } from "../ui/badge";

declare global {
  interface Window {
    gtag: (...args: unknown[]) => void;
  }
}

interface BlogCardProps {
  post: {
    slug: string;
    title: string;
    description: string;
    image?: string;
    date: string;
    readTime: string;
    tags?: string[];
    author: {
      name: string;
      avatar?: string;
    };
  };
  index: number;
}

export function BlogCard({ post, index }: BlogCardProps) {
  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        delay: index * 0.1,
      },
    },
  };

  // Use a neutral project/preview image as the fallback for post previews so
  // the author's personal photo isn't used as a blog preview image.
  const imageSrc = post.image ?? "/Images/portfolio1.png";
  const avatarSrc = post.author?.avatar ?? "/Images/shailesh.webp";

  return (
    <motion.div
      variants={cardVariants}
      initial="hidden"
      animate="visible"
      whileHover={{ scale: 1.02 }}
      className="h-full w-full"
    >
      <Link
        href={`/blog/${post.slug}`}
        className="group block h-full"
        aria-label={`Read full article: ${post.title}`}
        onClick={() => {
          if (typeof window !== "undefined" && window.gtag) {
            window.gtag("event", "blog_click", {
              event_category: "engagement",
              event_label: post.slug,
              value: 1,
            });
          }
        }}
      >
        <article className="flex h-full flex-col overflow-hidden rounded-xl border border-border/50 bg-card/50 backdrop-blur-sm transition-all duration-300 hover:border-primary/20 hover:shadow-xl">
          <div className="relative h-56 w-full md:h-52 lg:h-56">
            <div className="absolute inset-0 z-10 bg-gradient-to-t from-background/80 via-transparent to-transparent" />
            <Image
              src={imageSrc}
              alt={post.title}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-110"
            />
            {post.tags && post.tags.length > 0 && (
              <div className="absolute bottom-4 left-4 z-20 flex gap-2">
                {post.tags.slice(0, 2).map((tag) => (
                  <Badge
                    key={tag}
                    variant="secondary"
                    className="bg-background/80 text-xs backdrop-blur-sm"
                  >
                    <TagIcon className="mr-1 h-3 w-3" />
                    {tag}
                  </Badge>
                ))}
              </div>
            )}
          </div>

          <div className="flex flex-1 flex-col p-6">
            <div className="mb-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="relative h-10 w-10 overflow-hidden rounded-full border-2 border-primary/20">
                  <Image
                    src={avatarSrc}
                    alt={post.author.name}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="flex flex-col">
                  <span className="text-sm font-medium text-foreground">
                    {post.author.name}
                  </span>
                  <time className="text-xs text-muted-foreground">
                    {post.date}
                  </time>
                </div>
              </div>
              <div className="rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
                {post.readTime}
              </div>
            </div>

            <h2 className="mb-3 line-clamp-2 text-xl font-semibold leading-tight text-foreground transition-colors group-hover:text-primary">
              {post.title}
            </h2>

            <p className="mb-4 line-clamp-2 flex-grow leading-relaxed text-muted-foreground">
              {post.description}
            </p>

            <div className="mt-auto">
              <div className="text-sm font-medium text-primary transition-all duration-200 group-hover:underline">
                Read more →
              </div>
            </div>
          </div>
        </article>
      </Link>
    </motion.div>
  );
}
