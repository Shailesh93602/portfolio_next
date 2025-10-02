import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact Shailesh Chaudhari | Full Stack Developer",
  description:
    "Get in touch with Shailesh Chaudhari, a Full Stack Developer specializing in modern web technologies. Available for project discussions, collaborations, and professional opportunities.",
  alternates: {
    canonical: "https://shaileshchaudhari.vercel.app/contact",
  },
  metadataBase: new URL("https://shaileshchaudhari.vercel.app"),
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
    title: "Contact Shailesh Chaudhari | Full Stack Developer",
    description:
      "Connect with Shailesh Chaudhari for web development projects, collaborations, and professional opportunities. Let's bring your ideas to life!",
    images: [
      {
        url: "https://shaileshchaudhari.vercel.app/Images/image.png",
        width: 1200,
        height: 630,
        alt: "Shailesh Chaudhari Profile",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Contact Shailesh Chaudhari | Full Stack Developer",
    description:
      "Reach out to discuss your next web development project with a passionate Full Stack Developer. Let's create something amazing together!",
    images: ["https://shaileshchaudhari.vercel.app/Images/image.png"],
    site: "@ShaileshWork",
    creator: "@ShaileshWork",
  },
  verification: {
    google: "your-google-verification-code",
  },
  icons: {
    icon: "/Images/image.png",
    apple: "/Images/image.png",
  },
};
