import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About | Shailesh Chaudhari",
  description:
    "Learn more about Shailesh Chaudhari, a passionate Full Stack Developer from Gujarat, India. Discover his experience, achievements, skills, and hobbies.",
  alternates: {
    canonical: "https://shaileshchaudhari.vercel.app/about",
  },
  openGraph: {
    title: "About | Shailesh Chaudhari",
    description:
      "Learn more about Shailesh Chaudhari, a passionate Full Stack Developer from Gujarat, India. Discover his experience, achievements, skills, and hobbies.",
    url: "https://shaileshchaudhari.vercel.app/about",
    siteName: "Shailesh Chaudhari Portfolio",
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
  },
   icons: {
  icon: "/Images/shailesh.webp", 
  apple: "/Images/shailesh.webp",
  },
};
