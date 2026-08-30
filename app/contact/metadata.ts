import type { Metadata } from "next";
import { SITE_URL, META_DEFAULTS } from "@/lib/blog-constants";
import { PROFILE } from "@/lib/profile";

const contactTitle = `Contact ${PROFILE.name.full}`;

// True 1200×630 social card (the shailesh.webp portrait pillar-boxes).
const ogImageUrl = `${SITE_URL}/api/og?title=${encodeURIComponent(
  contactTitle
)}&type=page&description=${encodeURIComponent(
  "Backend & full-stack engineering — remote-friendly"
)}`;

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: contactTitle,
  description: `Get in touch about backend and full-stack engineering. I build in Next.js, Node.js and TypeScript. Based in ${PROFILE.location.displayShort}.`,
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
    type: "website",
    url: `${SITE_URL}/contact`,
    title: "Contact Shailesh Chaudhari",
    description:
      "Backend and full-stack engineering. Next.js, Node.js, TypeScript, real-time systems. Remote-friendly.",
    images: [
      {
        url: ogImageUrl,
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
      "Backend and full-stack engineering in Next.js / Node.js. Remote, async-friendly.",
    images: [ogImageUrl],
    site: META_DEFAULTS.twitterHandle,
    creator: META_DEFAULTS.twitterHandle,
  },
};
