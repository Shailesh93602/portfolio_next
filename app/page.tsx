export { metadata } from "./metadata";
import HomeContent from "./HomeContent";
import { getFeaturedPosts } from "@/lib/blog-data";
import { homeFaq, faqToSchema } from "@/lib/faq-data";
import { FAQSection } from "@/components/FAQSection";

const faqSchema = faqToSchema(homeFaq);

export default function Home() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
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
