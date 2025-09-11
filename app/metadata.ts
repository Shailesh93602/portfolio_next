import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Home | Shailesh Chaudhari",
  description:
    "Welcome to the portfolio of Shailesh Chaudhari, a passionate Full Stack Developer from Gujarat, India. Explore projects, skills, and achievements.",
  openGraph: {
    title: "Home | Shailesh Chaudhari",
    description:
      "Welcome to the portfolio of Shailesh Chaudhari, a passionate Full Stack Developer from Gujarat, India. Explore projects, skills, and achievements.",
    url: "https://shaileshchaudhari.vercel.app/",
    siteName: "Shailesh Chaudhari Portfolio",
    images: [
      {
        url: "/Images/image.png",
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
    images: ["/Images/image.png"],
  },
  icon: "/Images/image.png", 
  apple: "/Images/image.png",
};
