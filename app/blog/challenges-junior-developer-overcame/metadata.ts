import { Metadata } from "next";
import { BLOG_AUTHOR, SEO_KEYWORDS, SITE_URL } from "@/lib/blog-constants";

export const metadata: Metadata = {
  title: "Challenges I Faced as a Junior Developer and How I Overcame Them | Shailesh Chaudhari",
  description: "Join Shailesh Chaudhari as he shares the authentic challenges he faced as a junior developer and the practical strategies that helped him overcome them. From imposter syndrome to technical hurdles, discover actionable advice for navigating the early stages of a software engineering career.",
  keywords: [
    ...SEO_KEYWORDS,
    "junior developer challenges", "software engineering career", "imposter syndrome",
    "junior developer struggles", "overcoming technical challenges", "software engineering journey",
    "career growth tips", "junior developer advice"
  ],
  authors: [{ name: BLOG_AUTHOR.name }],
  openGraph: {
    title: "Challenges I Faced as a Junior Developer and How I Overcame Them | Shailesh Chaudhari",
    description: "Join Shailesh Chaudhari as he shares the authentic challenges he faced as a junior developer and the practical strategies that helped him overcome them. From imposter syndrome to technical hurdles, discover actionable advice for navigating the early stages of a software engineering career.",
    type: "article",
    url: `${SITE_URL}/blog/challenges-junior-developer-overcame`,
    images: [
      {
        url: `${SITE_URL}/Images/home.webp`,
        width: 1200,
        height: 630,
        alt: "Shailesh Chaudhari's Junior Developer Journey",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Challenges I Faced as a Junior Developer and How I Overcame Them",
    description: "Join Shailesh Chaudhari as he shares the authentic challenges he faced as a junior developer and the practical strategies that helped him overcome them. From imposter syndrome to technical hurdles, discover actionable advice for navigating the early stages of a software engineering career.",
    creator: "@shailesh93602",
  },
};