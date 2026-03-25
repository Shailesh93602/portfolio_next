"use client";

import React from "react";
import { Card, CardContent } from "@/components/ui/card";

interface Language {
  name: string;
  percentage: number;
  color: string;
}

interface GitHubLanguagesProps {
  languages: Language[];
}

export function GitHubLanguages({ languages }: GitHubLanguagesProps) {
  // Filter out languages with 0% usage
  const filteredLanguages = languages.filter((lang) => lang.percentage > 0);

  return (
    <Card className="border-border bg-card">
      <CardContent className="pt-6">
        <div className="space-y-4">
          <div className="flex h-2 w-full overflow-hidden rounded-full">
            {filteredLanguages.map((lang) => (
              <div
                key={lang.name}
                style={{
                  width: `${lang.percentage}%`,
                  backgroundColor: lang.color,
                }}
                className="h-full transition-all duration-300 hover:opacity-80"
              />
            ))}
          </div>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-5">
            {filteredLanguages.map((lang) => (
              <div key={lang.name} className="flex items-center gap-2">
                <div
                  className="h-3 w-3 rounded-full"
                  style={{ backgroundColor: lang.color }}
                />
                <span className="text-sm">
                  {lang.name} ({lang.percentage}%)
                </span>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
