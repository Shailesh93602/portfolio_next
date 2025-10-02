import { Metadata } from "next";
import { BLOG_AUTHOR, SEO_KEYWORDS, SITE_URL } from "@/lib/blog-constants";

export const metadata: Metadata = {
  title: "Why My Seniors Trust Me for Code Reviews and Decisions | Shailesh Chaudhari",
  description: "Discover how Shailesh Chaudhari earned the trust of senior engineers for code reviews and technical decisions. Learn the principles, habits, and strategies that transformed him from a junior developer to a trusted technical leader.",
  keywords: [
    ...SEO_KEYWORDS,
    "code review best practices",
    "senior engineer trust",
    "technical leadership",
    "software engineering credibility",
    "team collaboration",
    "code quality",
    "engineering decision making",
    "professional development",
  ],
  authors: [{ name: BLOG_AUTHOR.name }],
  openGraph: {
    title: "Why My Seniors Trust Me for Code Reviews and Decisions | Shailesh Chaudhari",
    description: "Discover how Shailesh Chaudhari earned the trust of senior engineers for code reviews and technical decisions. Learn the principles, habits, and strategies that transformed him from a junior developer to a trusted technical leader.",
    type: "article",
    url: `${SITE_URL}/blog/why-seniors-trust-me-code-reviews`,
    images: [
      {
        url: `${SITE_URL}/Images/portfolio1.png`,
        width: 1200,
        height: 630,
        alt: "Shailesh Chaudhari's Technical Leadership Journey",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Why My Seniors Trust Me for Code Reviews and Decisions",
    description: "Discover how Shailesh Chaudhari earned the trust of senior engineers for code reviews and technical decisions. Learn the principles, habits, and strategies that transformed him from a junior developer to a trusted technical leader.",
    creator: "@shailesh93602",
  },
};