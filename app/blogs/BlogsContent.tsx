"use client";

import React, { useState } from "react";
import Image from "next/image";

interface BlogPost {
  slug: string;
  title: string;
  description: string;
  image: string;
  date: string;
  readTime: string;
  link: string;
}

const blogPosts: BlogPost[] = [
  {
    slug: "full-stack-basics",
    title:
      "Demystifying the Basics of Full-Stack Development: A Beginner's Guide",
    description:
      "Hey everyone! 👋 I'm Shaileshbhai Chaudhari, a final year student passionate about full-stack development. This guide is for anyone curious about how web development works!",
    image: "/Images/portfolio1.png",
    date: "December 2023",
    readTime: "10 min read",
    link: "https://guidetofullstack.blogspot.com/2023/12/demystifying-basics-of-full-stack.html",
  },
  {
    slug: "frontend-mastery",
    title:
      "Mastering Frontend Development: Essential Skills and Best Practices",
    description:
      "Explore the critical aspects of front-end development, from layout and styling to functionality and responsiveness.",
    image: "/Images/portfolio1.png",
    date: "February 2024",
    readTime: "8 min read",
    link: "https://guidetofullstack.blogspot.com/2024/02/mastering-frontend-development.html",
  },
];

export default function BlogsContent() {
  const [searchQuery] = useState("");

  const filteredPosts = blogPosts.filter(
    (post) =>
      post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="container mx-auto px-4 py-24">
      <div className="max-w-5xl mx-auto space-y-12">
        <h1 className="text-4xl font-bold text-center bg-gradient-to-r from-[hsl(var(--hero-gradient-from))] to-[hsl(var(--hero-gradient-to))] bg-clip-text text-transparent">
          Blog Posts
        </h1>
        <p className="text-center text-muted-foreground mb-8">
          Click on any blog post to read the full article on my external blog.
        </p>
        <div className="grid gap-8">
          {filteredPosts.map((post) => (
            <a
              key={post.slug}
              href={post.link}
              target="_blank"
              rel="noopener noreferrer"
              className="block group"
              aria-label={`Read full article: ${post.title}`}
            >
              <article className="bg-card rounded-lg overflow-hidden border border-border transition-all duration-300 hover:border-primary/50 hover:shadow-lg">
                <div className="grid md:grid-cols-[2fr,3fr]">
                  <div className="relative h-64 md:h-full">
                    <Image
                      src={post.image}
                      alt={post.title}
                      fill
                      className="object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                  </div>
                  <div className="p-6 md:p-8 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground mb-3">
                        <time>{post.date}</time>
                        <span>•</span>
                        <span>{post.readTime}</span>
                      </div>
                      <h2 className="text-2xl font-semibold mb-4 text-text-primary group-hover:text-primary transition-colors">
                        {post.title}
                      </h2>
                      <p className="text-text-secondary">{post.description}</p>
                    </div>
                    <div className="mt-6">
                      <span className="inline-flex items-center gap-2 text-primary font-medium group-hover:underline cursor-pointer">
                        Read More
                        <svg
                          className="w-4 h-4 transition-transform group-hover:translate-x-1"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M9 5l7 7-7 7"
                          />
                        </svg>
                      </span>
                    </div>
                  </div>
                </div>
              </article>
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}
