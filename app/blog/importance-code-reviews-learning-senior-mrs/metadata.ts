import { Metadata } from "next";
import { BLOG_AUTHOR, SEO_KEYWORDS, SITE_URL } from "@/lib/blog-constants";

export const metadata: Metadata = {
  title: "The Importance of Code Reviews and What I Learned from Reviewing Senior Devs' MRs | Shailesh Chaudhari",
  description: "Discover Shailesh Chaudhari's insights on the critical role of code reviews in software development and the valuable lessons learned from reviewing senior developers' merge requests. Learn how code reviews build quality, foster learning, and accelerate professional growth.",
  keywords: [
    ...SEO_KEYWORDS,
    "code review best practices",
    "senior developer code review",
    "merge request review",
    "software engineering code quality",
    "technical feedback",
    "code review culture",
    "professional development",
    "peer code review",
    "Shailesh Chaudhari",
    "Shaileshbhai",
    "Shaileshbhai Chaudhari",
    "Shailesh",
  ],
  authors: [{ name: BLOG_AUTHOR.name }],
  openGraph: {
    title: "The Importance of Code Reviews and What I Learned from Reviewing Senior Devs' MRs | Shailesh Chaudhari",
    description: "Discover Shailesh Chaudhari's insights on the critical role of code reviews in software development and the valuable lessons learned from reviewing senior developers' merge requests. Learn how code reviews build quality, foster learning, and accelerate professional growth.",
    type: "article",
    url: `${SITE_URL}/blog/importance-code-reviews-learning-senior-mrs`,
    images: [
      {
        url: `${SITE_URL}/Images/codechef.png`,
        width: 1200,
        height: 630,
        alt: "Shailesh Chaudhari's Code Review Insights and Senior Developer Lessons",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "The Importance of Code Reviews and What I Learned from Reviewing Senior Devs' MRs",
    description: "Discover Shailesh Chaudhari's insights on the critical role of code reviews in software development and the valuable lessons learned from reviewing senior developers' merge requests. Learn how code reviews build quality, foster learning, and accelerate professional growth.",
    creator: "@shailesh93602",
  },
};