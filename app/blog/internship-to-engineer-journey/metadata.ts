import { Metadata } from "next";
import { BLOG_AUTHOR, SEO_KEYWORDS, SITE_URL } from "@/lib/blog-constants";

export const metadata: Metadata = {
  title: "From Intern to Engineer: My Software Development Journey | Shailesh Chaudhari",
  description: "Follow Shailesh Chaudhari's journey from a coding intern to a full-time software engineer. Learn about real challenges, growth strategies, and career insights.",
  keywords: [
    ...SEO_KEYWORDS,
    "software engineering career",
    "internship to full-time",
    "tech career growth",
    "software development journey",
    "coding internship experience",
  ],
  authors: [{ name: BLOG_AUTHOR.name }],
  openGraph: {
    title: "From Intern to Engineer: My Software Development Journey | Shailesh Chaudhari",
    description: "Follow Shailesh Chaudhari's journey from a coding intern to a full-time software engineer. Learn about real challenges, growth strategies, and career insights.",
    type: "article",
    url: `${SITE_URL}/blog/internship-to-engineer-journey`,
    images: [
      {
        url: `${SITE_URL}/Images/blog/journey-cover.jpg`,
        width: 1200,
        height: 630,
        alt: "Shailesh Chaudhari's Software Engineering Journey",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "From Intern to Engineer: My Software Development Journey",
    description: "Follow Shailesh Chaudhari's journey from a coding intern to a full-time software engineer. Learn about real challenges, growth strategies, and career insights.",
    creator: "@shailesh93602",
  },
};