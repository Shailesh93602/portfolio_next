import { Metadata } from "next";

export const metadata: Metadata = {
  metadataBase: new URL("https://shaileshchaudhari.vercel.app"),
  title: "Blog | Shailesh Chaudhari - Full Stack Developer Insights",
  description:
    "Explore technical articles, development insights, and coding tutorials by Shailesh Chaudhari. Learn about web development, MERN stack, and software engineering best practices.",
  applicationName: "Shailesh Chaudhari Portfolio",
  authors: [
    { name: "Shailesh Chaudhari", url: "https://shaileshchaudhari.vercel.app" },
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
  alternates: {
    canonical: "https://shaileshchaudhari.vercel.app/blogs",
  },
  openGraph: {
    type: "website",
    url: "https://shaileshchaudhari.vercel.app/blogs",
    title: "Blog | Shailesh Chaudhari - Full Stack Developer Insights",
    description:
      "Dive into web development articles, tutorials, and insights from a Full Stack Developer's perspective.",
    siteName: "Shailesh Chaudhari Portfolio",
    images: [
      {
        url: "https://shaileshchaudhari.vercel.app/Images/home.webp",
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
    images: ["https://shaileshchaudhari.vercel.app/Images/home.webp"],
    creator: "@ShaileshCoder",
  },
  verification: {
    google: "google-site-verification-code",
    yandex: "yandex-verification-code",
  },
  category: "Technology",
  classification: "Web Development Blog",
};
