"use client";

import React from "react";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Tooltip } from "@/components/ui/tooltip";
import { format } from "date-fns";

interface ContributionDay {
  date: string;
  count: number;
  level: 0 | 1 | 2 | 3 | 4;
}

interface GitHubContributionHeatmapProps {
  contributionData: ContributionDay[];
}

export function GitHubContributionHeatmap({
  contributionData,
}: GitHubContributionHeatmapProps) {
  // Group contributions by week
  const weeks: ContributionDay[][] = [];
  let currentWeek: ContributionDay[] = [];

  contributionData.forEach((day, index) => {
    currentWeek.push(day);
    if (currentWeek.length === 7 || index === contributionData.length - 1) {
      weeks.push([...currentWeek]);
      currentWeek = [];
    }
  });

  // Get color based on contribution level with improved visibility
  const getColorByLevel = (level: number) => {
    switch (level) {
      case 0:
        return "bg-primary/10 dark:bg-primary/5";
      case 1:
        return "bg-primary/30 dark:bg-primary/25";
      case 2:
        return "bg-primary/50 dark:bg-primary/45";
      case 3:
        return "bg-primary/70 dark:bg-primary/65";
      case 4:
        return "bg-primary/90 dark:bg-primary/85";
      default:
        return "bg-primary/10 dark:bg-primary/5";
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Card className="p-6 overflow-hidden">
        <h3 className="text-lg font-semibold mb-4">Contribution Activity</h3>
        <CardContent className="p-0">
          <div className="overflow-x-auto pb-2">
            <div className="flex flex-col gap-2">
              <div className="flex justify-between text-xs text-foreground font-medium mb-2">
                <span>Less</span>
                <div className="flex gap-1.5">
                  <span className="w-3.5 h-3.5 rounded-sm bg-primary/10 dark:bg-primary/5 border border-gray-200 dark:border-gray-700"></span>
                  <span className="w-3.5 h-3.5 rounded-sm bg-primary/30 dark:bg-primary/25 border border-gray-200 dark:border-gray-700"></span>
                  <span className="w-3.5 h-3.5 rounded-sm bg-primary/50 dark:bg-primary/45 border border-gray-200 dark:border-gray-700"></span>
                  <span className="w-3.5 h-3.5 rounded-sm bg-primary/70 dark:bg-primary/65 border border-gray-200 dark:border-gray-700"></span>
                  <span className="w-3.5 h-3.5 rounded-sm bg-primary/90 dark:bg-primary/85 border border-gray-200 dark:border-gray-700"></span>
                </div>
                <span>More</span>
              </div>

              {/* Display month labels */}
              <div className="flex mb-2">
                <div className="flex justify-between w-full text-xs text-foreground font-medium">
                  <span>Jan</span>
                  <span>Feb</span>
                  <span>Mar</span>
                  <span>Apr</span>
                  <span>May</span>
                  <span>Jun</span>
                  <span>Jul</span>
                  <span>Aug</span>
                  <span>Sep</span>
                  <span>Oct</span>
                  <span>Nov</span>
                  <span>Dec</span>
                </div>
              </div>

              <div className="flex gap-1.5">
                {weeks.map((week, weekIndex) => (
                  <div key={weekIndex} className="flex flex-col gap-1.5">
                    {week.map((day, dayIndex) => (
                      <Tooltip
                        key={dayIndex}
                        content={
                          <div className="text-xs font-medium">
                            <div className="text-foreground">
                              {format(new Date(day.date), "MMM d, yyyy")}
                            </div>
                            <div className="text-primary">
                              {day.count} contributions
                            </div>
                          </div>
                        }
                      >
                        <div
                          className={`w-3.5 h-3.5 rounded-sm ${getColorByLevel(
                            day.level
                          )} hover:ring-2 hover:ring-primary hover:scale-110 transition-all duration-200 border border-gray-200 dark:border-gray-700`}
                        />
                      </Tooltip>
                    ))}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
