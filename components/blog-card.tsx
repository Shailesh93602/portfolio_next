import React from "react";
import Image from "next/image";
import Link from "next/link";
// framer-motion removed to reduce initial bundle size; use CSS transitions instead
import { CalendarIcon, ClockIcon, TagIcon } from "@/components/icons";
import { Card, CardContent } from "@/components/ui/card";

interface BlogCardProps {
  slug: string;
  title: string;
  description: string;
  image: string;
  author: {
    name: string;
    avatar: string;
  };
  date: string;
  readTime: string;
  tags: string[];
}

export function BlogCard({
  slug,
  title,
  description,
  image,
  author,
  date,
  readTime,
  tags,
}: BlogCardProps) {
  return (
    <div className="transition-transform duration-500 ease-out will-change-transform">
      <Link href={`/blog/${slug}`}>
        <Card className="bg-background overflow-hidden transition-shadow duration-300 hover:shadow-lg">
          <div className="relative h-48">
            <Image src={image} alt={title} fill className="object-cover" />
          </div>
          <CardContent className="p-6">
            <div className="mb-4 flex items-center gap-2">
              <div className="relative h-8 w-8 overflow-hidden rounded-full">
                <Image
                  src={author.avatar}
                  alt={author.name}
                  fill
                  className="object-cover"
                />
              </div>
              <span className="text-foreground">{author.name}</span>
            </div>

            <h3 className="text-foreground mb-2 text-xl font-semibold">
              {title}
            </h3>
            <p className="text-muted-foreground mb-4 line-clamp-2">
              {description}
            </p>

            <div className="text-muted-foreground mb-4 flex items-center gap-4">
              <div className="flex items-center gap-1">
                <CalendarIcon className="h-4 w-4" />
                <span className="text-sm">
                  {new Date(date).toLocaleDateString()}
                </span>
              </div>
              <div className="flex items-center gap-1">
                <ClockIcon className="h-4 w-4" />
                <span className="text-sm">{readTime}</span>
              </div>
            </div>

            <div className="flex flex-wrap gap-2">
              {tags.map((tag, index) => (
                <span
                  key={index}
                  className="flex items-center gap-1 rounded-full bg-primary/10 px-2 py-1 text-sm text-primary"
                >
                  <TagIcon className="h-3 w-3" />
                  {tag}
                </span>
              ))}
            </div>
          </CardContent>
        </Card>
      </Link>
    </div>
  );
}
