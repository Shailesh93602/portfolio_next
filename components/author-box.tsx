"use client";

import React from "react";
// Link not needed here; author box is a simple presentational component
import { TwitterIcon, GithubIcon, LinkedinIcon } from "@/components/icons";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";

export interface Author {
  name: string;
  avatar: string;
  bio?: string;
  role?: string;
  social?: {
    twitter?: string;
    github?: string;
    linkedin?: string;
  };
}

interface AuthorBoxProps {
  author: Author;
  compact?: boolean; // smaller layout for footer
  showBio?: boolean; // show bio text
}

export default function AuthorBox({ author, compact, showBio = false }: AuthorBoxProps) {
  return (
    <div className={`flex ${compact ? 'items-center gap-3' : 'flex-col gap-4'}`}>
      <div className={`flex items-center ${compact ? '' : 'gap-4'}`}>
        <Avatar className={compact ? 'h-10 w-10' : 'h-16 w-16 border-2 border-primary/20'}>
          <AvatarImage src={author.avatar} alt={author.name} />
          <AvatarFallback>{(author.name || 'A').split(' ').map(n=>n[0]).slice(0,2).join('')}</AvatarFallback>
        </Avatar>

        <div className={compact ? '' : ''}>
          <div className="font-medium">{author.name ? `Written by ${author.name}` : 'Written by'}</div>
          {author.role && <div className="text-sm text-muted-foreground">{author.role}</div>}
        </div>
      </div>

      {showBio && author.bio && (
        <p className="text-sm text-muted-foreground leading-relaxed">{author.bio}</p>
      )}

      {!compact && (
        <div className="flex gap-3">
          {author.social?.twitter && (
            <a href={author.social.twitter} target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary transition-colors p-2 rounded-lg hover:bg-primary/10">
              <TwitterIcon className="w-5 h-5" />
            </a>
          )}
          {author.social?.github && (
            <a href={author.social.github} target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary transition-colors p-2 rounded-lg hover:bg-primary/10">
              <GithubIcon className="w-5 h-5" />
            </a>
          )}
          {author.social?.linkedin && (
            <a href={author.social.linkedin} target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary transition-colors p-2 rounded-lg hover:bg-primary/10">
              <LinkedinIcon className="w-5 h-5" />
            </a>
          )}
        </div>
      )}
    </div>
  );
}
