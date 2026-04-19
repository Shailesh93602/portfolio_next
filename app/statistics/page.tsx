export { metadata } from "./metadata";
import { StatisticsContent } from "./StatisticsContent";
import { SITE_URL } from "@/lib/blog-constants";
import { getStatisticsSnapshot } from "@/lib/statistics-snapshot";

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
  // Load committed last-known-good numbers at build time so the SSR HTML
  // includes real contribution counts instead of a loading spinner. The
  // client-side useQuery will still fetch fresh data and override on hydration.
  const snapshot = getStatisticsSnapshot();
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(statisticsSchema) }}
      />
      <StatisticsContent initialData={snapshot} />
    </>
  );
}
