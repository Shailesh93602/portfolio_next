import { PROFILE } from "./profile";

export const BLOG_AUTHOR = {
  name: PROFILE.name.full,
  role: PROFILE.role.positioning,
  bio: PROFILE.bio.short,
  avatar: "/Images/shailesh.webp",
  social: {
    twitter: "https://twitter.com/ShaileshWork",
    github: "https://github.com/Shailesh93602",
    linkedin: "https://linkedin.com/in/shaileshbhaichaudhari",
  },
};

export const SEO_KEYWORDS = [
  "Shailesh Chaudhari",
  "Shaileshbhai",
  "Shaileshbhai Chaudhari",
  "Full Stack Developer",
  "Software Engineer",
  "Web Development",
  "Next.js Developer",
  "React Developer",
  "Portfolio",
  "Blog",
];

export const SITE_URL = "https://shaileshchaudhari.vercel.app";

export const BLOG_CATEGORIES = [
  "Web Development",
  "Full Stack",
  "Frontend",
  "Backend",
  "DevOps",
  "Career",
  "Tutorial",
  "Case Study",
];

export const META_DEFAULTS = {
  siteName: "Shailesh Chaudhari's Blog",
  description:
    "Articles and tutorials about web development, software engineering, and tech career by Shailesh Chaudhari",
  locale: "en-US",
  type: "website",
  twitterHandle: "@ShaileshWork",
  twitterCardType: "summary_large_image",
};
