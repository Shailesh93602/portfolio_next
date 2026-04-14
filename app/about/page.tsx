export { metadata } from "./metadata";
import AboutContent from "./AboutContent";
import { SITE_URL, BLOG_AUTHOR } from "@/lib/blog-constants";

const profilePageSchema = {
  "@context": "https://schema.org",
  "@type": "ProfilePage",
  "@id": `${SITE_URL}/about`,
  url: `${SITE_URL}/about`,
  name: `About ${BLOG_AUTHOR.name}`,
  breadcrumb: {
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: SITE_URL },
      {
        "@type": "ListItem",
        position: 2,
        name: "About",
        item: `${SITE_URL}/about`,
      },
    ],
  },
  mainEntity: {
    "@id": `${SITE_URL}/#person`,
  },
};

export default function About() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(profilePageSchema) }}
      />
      <AboutContent />
    </>
  );
}
