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
      <Card className="overflow-hidden p-6">
        {/* Total + window labels reconcile the heatmap against the stat
            cards at the top of /statistics — removes the "is this hardcoded?"
            ambiguity a recruiter has when scanning the page. */}
        <div className="mb-4 flex flex-wrap items-baseline justify-between gap-2">
          <h3 className="text-lg font-semibold">Contribution Activity</h3>
          <p className="text-sm text-muted-foreground">
            Last 365 days &middot; Total:{" "}
            <span className="font-medium text-foreground">
              {contributionData
                .reduce((a, d) => a + d.count, 0)
                .toLocaleString("en-US")}
            </span>{" "}
            contributions
          </p>
        </div>
        <CardContent className="p-0">
          <div className="overflow-x-auto pb-2">
            <div className="flex flex-col gap-2">
              <div className="mb-2 flex justify-between text-xs font-medium text-foreground">
                <span>Less</span>
                <div className="flex gap-1.5">
                  <span className="h-3.5 w-3.5 rounded-sm border border-gray-200 bg-primary/10 dark:border-gray-700 dark:bg-primary/5"></span>
                  <span className="h-3.5 w-3.5 rounded-sm border border-gray-200 bg-primary/30 dark:border-gray-700 dark:bg-primary/25"></span>
                  <span className="h-3.5 w-3.5 rounded-sm border border-gray-200 bg-primary/50 dark:border-gray-700 dark:bg-primary/45"></span>
                  <span className="h-3.5 w-3.5 rounded-sm border border-gray-200 bg-primary/70 dark:border-gray-700 dark:bg-primary/65"></span>
                  <span className="h-3.5 w-3.5 rounded-sm border border-gray-200 bg-primary/90 dark:border-gray-700 dark:bg-primary/85"></span>
                </div>
                <span>More</span>
              </div>

              {/* Display month labels */}
              <div className="mb-2 flex">
                <div className="flex w-full justify-between text-xs font-medium text-foreground">
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
                          className={`h-3.5 w-3.5 rounded-sm ${getColorByLevel(
                            day.level
                          )} border border-gray-200 transition-all duration-200 hover:scale-110 hover:ring-2 hover:ring-primary dark:border-gray-700`}
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
