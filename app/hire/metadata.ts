import type { Metadata } from "next";
import { SITE_URL } from "@/lib/blog-constants";

// True 1200×630 social card (the shailesh.webp portrait pillar-boxes).
const ogImageUrl = `${SITE_URL}/api/og?title=${encodeURIComponent(
  "Hire Shailesh Chaudhari — Full-Stack Engineer"
)}&type=page&description=${encodeURIComponent(
  "Available for part-time & freelance — Next.js, Node.js, real-time systems"
)}`;

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: "Hire Shailesh Chaudhari — Full-Stack Engineer",
  description:
    "Available for part-time and freelance web development work. I build Next.js apps, Node.js backends, Chrome extensions, and real-time systems. Remote-first, TypeScript everywhere.",
  alternates: {
    canonical: `${SITE_URL}/hire`,
  },
  openGraph: {
    title: "Hire Shailesh Chaudhari — Full-Stack Engineer",
    description:
      "Available for part-time and freelance web development. Next.js, Node.js, Chrome extensions, real-time systems.",
    url: `${SITE_URL}/hire`,
    images: [
      {
        url: ogImageUrl,
        width: 1200,
        height: 630,
        alt: "Shailesh Chaudhari",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Hire Shailesh Chaudhari — Full-Stack Engineer",
    description:
      "Available for part-time and freelance work. Next.js, Node.js, TypeScript.",
    images: [ogImageUrl],
  },
};
