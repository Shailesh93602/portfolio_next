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

  return <ProjectDetailContent project={project} />;
}
