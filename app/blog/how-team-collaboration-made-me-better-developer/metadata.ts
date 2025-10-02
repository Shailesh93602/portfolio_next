import { Metadata } from "next";
import { BLOG_AUTHOR, SEO_KEYWORDS, SITE_URL } from "@/lib/blog-constants";

export const metadata: Metadata = {
  title: "How Team Collaboration Made Me a Better Developer | Shailesh Chaudhari",
  description: "Discover how Shailesh Chaudhari's experiences with team collaboration shaped his development career. Learn about communication, mentorship, and the collaborative skills that transformed him from a solo coder to a professional team player.",
  keywords: [
    ...SEO_KEYWORDS,
    "team collaboration developer",
    "software development teamwork",
    "agile development",
    "team communication",
    "mentorship programming",
    "collaborative coding",
    "professional development team",
    "Shailesh Chaudhari",
    "Shaileshbhai",
    "Shaileshbhai Chaudhari",
    "Shailesh",
  ],
  authors: [{ name: BLOG_AUTHOR.name }],
  openGraph: {
    title: "How Team Collaboration Made Me a Better Developer | Shailesh Chaudhari",
    description: "Discover how Shailesh Chaudhari's experiences with team collaboration shaped his development career. Learn about communication, mentorship, and the collaborative skills that transformed him from a solo coder to a professional team player.",
    type: "article",
    url: `${SITE_URL}/blog/how-team-collaboration-made-me-better-developer`,
    images: [
      {
        url: `${SITE_URL}/Images/ticTacToe.png`,
        width: 1200,
        height: 630,
        alt: "Shailesh Chaudhari's Team Collaboration Journey",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "How Team Collaboration Made Me a Better Developer",
    description: "Discover how Shailesh Chaudhari's experiences with team collaboration shaped his development career. Learn about communication, mentorship, and the collaborative skills that transformed him from a solo coder to a professional team player.",
    creator: "@shailesh93602",
  },
};