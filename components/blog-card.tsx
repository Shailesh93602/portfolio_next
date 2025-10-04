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
        <Card className="bg-dark overflow-hidden hover:shadow-lg transition-shadow duration-300">
          <div className="relative h-48">
            <Image src={image} alt={title} fill className="object-cover" />
          </div>
          <CardContent className="p-6">
            <div className="flex items-center gap-2 mb-4">
              <div className="relative w-8 h-8 rounded-full overflow-hidden">
                <Image
                  src={author.avatar}
                  alt={author.name}
                  fill
                  className="object-cover"
                />
              </div>
              <span className="text-text-primary">{author.name}</span>
            </div>

            <h3 className="text-xl font-semibold mb-2 text-text-primary">
              {title}
            </h3>
            <p className="text-text-secondary mb-4 line-clamp-2">
              {description}
            </p>

            <div className="flex items-center gap-4 mb-4 text-text-secondary">
              <div className="flex items-center gap-1">
                <CalendarIcon className="w-4 h-4" />
                <span className="text-sm">
                  {new Date(date).toLocaleDateString()}
                </span>
              </div>
              <div className="flex items-center gap-1">
                <ClockIcon className="w-4 h-4" />
                <span className="text-sm">{readTime}</span>
              </div>
            </div>

            <div className="flex flex-wrap gap-2">
              {tags.map((tag, index) => (
                <span
                  key={index}
                  className="px-2 py-1 bg-primary/10 text-primary text-sm rounded-full flex items-center gap-1"
                >
                  <TagIcon className="w-3 h-3" />
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
