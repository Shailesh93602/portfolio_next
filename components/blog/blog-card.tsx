"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { Tag } from "lucide-react";
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

  const imageSrc = post.image ?? "/Images/portfolio1.png";
  const avatarSrc = post.author?.avatar ?? "/Images/home.webp";

  return (
    <motion.div
      variants={cardVariants}
      initial="hidden"
      animate="visible"
      whileHover={{ scale: 1.02 }}
      className="w-full h-full"
    >
      <Link
        href={`/blog/${post.slug}`}
        className="block group h-full"
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
        <article className="flex flex-col h-full bg-card/50 backdrop-blur-sm rounded-xl overflow-hidden border border-border/50 transition-all duration-300 hover:shadow-xl hover:border-primary/20">
          <div className="relative w-full h-56 md:h-52 lg:h-56">
            <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent z-10" />
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
                    className="bg-background/80 backdrop-blur-sm text-xs"
                  >
                    <Tag className="w-3 h-3 mr-1" />
                    {tag}
                  </Badge>
                ))}
              </div>
            )}
          </div>

          <div className="p-6 flex-1 flex flex-col">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="relative w-10 h-10 rounded-full overflow-hidden border-2 border-primary/20">
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
              <div className="text-xs font-medium px-3 py-1 rounded-full bg-primary/10 text-primary">
                {post.readTime}
              </div>
            </div>

            <h2 className="text-xl font-semibold mb-3 text-foreground group-hover:text-primary transition-colors line-clamp-2 leading-tight">
              {post.title}
            </h2>

            <p className="text-muted-foreground mb-4 line-clamp-2 leading-relaxed flex-grow">
              {post.description}
            </p>

            <div className="mt-auto">
              <div className="text-sm text-primary font-medium group-hover:underline transition-all duration-200">
                Read more →
              </div>
            </div>
          </div>
        </article>
      </Link>
    </motion.div>
  );
}