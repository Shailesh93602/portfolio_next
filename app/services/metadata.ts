import type { Metadata } from "next";
import { SITE_URL } from "@/lib/blog-constants";

// True 1200×630 social card via the dynamic OG route (the shailesh.webp
// portrait pillar-boxes), matching the canonical page-card pattern.
const ogImageUrl = `${SITE_URL}/api/og?title=${encodeURIComponent(
  "Services — Shailesh Chaudhari"
)}&type=page&description=${encodeURIComponent(
  "Full-stack apps, real-time systems, and AI integrations — built correct-first"
)}`;

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: "Services — Shailesh Chaudhari",
  description:
    "What I build for clients: full-stack web apps, real-time systems, AI integrations, and performance work. Next.js + Node.js, TypeScript everywhere, correctness first. Remote, async-friendly.",
  alternates: {
    canonical: `${SITE_URL}/services`,
  },
  openGraph: {
    title: "Services — Shailesh Chaudhari",
    description:
      "Full-stack web apps, real-time systems, and AI integrations. Next.js, Node.js, TypeScript. Remote, async-friendly.",
    url: `${SITE_URL}/services`,
    images: [
      {
        url: ogImageUrl,
        width: 1200,
        height: 630,
        alt: "Shailesh Chaudhari — Services",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Services — Shailesh Chaudhari",
    description:
      "Full-stack apps, real-time systems, and AI integrations. Next.js, Node.js, TypeScript.",
    images: [ogImageUrl],
  },
};
