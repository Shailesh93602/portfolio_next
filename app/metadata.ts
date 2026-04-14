import type { Metadata } from "next";
import { SITE_URL, META_DEFAULTS } from "@/lib/blog-constants";

export const metadata: Metadata = {
  title: "Shailesh Chaudhari — Software Engineer",
  description:
    "Software Engineer at ContextQA building developer tools and Chrome extensions. 2+ years shipping full-stack products in Next.js, React, Node.js, and TypeScript. Open to part-time and freelance work.",
  metadataBase: new URL(SITE_URL),
  alternates: {
    canonical: `${SITE_URL}/`,
  },
  openGraph: {
    title: "Shailesh Chaudhari — Software Engineer",
    description:
      "Software Engineer at ContextQA. Builds Chrome extensions, real-time systems, and full-stack web apps. Open to part-time and freelance work.",
    url: SITE_URL,
    siteName: META_DEFAULTS.siteName,
    images: [
      {
        url: "/Images/shailesh.webp",
        width: 1200,
        height: 630,
        alt: "Shailesh Chaudhari",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Shailesh Chaudhari — Software Engineer",
    description:
      "Software Engineer at ContextQA. Chrome extensions, real-time systems, Next.js. Open to part-time & freelance.",
    images: ["/Images/shailesh.webp"],
    site: META_DEFAULTS.twitterHandle,
    creator: META_DEFAULTS.twitterHandle,
  },
  keywords: [
    "Shailesh Chaudhari",
    "Software Engineer",
    "Full Stack Developer",
    "Next.js Developer",
    "React Developer",
    "Node.js Developer",
    "Chrome Extension Developer",
    "TypeScript Developer",
    "freelance developer India",
    "part-time software engineer",
  ],
  icons: {
    icon: "/Images/shailesh.webp",
    apple: "/Images/shailesh.webp",
  },
};
