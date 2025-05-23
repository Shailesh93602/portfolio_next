import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Home | Shailesh Chaudhari",
  description:
    "Welcome to the portfolio of Shailesh Chaudhari, a passionate Full Stack Developer from Gujarat, India. Explore projects, skills, and achievements.",
  openGraph: {
    title: "Home | Shailesh Chaudhari",
    description:
      "Welcome to the portfolio of Shailesh Chaudhari, a passionate Full Stack Developer from Gujarat, India. Explore projects, skills, and achievements.",
    url: "https://yourdomain.com/",
    siteName: "Shailesh Chaudhari Portfolio",
    images: [
      {
        url: "/Images/home.webp",
        width: 1200,
        height: 630,
        alt: "Shailesh Chaudhari Profile Picture",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Home | Shailesh Chaudhari",
    description:
      "Welcome to the portfolio of Shailesh Chaudhari, a passionate Full Stack Developer from Gujarat, India. Explore projects, skills, and achievements.",
    images: ["/Images/home.webp"],
  },
};
