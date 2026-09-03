import type { Metadata } from "next";
import { SITE_URL } from "@/lib/blog-constants";

const TITLE = "What I work on — Shailesh Chaudhari";
const DESCRIPTION =
  "Backend systems in TypeScript/Node, real-time platforms, applied AI inside products, webhook idempotency, and verification that asserts real outcomes. How I work, in one page.";

// True 1200×630 social card via the dynamic OG route (the shailesh.webp
// portrait pillar-boxes), matching the canonical page-card pattern.
const ogImageUrl = `${SITE_URL}/api/og?title=${encodeURIComponent(
  "What I work on"
)}&type=page&description=${encodeURIComponent(
  "Backend systems, real-time platforms, applied AI — correct-first"
)}`;

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: TITLE,
  description: DESCRIPTION,
  alternates: {
    canonical: `${SITE_URL}/services`,
  },
  openGraph: {
    type: "website",
    title: TITLE,
    description: DESCRIPTION,
    url: `${SITE_URL}/services`,
    images: [
      {
        url: ogImageUrl,
        width: 1200,
        height: 630,
        alt: "Shailesh Chaudhari — What I work on",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: TITLE,
    description: DESCRIPTION,
    images: [ogImageUrl],
  },
};
