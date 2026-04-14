import type { Metadata } from "next";
import { SITE_URL, META_DEFAULTS } from "@/lib/blog-constants";

export const metadata: Metadata = {
  title: "Projects — Shailesh Chaudhari",
  description:
    "5 production projects: EduScale (real-time coding battles with Redis), DevTrack (developer analytics), KhataGO (WhatsApp + Gemini AI accounting), Vibe Testing (AI web testing extension), AxeTos (WCAG accessibility extension).",
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
    title: "Projects — Shailesh Chaudhari",
    description:
      "5 production projects spanning EdTech, developer tooling, AI, and SaaS. Real-time systems, Chrome extensions, and full-stack web apps.",
    images: [
      {
        url: "/Images/shailesh.webp",
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
    images: ["/Images/shailesh.webp"],
    site: META_DEFAULTS.twitterHandle,
    creator: META_DEFAULTS.twitterHandle,
  },
  icons: {
    icon: "/Images/shailesh.webp",
    apple: "/Images/shailesh.webp",
  },
};
