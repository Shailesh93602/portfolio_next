export { metadata } from "./metadata";
import { StatisticsContent } from "./StatisticsContent";
import { SITE_URL } from "@/lib/blog-constants";

const statisticsSchema = {
  "@context": "https://schema.org",
  "@type": "WebPage",
  "@id": `${SITE_URL}/statistics`,
  url: `${SITE_URL}/statistics`,
  name: "Coding Statistics — Shailesh Chaudhari",
  description:
    "GitHub contributions, LeetCode stats, and competitive programming achievements by Shailesh Chaudhari.",
  breadcrumb: {
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: SITE_URL },
      {
        "@type": "ListItem",
        position: 2,
        name: "Statistics",
        item: `${SITE_URL}/statistics`,
      },
    ],
  },
  about: { "@id": `${SITE_URL}/#person` },
};

export default function Statistics() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(statisticsSchema) }}
      />
      <StatisticsContent />
    </>
  );
}
