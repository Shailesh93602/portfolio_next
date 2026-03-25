"use client";

import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { XIcon } from "@/components/icons";

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
    <div className="w-full rounded-xl border border-border/50 bg-card/50 p-6 backdrop-blur-sm">
      <div className="space-y-4">
        <Input
          placeholder="Search posts..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="border-border/50 bg-background/50 transition-colors focus:border-primary/50"
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
            className="mt-3 inline-flex items-center gap-2 rounded-md bg-muted/10 px-3 py-2 text-sm hover:bg-muted/20 md:ml-2 md:mt-0"
          >
            <XIcon className="h-4 w-4" />
            Clear
          </button>
        )}
      </div>

      <div className="mt-3 flex flex-wrap items-center gap-2">
        <span className="mr-2 text-sm text-muted-foreground">Popular:</span>
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
