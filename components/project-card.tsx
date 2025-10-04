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
      <Card className="bg-dark overflow-hidden hover:shadow-lg transition-shadow duration-300">
        <div className="relative h-48">
          <Image src={image} alt={title} fill className="object-cover" />
        </div>
        <CardContent className="p-6">
          <h3 className="text-xl font-semibold mb-2 text-text-primary">
            {title}
          </h3>
          <p className="text-text-secondary mb-4">{description}</p>

          <div className="flex flex-wrap gap-2 mb-4">
            {tags.map((tag, index) => (
              <span
                key={index}
                className="px-2 py-1 bg-primary/10 text-primary text-sm rounded-full flex items-center gap-1"
              >
                <TagIcon className="w-3 h-3" />
                {tag}
              </span>
            ))}
          </div>

          <div className="flex items-center gap-4">
            {github && (
              <Link href={github} target="_blank" rel="noopener noreferrer">
                  <Button variant="ghost" size="sm" className="text-text-primary">
                  <GithubIcon className="w-4 h-4 mr-2" />
                  GitHub
                </Button>
              </Link>
            )}
            {live && (
              <Link href={live} target="_blank" rel="noopener noreferrer">
                  <Button variant="ghost" size="sm" className="text-text-primary">
                  <ExternalLinkIcon className="w-4 h-4 mr-2" />
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
