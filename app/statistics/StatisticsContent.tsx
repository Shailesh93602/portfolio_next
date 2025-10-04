"use client";

import React from "react";
import { Card } from "@/components/ui/card";
import {
  GitHubLogoIcon,
  RocketIcon,
  LayersIcon,
  CommitIcon,
  CodeIcon,
  CheckCircledIcon,
  LightningBoltIcon,
  TimerIcon,
  CalendarIcon,
} from "@radix-ui/react-icons";
import { TrophyIcon, AwardIcon, StarIcon } from "@/components/icons";
import { Skeleton } from "@/components/ui/skeleton";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import dynamic from "next/dynamic";
const StatsCharts = dynamic(
  () => import("@/components/stats-charts").then((mod) => mod.StatsCharts),
  { ssr: false }
);
import { Badge } from "@/components/ui/badge";
import { GitHubLanguages } from "@/components/github-languages";
import { GitHubContributionHeatmap } from "@/components/github-contribution-heatmap";

const StatCard = ({
  label,
  value,
  icon: Icon,
  color = "bg-primary/10",
  textColor = "text-primary",
}: {
  label: string;
  value: string;
  icon: React.ElementType;
  color?: string;
  textColor?: string;
}) => (
  <div className="relative transition-transform duration-200 hover:scale-[1.02] active:scale-[0.98]">
    <Card
      className={`p-5 backdrop-blur-sm border hover:border-primary/50 transition-all duration-300 overflow-hidden ${color}`}
    >
      <div className="flex items-center justify-between relative z-10">
        <div>
          <p className="text-sm font-medium text-muted-foreground">{label}</p>
          <h3 className={`text-xl font-bold mt-1 ${textColor}`}>{value}</h3>
        </div>
        <div className="p-2.5 rounded-full bg-background/80">
          <Icon className="w-5 h-5" />
        </div>
      </div>
    </Card>
  </div>
);

const PlatformSection = ({
  title,
  icon: Icon,
  children,
  className = "",
}: {
  title: string;
  icon?: React.ElementType;
  children: React.ReactNode;
  className?: string;
}) => (
  <div className={`mb-12 ${className} transition-opacity duration-500`}>
    <h2 className="text-2xl font-bold tracking-tight mb-6 flex items-center gap-2">
      {Icon && <Icon className="w-6 h-6" />}
      {title}
    </h2>
    <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 w-full max-w-6xl mx-auto">
      {children}
    </div>
  </div>
);

export function StatisticsContent() {
  const [showTimeoutMessage, setShowTimeoutMessage] = React.useState(false);

  const {
    data: stats,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["stats"],
    queryFn: async () => {
      const response = await axios.get("/api/statistics");
      return response.data;
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 2,
    retryDelay: 1000,
  });

  // Show timeout message after 10 seconds
  React.useEffect(() => {
    const timer = setTimeout(() => {
      if (isLoading) {
        setShowTimeoutMessage(true);
      }
    }, 10000);

    return () => clearTimeout(timer);
  }, [isLoading]);

  // Transform GitHub contributions data for heatmap
  const contributionHeatmapData = React.useMemo(() => {
    if (!stats?.github?.contributionDays) return [];

    return stats.github.contributionDays.map(
      (day: { date: string; contributionCount: number }) => {
        // Determine level based on count
        let level: 0 | 1 | 2 | 3 | 4 = 0;
        if (day.contributionCount > 0) level = 1;
        if (day.contributionCount >= 3) level = 2;
        if (day.contributionCount >= 5) level = 3;
        if (day.contributionCount >= 10) level = 4;

        return {
          date: day.date,
          count: day.contributionCount,
          level,
        };
      }
    );
  }, [stats?.github?.contributionDays]);

  // Transform LeetCode submission calendar data for heatmap
  const leetcodeHeatmapData = React.useMemo(() => {
    if (!stats?.leetcode?.submissionCalendar) return [];

    const submissionCalendar = stats.leetcode.submissionCalendar;
    const result: { date: string; count: number; level: 0 | 1 | 2 | 3 | 4 }[] =
      [];

    // Convert Unix timestamps (in seconds) to dates and counts
    Object.entries(submissionCalendar).forEach(([timestamp, count]) => {
      // Convert timestamp to date string (YYYY-MM-DD format)
      const date = new Date(parseInt(timestamp) * 1000)
        .toISOString()
        .split("T")[0];
      const submissions =
        typeof count === "number" ? count : parseInt(count as string);

      // Determine level based on count (similar to GitHub levels)
      let level: 0 | 1 | 2 | 3 | 4 = 0;
      if (submissions > 0) level = 1;
      if (submissions >= 3) level = 2;
      if (submissions >= 5) level = 3;
      if (submissions >= 10) level = 4;

      result.push({
        date,
        count: submissions,
        level,
      });
    });

    // Sort by date
    return result.sort((a, b) => a.date.localeCompare(b.date));
  }, [stats?.leetcode?.submissionCalendar]);

  return (
    <div className="container mx-auto px-4 py-16">
      <div className="text-center mb-16 transition-transform duration-500">
        <h1 className="text-5xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/70">
          Coding Statistics
        </h1>
        <p className="text-muted-foreground max-w-2xl mx-auto mb-6 text-lg">
          A comprehensive overview of my coding journey and achievements across
          various platforms.
        </p>
        <div className="flex flex-wrap justify-center gap-2">
          <Badge
            variant="outline"
            className="text-sm px-3 py-1 border-primary/30"
          >
            <RocketIcon className="w-3 h-3 mr-1" /> Active Developer
          </Badge>
          <Badge
            variant="outline"
            className="text-sm px-3 py-1 border-primary/30"
          >
            <LayersIcon className="w-3 h-3 mr-1" /> Full Stack
          </Badge>
          <Badge
            variant="outline"
            className="text-sm px-3 py-1 border-primary/30"
          >
            <CommitIcon className="w-3 h-3 mr-1" /> Open Source
          </Badge>
        </div>
      </div>

      <div className="space-y-16 max-w-6xl mx-auto">
        {/* Loading State */}
        {isLoading && (
          <div className="text-center py-16 transition-opacity duration-500">
            <div className="inline-flex items-center gap-3 text-muted-foreground">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
              <span>Loading your coding statistics...</span>
            </div>
            <p className="text-sm text-muted-foreground mt-2">
              This may take a few moments as we fetch data from multiple
              platforms.
            </p>
            {showTimeoutMessage && (
              <div className="mt-4 p-3 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-md">
                <p className="text-yellow-800 dark:text-yellow-200 text-sm">
                  ⏰ Taking longer than expected? The external APIs might be
                  slow. Please wait...
                </p>
              </div>
            )}
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="text-center py-16 transition-opacity duration-500">
            <div className="inline-flex items-center gap-3 text-red-500">
              <span>❌ Error loading statistics</span>
            </div>
            <p className="text-sm text-muted-foreground mt-2">
              Unable to fetch data at the moment. Please try refreshing the
              page.
            </p>
          </div>
        )}

        {/* GitHub Contribution Heatmap */}
        {!isLoading && contributionHeatmapData.length > 0 && (
          <GitHubContributionHeatmap
            contributionData={contributionHeatmapData}
          />
        )}

        {/* GitHub Section */}
        <PlatformSection
          title="GitHub Statistics"
          icon={GitHubLogoIcon}
        >
          {isLoading ? (
            <div className="col-span-4 grid grid-cols-2 md:grid-cols-4 gap-4">
              {Array(8)
                .fill(0)
                .map((_, i) => (
                  <Skeleton key={i} className="h-24 w-full" />
                ))}
            </div>
          ) : (
            <>
              <div className="col-span-4 grid grid-cols-2 md:grid-cols-4 gap-4">
                <StatCard
                  label="Repositories"
                  value={stats?.github?.repositories || "0"}
                  icon={GitHubLogoIcon}
                  color="bg-gradient-to-br from-blue-500/10 to-blue-600/5"
                  textColor="text-blue-500"
                />
                <StatCard
                  label="Followers"
                  value={stats?.github?.followers || "0"}
                  icon={RocketIcon}
                  color="bg-gradient-to-br from-pink-500/10 to-pink-600/5"
                  textColor="text-pink-500"
                />
                <StatCard
                  label="Total PRs"
                  value={stats?.github?.totalPRs || "0"}
                  icon={CommitIcon}
                  color="bg-gradient-to-br from-green-500/10 to-green-600/5"
                  textColor="text-green-500"
                />
                <StatCard
                  label="Total Commits"
                  value={stats?.github?.totalCommits || "0"}
                  icon={CommitIcon}
                  color="bg-gradient-to-br from-indigo-500/10 to-indigo-600/5"
                  textColor="text-indigo-500"
                />
                <StatCard
                  label="Longest Streak"
                  value={`${stats?.github?.longestStreak?.count || "0"} days`}
                  icon={CalendarIcon}
                  color="bg-gradient-to-br from-orange-500/10 to-orange-600/5"
                  textColor="text-orange-500"
                />
              </div>

              {/* Languages Chart */}
              {stats?.github?.languages?.length > 0 && (
                <div className="col-span-4 mt-6">
                  <Card className="p-6 border-primary/20">
                    <h3 className="text-lg font-semibold mb-4">
                      Language Distribution
                    </h3>
                    <GitHubLanguages languages={stats.github.languages} />
                  </Card>
                </div>
              )}
            </>
          )}
        </PlatformSection>

        {/* LeetCode Section */}
        <PlatformSection
          title="LeetCode Statistics"
          icon={CodeIcon}
        >
          {/* LeetCode Contribution Heatmap */}
          {!isLoading && leetcodeHeatmapData.length > 0 && (
            <div className="col-span-4 mb-6">
              <Card className="p-6 overflow-hidden">
                <h3 className="text-lg font-semibold mb-4">
                  LeetCode Submission Activity
                </h3>
                <GitHubContributionHeatmap
                  contributionData={leetcodeHeatmapData}
                />
              </Card>
            </div>
          )}
          {isLoading ? (
            <div className="col-span-4 grid grid-cols-2 md:grid-cols-4 gap-4">
              {Array(8)
                .fill(0)
                .map((_, i) => (
                  <Skeleton key={i} className="h-24 w-full" />
                ))}
            </div>
          ) : (
            <>
              <div className="col-span-4 grid grid-cols-2 md:grid-cols-4 gap-4">
                <StatCard
                  label="Total Solved"
                  value={stats?.leetcode?.totalSolved || "0"}
                  icon={CheckCircledIcon}
                  color="bg-gradient-to-br from-green-500/10 to-green-600/5"
                  textColor="text-green-500"
                />
                <StatCard
                  label="Easy Solved"
                  value={stats?.leetcode?.easySolved || "0"}
                  icon={CheckCircledIcon}
                  color="bg-gradient-to-br from-emerald-500/10 to-emerald-600/5"
                  textColor="text-emerald-500"
                />
                <StatCard
                  label="Medium Solved"
                  value={stats?.leetcode?.mediumSolved || "0"}
                  icon={CheckCircledIcon}
                  color="bg-gradient-to-br from-yellow-500/10 to-yellow-600/5"
                  textColor="text-yellow-500"
                />
                <StatCard
                  label="Hard Solved"
                  value={stats?.leetcode?.hardSolved || "0"}
                  icon={CheckCircledIcon}
                  color="bg-gradient-to-br from-red-500/10 to-red-600/5"
                  textColor="text-red-500"
                />
                <StatCard
                  label="Global Ranking"
                  value={`#${stats?.leetcode?.ranking || "N/A"}`}
                  icon={TrophyIcon}
                  color="bg-gradient-to-br from-purple-500/10 to-purple-600/5"
                  textColor="text-purple-500"
                />
                <StatCard
                  label="Reputation"
                  value={stats?.leetcode?.reputation || "0"}
                  icon={AwardIcon}
                  color="bg-gradient-to-br from-blue-500/10 to-blue-600/5"
                  textColor="text-blue-500"
                />
                <StatCard
                  label="Contribution Points"
                  value={stats?.leetcode?.contributionPoint || "0"}
                  icon={StarIcon}
                  color="bg-gradient-to-br from-amber-500/10 to-amber-600/5"
                  textColor="text-amber-500"
                />
                {/* Acceptance Rate section removed as requested */}
              </div>

              <div className="col-span-4 grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
                <StatCard
                  label="Current Streak"
                  value={`${stats?.leetcode?.currentStreak?.count || "0"} days`}
                  icon={LightningBoltIcon}
                  color="bg-gradient-to-br from-orange-500/10 to-orange-600/5"
                  textColor="text-orange-500"
                />
                <StatCard
                  label="Longest Streak"
                  value={`${stats?.leetcode?.longestStreak?.count || "0"} days`}
                  icon={CalendarIcon}
                  color="bg-gradient-to-br from-rose-500/10 to-rose-600/5"
                  textColor="text-rose-500"
                />
                <StatCard
                  label="Active Years"
                  value={stats?.leetcode?.activeYears?.length || "0"}
                  icon={CalendarIcon}
                  color="bg-gradient-to-br from-indigo-500/10 to-indigo-600/5"
                  textColor="text-indigo-500"
                />
                <StatCard
                  label="Total Active Days"
                  value={stats?.leetcode?.totalActiveDays || "0"}
                  icon={TimerIcon}
                  color="bg-gradient-to-br from-violet-500/10 to-violet-600/5"
                  textColor="text-violet-500"
                />
              </div>
            </>
          )}
        </PlatformSection>

        {/* Achievement Metrics section removed as requested */}

        {/* Statistics Charts */}
        {!isLoading && (
          <div className="mb-16">
            <StatsCharts
              githubContributions={
                stats?.github?.contributionDays?.map(
                  (day: { contributionCount: number }) => day.contributionCount
                ) || []
              }
              leetcodeProblemStats={{
                easy: stats?.leetcode?.easySolved || 0,
                medium: stats?.leetcode?.mediumSolved || 0,
                hard: stats?.leetcode?.hardSolved || 0,
              }}
            />
          </div>
        )}
      </div>
    </div>
  );
}
