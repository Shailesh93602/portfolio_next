import type { Metadata } from "next";
import { SITE_URL, META_DEFAULTS } from "@/lib/blog-constants";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: "Blog | Shailesh Chaudhari - Full Stack Developer Insights",
  description:
    "Explore technical articles, development insights, and coding tutorials by Shailesh Chaudhari. Learn about web development, MERN stack, and software engineering best practices.",
  alternates: {
    canonical: `${SITE_URL}/blogs`,
  },
  applicationName: META_DEFAULTS.siteName,
  authors: [
    {
      name: "Shailesh Chaudhari",
      url: `${SITE_URL}/blogs`,
    },
  ],
  generator: "Next.js",
  keywords: [
    "Shailesh Chaudhari Blog",
    "Web Development Articles",
    "MERN Stack Tutorials",
    "Software Engineering Blog",
    "Full Stack Development",
    "Technical Writing",
    "Coding Tutorials",
    "Development Tips",
    "Programming Insights",
    "React Development",
    "Node.js Tutorials",
    "JavaScript Articles",
    "TypeScript Guides",
  ],
  referrer: "origin-when-cross-origin",
  creator: "Shailesh Chaudhari",
  publisher: "Shailesh Chaudhari",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  openGraph: {
    type: "website",
    url: `${SITE_URL}/blogs`,
    title: "Blog | Shailesh Chaudhari - Full Stack Developer Insights",
    description:
      "Dive into web development articles, tutorials, and insights from a Full Stack Developer's perspective.",
    siteName: META_DEFAULTS.siteName,
    images: [
      {
        url: "/Images/shailesh.webp",
        width: 1200,
        height: 630,
        alt: "Shailesh Chaudhari Blog",
      },
    ],
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "Blog | Shailesh Chaudhari - Full Stack Developer",
    description:
      "Read technical articles and development insights from my software engineering journey.",
    images: ["/Images/shailesh.webp"],
    site: META_DEFAULTS.twitterHandle,
    creator: META_DEFAULTS.twitterHandle,
  },
  verification: {
    google: "google-site-verification-code",
    yandex: "yandex-verification-code",
  },
  category: "Technology",
  classification: "Web Development Blog",
  icons: {
    icon: "/Images/shailesh.webp",
    apple: "/Images/shailesh.webp",
  },
};
