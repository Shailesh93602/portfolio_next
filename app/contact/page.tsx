export { metadata } from "./metadata";
import { ContactContent } from "./ContactContent";
import { SITE_URL, BLOG_AUTHOR } from "@/lib/blog-constants";
import { CONTACT_INFO } from "@/lib/constants";

const contactPageSchema = {
  "@context": "https://schema.org",
  "@type": "ContactPage",
  "@id": `${SITE_URL}/contact`,
  url: `${SITE_URL}/contact`,
  name: `Contact ${BLOG_AUTHOR.name}`,
  description:
    "Get in touch with Shailesh Chaudhari for web development projects, collaborations, and opportunities.",
  breadcrumb: {
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: SITE_URL },
      {
        "@type": "ListItem",
        position: 2,
        name: "Contact",
        item: `${SITE_URL}/contact`,
      },
    ],
  },
  mainEntity: {
    "@type": "Person",
    "@id": `${SITE_URL}/#person`,
    email: CONTACT_INFO.EMAIL,
    telephone: CONTACT_INFO.PHONE,
  },
};

export default function Contact() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(contactPageSchema) }}
      />
      <ContactContent />
    </>
  );
}
