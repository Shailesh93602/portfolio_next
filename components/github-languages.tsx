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
  return (
    <Card className="bg-card border-border">
      <CardContent className="pt-6">
        <div className="space-y-4">
          <div className="h-2 w-full flex rounded-full overflow-hidden">
            {languages.map((lang) => (
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
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
            {languages.map((lang) => (
              <div key={lang.name} className="flex items-center gap-2">
                <div
                  className="w-3 h-3 rounded-full"
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
