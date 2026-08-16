import type { Metadata } from "next";
import { SITE_URL, META_DEFAULTS } from "@/lib/blog-constants";
import { projects } from "@/constants/projects";

// Derived, never hard-coded: this description used to claim "5 production
// projects" and list five that no longer matched the page (it omitted the
// flagship, Holdfast). Counting the real array keeps the meta honest when a
// project is added or removed.
const projectCount = projects.length;

// True 1200×630 social card (the shailesh.webp portrait pillar-boxes).
const ogImageUrl = `${SITE_URL}/api/og?title=${encodeURIComponent(
  "Projects — Shailesh Chaudhari"
)}&type=page&description=${encodeURIComponent(
  "Production projects across EdTech, developer tooling, AI, and SaaS"
)}`;

export const metadata: Metadata = {
  title: "Projects — Shailesh Chaudhari",
  description: `${projectCount} engineering projects with the internals written up: Holdfast (inventory reservation engine that never oversells under concurrency), EduScale (real-time coding battles on Redis), KhataGO (WhatsApp + Gemini AI accounting), DevTrack (developer analytics), plus payments, RAG and idempotency reference implementations.`,
  alternates: {
    canonical: `${SITE_URL}/portfolio`,
  },
  metadataBase: new URL(SITE_URL),
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
    "Shailesh Chaudhari Portfolio",
    "Full Stack Developer Projects",
    "Web Development Portfolio",
    "React Developer Work",
    "Node.js Projects",
    "MERN Stack Applications",
    "Software Engineer Portfolio",
    "JavaScript Projects",
    "TypeScript Projects",
    "Frontend Development",
    "Backend Development",
    "Web Applications",
  ],
  openGraph: {
    type: "website",
    url: `${SITE_URL}/portfolio`,
    title: "Projects — Shailesh Chaudhari",
    description: `${projectCount} engineering projects spanning concurrency, real-time systems, payments, AI pipelines and developer tooling — each written up with its architecture and trade-offs.`,
    images: [
      {
        url: ogImageUrl,
        width: 1200,
        height: 630,
        alt: "Shailesh Chaudhari Portfolio",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Projects — Shailesh Chaudhari",
    description:
      "Real-time platforms, AI tools, Chrome extensions, and SaaS apps. All built and shipped.",
    images: [ogImageUrl],
    site: META_DEFAULTS.twitterHandle,
    creator: META_DEFAULTS.twitterHandle,
  },
};
