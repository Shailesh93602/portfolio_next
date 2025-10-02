"use client";

import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { X } from "lucide-react";

interface BlogFiltersProps {
  searchQuery: string;
  selectedTag: string;
  tags: string[];
  onSearchChange: (value: string) => void;
  onTagChange: (value: string) => void;
  onClearFilters: () => void;
}

export function BlogFilters({
  searchQuery,
  selectedTag,
  tags,
  onSearchChange,
  onTagChange,
  onClearFilters,
}: BlogFiltersProps) {
  const hasActiveFilters = Boolean(searchQuery || selectedTag);

  return (
    <div className="w-full bg-card/50 backdrop-blur-sm border border-border/50 rounded-xl p-6">
      <div className="space-y-4">
        <Input
          placeholder="Search posts..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="bg-background/50 border-border/50 focus:border-primary/50 transition-colors"
        />

        <div className="flex flex-wrap gap-2">
          <Badge
            variant={selectedTag === "" ? "default" : "outline"}
            className="cursor-pointer transition-colors hover:bg-primary/10"
            onClick={() => onTagChange("")}
          >
            All Tags
          </Badge>
          {tags.map((tag) => (
            <Badge
              key={tag}
              variant={selectedTag === tag ? "default" : "outline"}
              className="cursor-pointer transition-colors hover:bg-primary/10"
              onClick={() => onTagChange(tag)}
            >
              {tag}
            </Badge>
          ))}
        </div>

        {hasActiveFilters && (
          <button
            onClick={onClearFilters}
            className="mt-3 md:mt-0 md:ml-2 inline-flex items-center gap-2 px-3 py-2 rounded-md text-sm bg-muted/10 hover:bg-muted/20"
          >
            <X className="w-4 h-4" />
            Clear
          </button>
        )}
      </div>

      <div className="mt-3 flex flex-wrap gap-2 items-center">
        <span className="text-sm text-muted-foreground mr-2">Popular:</span>
        {tags.slice(0, 8).map((tag) => (
          <Badge
            key={tag}
            variant={selectedTag === tag ? "default" : "secondary"}
            className="cursor-pointer text-xs"
            onClick={() => onTagChange(selectedTag === tag ? "" : tag)}
          >
            {tag}
          </Badge>
        ))}
      </div>
    </div>
  );
}