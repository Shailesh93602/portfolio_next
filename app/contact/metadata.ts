import type { Metadata } from "next";
import { SITE_URL, META_DEFAULTS } from "@/lib/blog-constants";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: "Contact Shailesh Chaudhari",
  description:
    "Get in touch for part-time or freelance web development work. I build in Next.js, Node.js, and TypeScript, and I'm available for remote projects. Based in Gujarat, India.",
  alternates: {
    canonical: `${SITE_URL}/contact`,
  },
  robots: {
    index: true,
    follow: true,
    nocache: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  keywords: [
    "Contact Shailesh Chaudhari",
    "Full Stack Developer Contact",
    "Hire Web Developer",
    "Software Engineer Contact",
    "Web Development Services",
    "Professional Developer Contact",
    "React Developer Contact",
    "Node.js Developer Contact",
    "JavaScript Expert Contact",
    "TypeScript Developer Contact",
    "Gujarat Developer",
    "India Web Developer",
  ],
  openGraph: {
    title: "Contact Shailesh Chaudhari",
    description:
      "Available for part-time and freelance work. Next.js, Node.js, TypeScript, real-time systems. Remote-friendly.",
    images: [
      {
        url: "/Images/shailesh.webp",
        width: 1200,
        height: 630,
        alt: "Shailesh Chaudhari Profile",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Contact Shailesh Chaudhari",
    description:
      "Available for part-time and freelance Next.js / Node.js work. Remote, async-friendly.",
    images: ["/Images/shailesh.webp"],
    site: META_DEFAULTS.twitterHandle,
    creator: META_DEFAULTS.twitterHandle,
  },
  icons: {
    icon: "/Images/shailesh.webp",
    apple: "/Images/shailesh.webp",
  },
};
