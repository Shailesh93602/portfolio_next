import React from "react";
import Image from "next/image";
import { Calendar, Clock, Tag, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { notFound } from "next/navigation";
import Link from "next/link";

interface BlogPost {
  slug: string;
  title: string;
  description: string;
  content: string;
  image: string;
  author: {
    name: string;
    avatar: string;
  };
  date: string;
  readTime: string;
  tags: string[];
}

// This would typically come from an API or CMS
const blogPosts: BlogPost[] = [
  {
    slug: "demystifying-fullstack-development",
    title: "Demystifying the Basics of Full-Stack Development",
    description:
      "A comprehensive guide to understanding full-stack development and its core concepts.",
    content: `
      <h2>Introduction</h2>
      <p>Full-stack development has become one of the most sought-after skills in the tech industry. But what exactly does it mean to be a full-stack developer?</p>
      
      <h2>What is Full-Stack Development?</h2>
      <p>Full-stack development refers to the development of both front-end and back-end portions of a web application. A full-stack developer is someone who can work on both the client-side and server-side of the application.</p>
      
      <h2>Front-End Development</h2>
      <p>The front-end is what users see and interact with. It includes everything that users experience directly: text colors and styles, images, graphs and tables, buttons, colors, and navigation menu.</p>
      
      <h2>Back-End Development</h2>
      <p>The back-end is the server-side of the application. It includes the server, application, and database. Back-end developers build and maintain the technology that powers those components.</p>
      
      <h2>Essential Skills</h2>
      <ul>
        <li>HTML, CSS, and JavaScript</li>
        <li>Front-end frameworks (React, Vue, Angular)</li>
        <li>Back-end languages (Node.js, Python, Java)</li>
        <li>Databases (SQL, MongoDB)</li>
        <li>Version control (Git)</li>
      </ul>
      
      <h2>Conclusion</h2>
      <p>Full-stack development is a challenging but rewarding field. It requires continuous learning and adaptation to new technologies and best practices.</p>
    `,
    image: "/Images/portfolio1.png",
    author: {
      name: "Shailesh Chaudhari",
      avatar: "/Images/home.webp",
    },
    date: "2024-02-15",
    readTime: "5 min read",
    tags: ["Web Development", "Full Stack", "Programming"],
  },
  {
    slug: "mastering-frontend-development",
    title:
      "Mastering Frontend Development: Essential Skills and Best Practices",
    description:
      "Explore the critical aspects of front-end development, from layout and styling to functionality and responsiveness.",
    content: `
      <h2>Introduction</h2>
      <p>Frontend development is a crucial aspect of web development that focuses on creating the user interface and experience.</p>
      
      <h2>Core Technologies</h2>
      <p>The foundation of frontend development lies in three core technologies: HTML, CSS, and JavaScript.</p>
      
      <h2>Modern Frameworks</h2>
      <p>Modern frontend development heavily relies on frameworks like React, Vue, and Angular to build complex user interfaces efficiently.</p>
      
      <h2>Responsive Design</h2>
      <p>Creating websites that work well on all devices is essential in today's mobile-first world.</p>
      
      <h2>Performance Optimization</h2>
      <p>Optimizing frontend performance is crucial for providing a good user experience.</p>
      
      <h2>Conclusion</h2>
      <p>Frontend development is an ever-evolving field that requires continuous learning and adaptation.</p>
    `,
    image: "/Images/portfolio1.png",
    author: {
      name: "Shailesh Chaudhari",
      avatar: "/Images/home.webp",
    },
    date: "2024-03-01",
    readTime: "4 min read",
    tags: ["Frontend", "Web Development", "UI/UX"],
  },
];

type Props = {
  params: Promise<{ slug: string }>;
};

export default async function Page({ params }: Props) {
  const resolvedParams = await params;
  const post = blogPosts.find((post) => post.slug === resolvedParams.slug);

  if (!post) {
    notFound();
  }

  return (
    <div className="container mx-auto px-4 py-16">
      <div className="opacity-100">
        <Link href="/blog" className="inline-block mb-8">
          <Button variant="ghost">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Blogs
          </Button>
        </Link>

        <article className="prose prose-invert max-w-none">
          <div className="relative h-96 w-full mb-8">
            <Image
              src={post.image}
              alt={post.title}
              fill
              className="object-cover rounded-lg"
            />
          </div>

          <h1 className="text-4xl font-bold mb-4">{post.title}</h1>

          <div className="flex items-center gap-4 mb-8 text-text-secondary">
            <div className="flex items-center gap-2">
              <Image
                src={post.author.avatar}
                alt={post.author.name}
                width={32}
                height={32}
                className="rounded-full"
              />
              <span>{post.author.name}</span>
            </div>
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              <span>{post.date}</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4" />
              <span>{post.readTime}</span>
            </div>
          </div>

          <div className="flex flex-wrap gap-2 mb-8">
            {post.tags.map((tag, index) => (
              <span
                key={index}
                className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm flex items-center gap-1"
              >
                <Tag className="h-3 w-3" />
                {tag}
              </span>
            ))}
          </div>

          <div
            className="prose prose-invert max-w-none"
            dangerouslySetInnerHTML={{ __html: post.content }}
          />
        </article>
      </div>
    </div>
  );
}
