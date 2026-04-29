export { metadata } from "./metadata";
import HomeContent from "./HomeContent";
import { SITE_URL } from "@/lib/blog-constants";
import { getFeaturedPosts } from "@/lib/blog-data";
import { homeFaq, faqToSchema } from "@/lib/faq-data";
import { FAQSection } from "@/components/FAQSection";

const faqSchema = faqToSchema(homeFaq);

const breadcrumbSchema = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    {
      "@type": "ListItem",
      position: 1,
      name: "Home",
      item: SITE_URL,
    },
  ],
};

export default function Home() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <HomeContent featuredPosts={getFeaturedPosts()} />
      <FAQSection
        title="Frequently asked questions"
        description="The questions recruiters and engineering managers ask most. If yours isn't here, reach out via the contact page."
        items={homeFaq}
      />
    </>
  );
}
