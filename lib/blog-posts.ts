// Centralized blog posts data for both listing and detail pages
export interface BlogPost {
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

export const blogPosts: BlogPost[] = [
  {
    slug: "solving-700-dsa-problems",
    title: "My Journey to Mastering DSA: Solving 700+ Problems",
    description: "Follow my journey of solving over 700 Data Structures and Algorithms problems. Learn about my strategies, challenges, and key insights that helped me improve my problem-solving skills.",
    image: "/Images/blog/dsa-journey.jpg",
    author: {
      name: "Shailesh Chaudhari",
    avatar: "/Images/shailesh.webp"
    },
    date: "2025-10-02",
    readTime: "10 min read",
    tags: ["Data Structures", "Algorithms", "Problem Solving", "Coding Practice", "Technical Interview"],
    content: `...full content from blog/solving-700-dsa-problems/content.ts...`,
  },
  {
    slug: "first-year-software-engineer-lessons",
    title: "First Year as a Software Engineer: Key Lessons & Insights",
    description: "Join me as I share the most valuable lessons and insights from my first year as a software engineer. From technical challenges to professional growth, discover practical tips for success.",
    image: "/Images/blog/first-year-lessons.jpg",
    author: {
      name: "Shailesh Chaudhari",
  avatar: "/Images/shailesh.webp"
    },
    date: "2024-10-02",
    readTime: "15 min read",
    tags: ["Career Growth", "Software Engineering", "Web Development", "Best Practices", "Developer Tips"],
    content: `## Introduction\n\nWhen I, Shaileshbhai Chaudhari, started my journey as a software engineer, I had no idea how transformative the first year would be. Fresh out of college with theoretical knowledge and some personal projects, I was eager to apply my skills in a professional setting. Today, as Shailesh Chaudhari, I want to share the invaluable lessons I learned during this crucial year of my career.\n\nIn this comprehensive guide, I'll walk you through the technical challenges, professional growth opportunities, and personal insights that shaped my development as a software engineer. Whether you're a recent graduate, aspiring developer, or someone considering a career in tech, these experiences will help you navigate your own journey.\n\n...full content from blog/first-year-software-engineer-lessons/content.ts...`,
  },
  {
    slug: "internship-to-engineer-journey",
    title: "From Intern to Engineer: My Software Development Journey",
    description: "Follow my journey from a passionate coding intern to a full-time software engineer. Learn about the challenges, growth strategies, and valuable insights I gained along the way.",
    image: "/Images/blog/journey-cover.jpg",
    author: {
      name: "Shailesh Chaudhari",
  avatar: "/Images/shailesh.webp"
    },
    date: "2024-10-02",
    readTime: "12 min read",
    tags: ["Career Growth", "Software Development", "Internship", "Web Development", "Full Stack"],
    content: `## Introduction\n\nHello everyone! I'm Shaileshbhai Chaudhari, and today I want to share my journey from being an enthusiastic intern to becoming a full-time software engineer. As many of you know me (Shailesh) from my technical blogs and projects, I've always been passionate about sharing knowledge and experiences that can help others in their tech careers.\n\nIn this blog post, I'll take you through my transformation from writing my first lines of production code to architecting full-stack applications. Whether you're a student, an aspiring developer, or someone considering a career switch, this story will provide valuable insights into the world of software development.\n\n...full content from blog/internship-to-engineer-journey/content.ts...`,
  },
];
