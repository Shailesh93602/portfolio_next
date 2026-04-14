export { metadata } from "./metadata";
import { PortfolioContent } from "./PortfolioContent";
import { SITE_URL } from "@/lib/blog-constants";
import { projects } from "@/constants/projects";

const portfolioSchema = {
  "@context": "https://schema.org",
  "@type": "CollectionPage",
  "@id": `${SITE_URL}/portfolio`,
  url: `${SITE_URL}/portfolio`,
  name: "Portfolio — Shailesh Chaudhari",
  description:
    "Full-stack web development projects by Shailesh Chaudhari including real-time platforms, AI-powered tools, and Chrome extensions.",
  breadcrumb: {
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: SITE_URL },
      {
        "@type": "ListItem",
        position: 2,
        name: "Portfolio",
        item: `${SITE_URL}/portfolio`,
      },
    ],
  },
  hasPart: projects.map((p) => ({
    "@type": "SoftwareApplication",
    name: p.title,
    description: p.description,
    url: p.live ?? `${SITE_URL}/portfolio/${p.id}`,
    applicationCategory: "WebApplication",
    operatingSystem: "Web",
    ...(p.github ? { codeRepository: p.github } : {}),
    author: { "@id": `${SITE_URL}/#person` },
  })),
};

export default function Projects() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(portfolioSchema) }}
      />
      <PortfolioContent />
    </>
  );
}
