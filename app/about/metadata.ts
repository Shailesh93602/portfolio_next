import type { Metadata } from "next";
import { SITE_URL, META_DEFAULTS } from "@/lib/blog-constants";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: "About | Shailesh Chaudhari",
  description:
    "Learn more about Shailesh Chaudhari, a passionate Full Stack Developer from Gujarat, India. Discover his experience, achievements, skills, and hobbies.",
  alternates: {
    canonical: `${SITE_URL}/about`,
  },
  openGraph: {
    title: "About | Shailesh Chaudhari",
    description:
      "Learn more about Shailesh Chaudhari, a passionate Full Stack Developer from Gujarat, India. Discover his experience, achievements, skills, and hobbies.",
    url: `${SITE_URL}/about`,
    siteName: META_DEFAULTS.siteName,
    images: [
      {
        url: "/Images/shailesh.webp",
        width: 1200,
        height: 630,
        alt: "Shailesh Chaudhari Profile Picture",
      },
    ],
    locale: "en_US",
    type: "profile",
  },
  twitter: {
    card: "summary_large_image",
    title: "About | Shailesh Chaudhari",
    description:
      "Learn more about Shailesh Chaudhari, a passionate Full Stack Developer from Gujarat, India. Discover his experience, achievements, skills, and hobbies.",
    images: ["/Images/shailesh.webp"],
    site: META_DEFAULTS.twitterHandle,
    creator: META_DEFAULTS.twitterHandle,
  },
  icons: {
    icon: "/Images/shailesh.webp",
    apple: "/Images/shailesh.webp",
  },
};
