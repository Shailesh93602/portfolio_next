import { Metadata } from "next";
import { BLOG_AUTHOR, SEO_KEYWORDS, SITE_URL } from "@/lib/blog-constants";

export const metadata: Metadata = {
  title: "Lessons from Ranking #1 in My Institute on GeeksforGeeks | Shailesh Chaudhari",
  description: "Discover Shailesh Chaudhari's comprehensive strategy for achieving #1 ranking on GeeksforGeeks. Learn systematic approaches, time management techniques, and problem-solving methodologies that led to competitive programming excellence.",
  keywords: [
    ...SEO_KEYWORDS,
    "GeeksforGeeks ranking",
    "institute rank 1",
    "competitive programming strategy",
    "coding challenges mastery",
    "GeeksforGeeks problem solving",
    "technical achievement",
    "coding competition success",
  ],
  authors: [{ name: BLOG_AUTHOR.name }],
  openGraph: {
    title: "Lessons from Ranking #1 in My Institute on GeeksforGeeks | Shailesh Chaudhari",
    description: "Discover Shailesh Chaudhari's comprehensive strategy for achieving #1 ranking on GeeksforGeeks. Learn systematic approaches, time management techniques, and problem-solving methodologies that led to competitive programming excellence.",
    type: "article",
    url: `${SITE_URL}/blog/ranking-1-geeksforgeeks-institute`,
    images: [
      {
        url: `${SITE_URL}/Images/codechef.png`,
        width: 1200,
        height: 630,
        alt: "Shailesh Chaudhari's GeeksforGeeks #1 Ranking Achievement",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Lessons from Ranking #1 in My Institute on GeeksforGeeks",
    description: "Discover Shailesh Chaudhari's comprehensive strategy for achieving #1 ranking on GeeksforGeeks. Learn systematic approaches, time management techniques, and problem-solving methodologies.",
    creator: "@shailesh93602",
  },
};