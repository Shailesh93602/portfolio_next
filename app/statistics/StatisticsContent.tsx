"use client";

import React from "react";
import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import {
  GitHubLogoIcon,
  CodeIcon,
  StarIcon,
  PersonIcon,
  LightningBoltIcon as StreakIcon,
  RocketIcon,
  LayersIcon,
  CommitIcon,
} from "@radix-ui/react-icons";
import {
  GitFork,
  Trophy,
  GitPullRequest,
  Code2,
  Brain,
  Target,
} from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { StatsCharts } from "@/components/stats-charts";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";

const fadeInUp = {
  initial: { y: 20, opacity: 0 },
  animate: { y: 0, opacity: 1 },
  transition: { duration: 0.5 },
};

const StatCard = ({
  title,
  value,
  icon: Icon,
  color,
}: {
  title: string;
  value: string;
  icon: React.ElementType;
  color: string;
}) => (
  <motion.div
    className="relative"
    whileHover={{ scale: 1.02 }}
    whileTap={{ scale: 0.98 }}
    {...fadeInUp}
  >
    <Card className="p-5 backdrop-blur-sm bg-card/50 border hover:border-primary/50 transition-all duration-300">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-muted-foreground">{title}</p>
          <h3 className="text-xl font-bold mt-1">{value}</h3>
        </div>
        <div className={`p-2.5 rounded-full ${color}`}>
          <Icon className="w-5 h-5" />
        </div>
      </div>
    </Card>
  </motion.div>
);

const PlatformSection = ({
  title,
  children,
  delay = 0,
}: {
  title: string;
  children: React.ReactNode;
  delay?: number;
}) => (
  <motion.div
    initial={{ y: 20, opacity: 0 }}
    animate={{ y: 0, opacity: 1 }}
    transition={{ duration: 0.5, delay }}
    className="mb-10"
  >
    <h2 className="text-2xl font-bold tracking-tight mb-6">{title}</h2>
    <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 w-full max-w-6xl mx-auto">
      {children}
    </div>
  </motion.div>
);

export function StatisticsContent() {
  const { data: githubStats, isLoading: isLoadingGithub } = useQuery({
    queryKey: ["githubStats"],
    queryFn: async () => {
      const response = await axios.get("/api/statistics/github");
      return response.data;
    },
  });

  const { data: leetcodeStats, isLoading: isLoadingLeetcode } = useQuery({
    queryKey: ["leetcodeStats"],
    queryFn: async () => {
      const response = await axios.get("/api/statistics/leetcode");
      return response.data;
    },
  });

  const { data: codechefStats, isLoading: isLoadingCodechef } = useQuery({
    queryKey: ["codechefStats"],
    queryFn: async () => {
      const response = await axios.get("/api/statistics/codechef");
      return response.data;
    },
  });

  return (
    <div className="container mx-auto px-4 py-24">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center mb-16"
      >
        <h1 className="text-4xl font-bold mb-4">Coding Statistics</h1>
        <p className="text-muted-foreground max-w-2xl mx-auto mb-4">
          A comprehensive overview of my coding journey and achievements across
          various platforms.
        </p>
        <div className="flex justify-center gap-2">
          <Badge variant="secondary" className="text-sm">
            <RocketIcon className="w-3 h-3 mr-1" /> Active Developer
          </Badge>
          <Badge variant="secondary" className="text-sm">
            <LayersIcon className="w-3 h-3 mr-1" /> Full Stack
          </Badge>
          <Badge variant="secondary" className="text-sm">
            <CommitIcon className="w-3 h-3 mr-1" /> Open Source
          </Badge>
        </div>
      </motion.div>

      <div className="space-y-12 max-w-6xl mx-auto">
        {/* Skill Progress Section */}
        <PlatformSection title="Skill Progress">
          <div className="col-span-4 grid gap-6 grid-cols-1 sm:grid-cols-2">
            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4 flex items-center">
                <Code2 className="w-5 h-5 mr-2" /> Technical Skills
              </h3>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm">Problem Solving</span>
                    <span className="text-sm">95%</span>
                  </div>
                  <Progress value={95} className="h-2" />
                </div>
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm">Data Structures</span>
                    <span className="text-sm">90%</span>
                  </div>
                  <Progress value={90} className="h-2" />
                </div>
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm">Algorithms</span>
                    <span className="text-sm">85%</span>
                  </div>
                  <Progress value={85} className="h-2" />
                </div>
              </div>
            </Card>
            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4 flex items-center">
                <Brain className="w-5 h-5 mr-2" /> Development Skills
              </h3>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm">Frontend Development</span>
                    <span className="text-sm">92%</span>
                  </div>
                  <Progress value={92} className="h-2" />
                </div>
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm">Backend Development</span>
                    <span className="text-sm">88%</span>
                  </div>
                  <Progress value={88} className="h-2" />
                </div>
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm">Database Management</span>
                    <span className="text-sm">85%</span>
                  </div>
                  <Progress value={85} className="h-2" />
                </div>
              </div>
            </Card>
          </div>
        </PlatformSection>

        {/* GitHub Section */}
        <PlatformSection title="GitHub Statistics">
          {isLoadingGithub ? (
            Array(4)
              .fill(0)
              .map((_, i) => (
                <Skeleton key={i} className="h-[100px] w-full rounded-xl" />
              ))
          ) : (
            <>
              <StatCard
                title="Total Repositories"
                value={githubStats?.totalRepos || "0"}
                icon={GitHubLogoIcon}
                color="bg-primary/10 text-primary"
              />
              <StatCard
                title="Total Stars"
                value={githubStats?.totalStars || "0"}
                icon={StarIcon}
                color="bg-yellow-500/10 text-yellow-500"
              />
              <StatCard
                title="Total Forks"
                value={githubStats?.totalForks || "0"}
                icon={GitFork}
                color="bg-blue-500/10 text-blue-500"
              />
              <StatCard
                title="Pull Requests"
                value={githubStats?.pullRequests || "0"}
                icon={GitPullRequest}
                color="bg-purple-500/10 text-purple-500"
              />
            </>
          )}
        </PlatformSection>

        {/* LeetCode Section */}
        <PlatformSection title="LeetCode Statistics" delay={0.2}>
          {isLoadingLeetcode ? (
            Array(4)
              .fill(0)
              .map((_, i) => (
                <Skeleton key={i} className="h-[100px] w-full rounded-xl" />
              ))
          ) : (
            <>
              <StatCard
                title="Problems Solved"
                value={leetcodeStats?.totalSolved || "0"}
                icon={CodeIcon}
                color="bg-green-500/10 text-green-500"
              />
              <StatCard
                title="Contest Rating"
                value={leetcodeStats?.rating || "0"}
                icon={Trophy}
                color="bg-yellow-500/10 text-yellow-500"
              />
              <StatCard
                title="Global Ranking"
                value={leetcodeStats?.ranking || "N/A"}
                icon={PersonIcon}
                color="bg-blue-500/10 text-blue-500"
              />
              <StatCard
                title="Streak"
                value={leetcodeStats?.streak || "0"}
                icon={StreakIcon}
                color="bg-red-500/10 text-red-500"
              />
            </>
          )}
        </PlatformSection>

        {/* Achievement Metrics */}
        <PlatformSection title="Achievement Metrics" delay={0.3}>
          <Card className="col-span-4 p-6">
            <h3 className="text-lg font-semibold mb-4 flex items-center">
              <Target className="w-5 h-5 mr-2" /> Coding Milestones
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="p-4 rounded-lg bg-primary/5 border border-primary/10">
                <h4 className="text-sm text-muted-foreground">
                  Total Problems
                </h4>
                <p className="text-2xl font-bold mt-1">
                  {(!isLoadingLeetcode && leetcodeStats?.totalSolved) || "0"}
                </p>
              </div>
              <div className="p-4 rounded-lg bg-primary/5 border border-primary/10">
                <h4 className="text-sm text-muted-foreground">Contributions</h4>
                <p className="text-2xl font-bold mt-1">
                  {(!isLoadingGithub &&
                    githubStats?.contributions?.totalContributions) ||
                    "0"}
                </p>
              </div>
              <div className="p-4 rounded-lg bg-primary/5 border border-primary/10">
                <h4 className="text-sm text-muted-foreground">Success Rate</h4>
                <p className="text-2xl font-bold mt-1">
                  {(!isLoadingLeetcode && leetcodeStats?.acceptanceRate) || "0"}
                  %
                </p>
              </div>
              <div className="p-4 rounded-lg bg-primary/5 border border-primary/10">
                <h4 className="text-sm text-muted-foreground">Global Rank</h4>
                <p className="text-2xl font-bold mt-1">
                  #{(!isLoadingLeetcode && leetcodeStats?.ranking) || "N/A"}
                </p>
              </div>
            </div>
          </Card>
        </PlatformSection>

        {/* GitHub Additional Stats */}
        <PlatformSection title="GitHub Contributions" delay={0.4}>
          {isLoadingGithub ? (
            Array(4)
              .fill(0)
              .map((_, i) => (
                <Skeleton key={i} className="h-[100px] w-full rounded-xl" />
              ))
          ) : (
            <>
              <StatCard
                title="Total Contributions"
                value={githubStats?.contributions?.totalContributions || "0"}
                icon={CodeIcon}
                color="bg-green-500/10 text-green-500"
              />
              <StatCard
                title="Current Streak"
                value={
                  githubStats?.contributions?.streakData?.currentStreak || "0"
                }
                icon={StreakIcon}
                color="bg-yellow-500/10 text-yellow-500"
              />
              <StatCard
                title="Longest Streak"
                value={
                  githubStats?.contributions?.streakData?.longestStreak || "0"
                }
                icon={Trophy}
                color="bg-blue-500/10 text-blue-500"
              />
              <StatCard
                title="Active Days"
                value={
                  githubStats?.contributions?.streakData
                    ?.totalContributionDays || "0"
                }
                icon={PersonIcon}
                color="bg-purple-500/10 text-purple-500"
              />
            </>
          )}
        </PlatformSection>

        {/* Statistics Charts */}
        {!isLoadingGithub && !isLoadingLeetcode && !isLoadingCodechef && (
          <StatsCharts
            githubContributions={
              githubStats?.contributions?.contributionsByDay || []
            }
            leetcodeProblemStats={{
              easy: leetcodeStats?.easySolved || 0,
              medium: leetcodeStats?.mediumSolved || 0,
              hard: leetcodeStats?.hardSolved || 0,
            }}
            codechefSubmissions={{
              accepted: codechefStats?.submissionStats?.accepted || 0,
              wrongAnswer: codechefStats?.submissionStats?.wrongAnswer || 0,
              timeLimitExceeded:
                codechefStats?.submissionStats?.timeLimitExceeded || 0,
              compilationError:
                codechefStats?.submissionStats?.compilationError || 0,
            }}
          />
        )}
      </div>
    </div>
  );
}
