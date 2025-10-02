import { Metadata } from "next";
import { BLOG_AUTHOR, SEO_KEYWORDS, SITE_URL } from "@/lib/blog-constants";

export const metadata: Metadata = {
  title: "First Year as a Software Engineer: Key Lessons & Insights | Shailesh Chaudhari",
  description: "Join Shailesh Chaudhari as he shares valuable insights and lessons learned during his first year as a software engineer. Real experiences, practical tips, and growth strategies.",
  keywords: [
    ...SEO_KEYWORDS,
    "first year software engineer",
    "software engineering career",
    "junior developer experience",
    "tech career lessons",
    "software development journey",
  ],
  authors: [{ name: BLOG_AUTHOR.name }],
  openGraph: {
    title: "First Year as a Software Engineer: Key Lessons & Insights | Shailesh Chaudhari",
    description: "Join Shailesh Chaudhari as he shares valuable insights and lessons learned during his first year as a software engineer. Real experiences, practical tips, and growth strategies.",
    type: "article",
    url: `${SITE_URL}/blog/first-year-software-engineer-lessons`,
    images: [
      {
        url: `${SITE_URL}/Images/blog/first-year-lessons.jpg`,
        width: 1200,
        height: 630,
        alt: "Shailesh Chaudhari's First Year as a Software Engineer",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "First Year as a Software Engineer: Key Lessons & Insights",
    description: "Join Shailesh Chaudhari as he shares valuable insights and lessons learned during his first year as a software engineer. Real experiences, practical tips, and growth strategies.",
    creator: "@shailesh93602",
  },
};