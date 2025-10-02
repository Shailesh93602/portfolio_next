import { Metadata } from "next";
import { BLOG_AUTHOR, SEO_KEYWORDS, SITE_URL } from "@/lib/blog-constants";

export const metadata: Metadata = {
  title: "Building My Portfolio Website with Next.js & TailwindCSS | Shailesh Chaudhari",
  description: "Join Shailesh Chaudhari as he walks through the complete process of building a professional portfolio website using Next.js 13+, TailwindCSS, and modern web development practices. Learn about component architecture, responsive design, and deployment strategies.",
  keywords: [
    ...SEO_KEYWORDS,
    "Next.js portfolio", "TailwindCSS portfolio", "React portfolio website",
    "portfolio website tutorial", "Next.js 13 portfolio", "TailwindCSS tutorial",
    "responsive portfolio design", "modern web development"
  ],
  authors: [{ name: BLOG_AUTHOR.name }],
  openGraph: {
    title: "Building My Portfolio Website with Next.js & TailwindCSS | Shailesh Chaudhari",
    description: "Join Shailesh Chaudhari as he walks through the complete process of building a professional portfolio website using Next.js 13+, TailwindCSS, and modern web development practices. Learn about component architecture, responsive design, and deployment strategies.",
    type: "article",
    url: `${SITE_URL}/blog/building-portfolio-website-nextjs-tailwindcss`,
    images: [
      {
        url: `${SITE_URL}/Images/portfolio1.png`,
        width: 1200,
        height: 630,
        alt: "Shailesh Chaudhari's Portfolio Website Development Journey",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Building My Portfolio Website with Next.js & TailwindCSS",
    description: "Join Shailesh Chaudhari as he walks through the complete process of building a professional portfolio website using Next.js 13+, TailwindCSS, and modern web development practices.",
    creator: "@shailesh93602",
  },
};