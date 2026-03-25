import React from "react";
import Image from "next/image";
import Link from "next/link";
// framer-motion removed to reduce initial bundle size; use CSS transitions instead
import { GithubIcon, ExternalLinkIcon, TagIcon } from "@/components/icons";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface ProjectCardProps {
  title: string;
  description: string;
  image: string;
  tags: string[];
  github?: string;
  live?: string;
  showDetails?: boolean;
  onShowDetails?: () => void;
}

export function ProjectCard({
  title,
  description,
  image,
  tags,
  github,
  live,
  showDetails,
  onShowDetails,
}: ProjectCardProps) {
  return (
    <div className="transition-transform duration-500 ease-out will-change-transform">
      <Card className="bg-dark overflow-hidden transition-shadow duration-300 hover:shadow-lg">
        <div className="relative h-48">
          <Image src={image} alt={title} fill className="object-cover" />
        </div>
        <CardContent className="p-6">
          <h3 className="text-text-primary mb-2 text-xl font-semibold">
            {title}
          </h3>
          <p className="text-text-secondary mb-4">{description}</p>

          <div className="mb-4 flex flex-wrap gap-2">
            {tags.map((tag, index) => (
              <span
                key={index}
                className="flex items-center gap-1 rounded-full bg-primary/10 px-2 py-1 text-sm text-primary"
              >
                <TagIcon className="h-3 w-3" />
                {tag}
              </span>
            ))}
          </div>

          <div className="flex items-center gap-4">
            {github && (
              <Link href={github} target="_blank" rel="noopener noreferrer">
                <Button variant="ghost" size="sm" className="text-text-primary">
                  <GithubIcon className="mr-2 h-4 w-4" />
                  GitHub
                </Button>
              </Link>
            )}
            {live && (
              <Link href={live} target="_blank" rel="noopener noreferrer">
                <Button variant="ghost" size="sm" className="text-text-primary">
                  <ExternalLinkIcon className="mr-2 h-4 w-4" />
                  Live Demo
                </Button>
              </Link>
            )}
            {onShowDetails && (
              <Button
                variant="ghost"
                size="sm"
                className="text-text-primary"
                onClick={onShowDetails}
              >
                {showDetails ? "Show Less" : "Show More"}
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
