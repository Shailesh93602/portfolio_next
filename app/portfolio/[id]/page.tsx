import { projects } from "@/constants/projects";
import ProjectDetailContent from "./ProjectDetailContent";
import { notFound } from "next/navigation";
import { Metadata } from "next";
import { SITE_URL, META_DEFAULTS } from "@/lib/blog-constants";

interface Props {
  params: Promise<{ id: string }>;
}

export async function generateStaticParams() {
  return projects.map((project) => ({
    id: project.id,
  }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const project = projects.find((p) => p.id === id);

  if (!project) {
    return {
      title: "Project Not Found",
    };
  }

  const title = `${project.title} | Shailesh Chaudhary`;
  const description = project.description;
  const ogImageUrl = `${SITE_URL}/api/og?title=${encodeURIComponent(project.title)}&type=project&description=${encodeURIComponent(description.slice(0, 120))}`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: "website",
      url: `${SITE_URL}/portfolio/${id}`,
      images: [
        {
          url: ogImageUrl,
          width: 1200,
          height: 630,
          alt: project.title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      site: META_DEFAULTS.twitterHandle,
      creator: META_DEFAULTS.twitterHandle,
      images: [ogImageUrl],
    },
    alternates: {
      canonical: `${SITE_URL}/portfolio/${id}`,
    },
  };
}

export default async function ProjectPage({ params }: Props) {
  const { id } = await params;
  const project = projects.find((p) => p.id === id);

  if (!project) {
    notFound();
  }

  const ogImageUrl = `${SITE_URL}/api/og?title=${encodeURIComponent(project.title)}&type=project&description=${encodeURIComponent(project.description.slice(0, 120))}`;

  // SoftwareApplication schema — surfaces project as a rich entity in Google
  // and gives LLM crawlers (ChatGPT/Perplexity/Claude) structured facts to
  // attribute to Shailesh Chaudhari rather than guess.
  const softwareSchema = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "@id": `${SITE_URL}/portfolio/${id}#software`,
    name: project.title,
    description: project.description,
    applicationCategory: "DeveloperApplication",
    operatingSystem: "Web",
    url: project.live || `${SITE_URL}/portfolio/${id}`,
    image: ogImageUrl,
    ...(project.github ? { codeRepository: project.github } : {}),
    author: { "@id": `${SITE_URL}/#person` },
    creator: { "@id": `${SITE_URL}/#person` },
    offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
    ...(project.techStack && project.techStack.length > 0
      ? { keywords: project.techStack.join(", ") }
      : { keywords: project.tags.join(", ") }),
  };

  // BreadcrumbList — Google uses this for the search result breadcrumb trail.
  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: SITE_URL },
      {
        "@type": "ListItem",
        position: 2,
        name: "Portfolio",
        item: `${SITE_URL}/portfolio`,
      },
      {
        "@type": "ListItem",
        position: 3,
        name: project.title,
        item: `${SITE_URL}/portfolio/${id}`,
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(softwareSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <ProjectDetailContent project={project} />
    </>
  );
}
