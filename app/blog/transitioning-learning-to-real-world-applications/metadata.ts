import { Metadata } from "next";
import { BLOG_AUTHOR, SEO_KEYWORDS, SITE_URL } from "@/lib/blog-constants";

export const metadata: Metadata = {
  title: "Transitioning from Learning to Building Real-World Applications | Shailesh Chaudhari",
  description: "Join Shailesh Chaudhari as he shares his journey of transitioning from theoretical learning to building production-ready applications. Learn practical strategies for applying academic knowledge in real-world scenarios.",
  keywords: [
    ...SEO_KEYWORDS,
    "learning to real world applications",
    "academic to professional development",
    "software engineering transition",
    "production ready applications",
    "full stack development journey",
    "career transition software engineer",
    "Shailesh Chaudhari",
    "Shaileshbhai",
    "Shaileshbhai Chaudhari",
    "Shailesh",
  ],
  authors: [{ name: BLOG_AUTHOR.name }],
  openGraph: {
    title: "Transitioning from Learning to Building Real-World Applications | Shailesh Chaudhari",
    description: "Join Shailesh Chaudhari as he shares his journey of transitioning from theoretical learning to building production-ready applications. Learn practical strategies for applying academic knowledge in real-world scenarios.",
    type: "article",
    url: `${SITE_URL}/blog/transitioning-learning-to-real-world-applications`,
    images: [
      {
        url: `${SITE_URL}/Images/gecSportify.png`,
        width: 1200,
        height: 630,
        alt: "Shailesh Chaudhari's Journey from Learning to Real-World Applications",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Transitioning from Learning to Building Real-World Applications",
    description: "Join Shailesh Chaudhari as he shares his journey of transitioning from theoretical learning to building production-ready applications. Learn practical strategies for applying academic knowledge in real-world scenarios.",
    creator: "@shailesh93602",
  },
};