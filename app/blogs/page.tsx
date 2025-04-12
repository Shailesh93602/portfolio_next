"use client";

import React from "react";
import { motion } from "framer-motion";
import { BookOpen, Code } from "lucide-react";

interface BlogPost {
  icon: React.ReactNode;
  title: string;
  description: string;
  link: string;
}

const blogPosts: BlogPost[] = [
  {
    icon: <Code className="w-6 h-6" />,
    title:
      "Demystifying the Basics of Full-Stack Development: A Beginner's Guide",
    description:
      "Hey everyone! 👋 I'm Shaileshbhai Chaudhari, a final year student passionate about full-stack development. This guide is for anyone curious about how web development works!",
    link: "https://guidetofullstack.blogspot.com/2023/12/demystifying-basics-of-full-stack.html",
  },
  {
    icon: <BookOpen className="w-6 h-6" />,
    title:
      "Mastering Frontend Development: Essential Skills and Best Practices",
    description:
      "Explore the critical aspects of front-end development, from layout and styling to functionality and responsiveness.",
    link: "https://guidetofullstack.blogspot.com/2024/02/mastering-frontend-development.html",
  },
];

interface BlogCardProps {
  blog: BlogPost;
}

function BlogCard({ blog }: BlogCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-dark rounded-lg overflow-hidden shadow-lg transition-all duration-300 hover:shadow-xl"
    >
      <div className="p-6 space-y-4">
        <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center text-text-primary">
          {blog.icon}
        </div>
        <h2 className="text-2xl font-semibold text-text-primary">
          {blog.title}
        </h2>
        <p className="text-text-secondary">{blog.description}</p>
        <a
          href={blog.link}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block mt-4 px-6 py-2 bg-primary text-text-primary font-semibold rounded-md hover:bg-primary-dark transition-colors duration-300"
        >
          Read More
        </a>
      </div>
    </motion.div>
  );
}

export default function Blogs() {
  return (
    <div className="container mx-auto px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-4xl font-bold mb-12 text-center text-text-primary">
          My Blogs
        </h1>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {blogPosts.map((blog, index) => (
            <BlogCard key={index} blog={blog} />
          ))}
        </div>
      </motion.div>
    </div>
  );
}
