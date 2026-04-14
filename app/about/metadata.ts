import type { Metadata } from "next";
import { SITE_URL, META_DEFAULTS } from "@/lib/blog-constants";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: "About — Shailesh Chaudhari",
  description:
    "Software Engineer from Bhavnagar, Gujarat. Currently at ContextQA building Chrome extensions for web testing and accessibility auditing. Previously at eSparkBiz. BE in Information Technology, GEC Bhavnagar, 2024.",
  alternates: {
    canonical: `${SITE_URL}/about`,
  },
  openGraph: {
    title: "About — Shailesh Chaudhari",
    description:
      "Software Engineer from Gujarat, India. Working on developer tools at ContextQA. Two years shipping full-stack products across EdTech, SaaS, and developer tooling.",
    url: `${SITE_URL}/about`,
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
    type: "profile",
  },
  twitter: {
    card: "summary_large_image",
    title: "About — Shailesh Chaudhari",
    description:
      "Software Engineer at ContextQA. BE in IT from GEC Bhavnagar, 2024. Chrome extensions, real-time systems, full-stack web development.",
    images: ["/Images/shailesh.webp"],
    site: META_DEFAULTS.twitterHandle,
    creator: META_DEFAULTS.twitterHandle,
  },
  icons: {
    icon: "/Images/shailesh.webp",
    apple: "/Images/shailesh.webp",
  },
};
