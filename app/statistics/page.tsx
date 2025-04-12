"use client";

import React from "react";
import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import {
  GitHubLogoIcon,
  CodeIcon,
  LightningBoltIcon,
  StarIcon,
  PersonIcon,
  TimerIcon,
  LightningBoltIcon as StreakIcon,
  CalendarIcon,
} from "@radix-ui/react-icons";
import {
  GitFork,
  Languages,
  Trophy,
  GitPullRequest,
  AlertCircle,
} from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";

const fadeInUp = {
  initial: { y: 20, opacity: 0 },
  animate: { y: 0, opacity: 1 },
  transition: { duration: 0.5 },
};

const StatCard = ({ title, value, icon: Icon, color }: any) => (
  <motion.div
    className="relative"
    whileHover={{ scale: 1.02 }}
    whileTap={{ scale: 0.98 }}
    {...fadeInUp}
  >
    <Card className="p-4 backdrop-blur-sm bg-card/50 border-2 hover:border-primary/50 transition-all">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs font-medium text-muted-foreground">{title}</p>
          <h3 className="text-lg font-bold mt-0.5">{value}</h3>
        </div>
        <div className={`p-2 rounded-full ${color}`}>
          <Icon className="w-4 h-4" />
        </div>
      </div>
    </Card>
  </motion.div>
);

const PlatformSection = ({ title, children, delay = 0 }: any) => (
  <motion.div
    initial={{ y: 20, opacity: 0 }}
    animate={{ y: 0, opacity: 1 }}
    transition={{ duration: 0.5, delay }}
    className="space-y-6"
  >
    <h2 className="text-xl font-bold tracking-tight">{title}</h2>
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">{children}</div>
  </motion.div>
);

const DifficultyBar = ({ solved, total, difficulty, color }: any) => (
  <div className="space-y-1.5">
    <div className="flex justify-between text-xs">
      <span className="text-muted-foreground">{difficulty}</span>
      <span className="font-medium">
        {solved}/{total}
      </span>
    </div>
    <div className="h-1.5 rounded-full bg-secondary">
      <motion.div
        initial={{ width: 0 }}
        animate={{ width: `${(solved / total) * 100}%` }}
        transition={{ duration: 1, delay: 0.5 }}
        className={`h-full rounded-full ${color}`}
      />
    </div>
  </div>
);

const LanguageDistribution = ({
  languages,
}: {
  languages: Array<{ name: string; percentage: number; color: string }>;
}) => (
  <Card className="p-4 col-span-full">
    <h3 className="text-lg font-semibold mb-3">Language Distribution</h3>
    <div className="space-y-3">
      {languages
        .filter((lang) => lang.percentage > 0)
        .map((lang) => (
          <div key={lang.name} className="space-y-1.5">
            <div className="flex justify-between text-xs">
              <span className="text-muted-foreground">{lang.name}</span>
              <span className="font-medium">{lang.percentage}%</span>
            </div>
            <div className="h-1.5 rounded-full bg-secondary">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${lang.percentage}%` }}
                transition={{ duration: 1, delay: 0.5 }}
                className="h-full rounded-full"
                style={{ backgroundColor: lang.color }}
              />
            </div>
          </div>
        ))}
    </div>
  </Card>
);

const RecentSubmissions = ({
  submissions,
}: {
  submissions: Array<{
    title: string;
    timestamp: string;
    statusDisplay: string;
    lang: string;
  }>;
}) => (
  <Card className="p-4 col-span-full">
    <h3 className="text-lg font-semibold mb-3">Recent Submissions</h3>
    <div className="space-y-3">
      {submissions.slice(0, 5).map((submission) => (
        <div
          key={submission.timestamp}
          className="flex items-center justify-between p-3 rounded-lg bg-secondary/50"
        >
          <div>
            <p className="text-sm font-medium">{submission.title}</p>
            <p className="text-xs text-muted-foreground">
              {new Date(
                parseInt(submission.timestamp) * 1000
              ).toLocaleDateString()}
            </p>
          </div>
          <div className="flex items-center space-x-2">
            <span
              className={`px-2 py-0.5 rounded-full text-xs ${
                submission.statusDisplay === "Accepted"
                  ? "bg-green-500/10 text-green-500"
                  : "bg-red-500/10 text-red-500"
              }`}
            >
              {submission.statusDisplay}
            </span>
            <span className="text-xs text-muted-foreground">
              {submission.lang}
            </span>
          </div>
        </div>
      ))}
    </div>
  </Card>
);

const SubmissionCalendar = ({
  calendar,
}: {
  calendar: Record<string, number>;
}) => {
  const dates = Object.entries(calendar)
    .map(([timestamp, count]) => ({
      date: new Date(parseInt(timestamp) * 1000),
      count,
    }))
    .sort((a, b) => a.date.getTime() - b.date.getTime());

  // Get the date range
  const startDate = dates[0]?.date || new Date();
  const endDate = dates[dates.length - 1]?.date || new Date();

  // Create a map of all dates for quick lookup
  const dateMap = dates.reduce((acc, { date, count }) => {
    const key = date.toISOString().split("T")[0];
    acc[key] = count;
    return acc;
  }, {} as Record<string, number>);

  // Generate all weeks between start and end
  const weeks: Array<Array<{ date: Date; count: number }>> = [];
  let currentWeek: Array<{ date: Date; count: number }> = [];
  const currentDate = new Date(startDate);

  // Go to the start of the week (Sunday)
  while (currentDate.getDay() !== 0) {
    currentDate.setDate(currentDate.getDate() - 1);
  }

  while (currentDate <= endDate) {
    const key = currentDate.toISOString().split("T")[0];
    currentWeek.push({
      date: new Date(currentDate),
      count: dateMap[key] || 0,
    });

    if (currentWeek.length === 7) {
      weeks.push(currentWeek);
      currentWeek = [];
    }

    currentDate.setDate(currentDate.getDate() + 1);
  }

  // Fill the last week if incomplete
  while (currentWeek.length < 7) {
    currentWeek.push({
      date: new Date(currentDate),
      count: 0,
    });
    currentDate.setDate(currentDate.getDate() + 1);
  }
  if (currentWeek.length === 7) {
    weeks.push(currentWeek);
  }

  // Get months that need to be displayed
  const months = Array.from(
    new Set(
      weeks
        .flatMap(
          (week) => week[0].date // Only use the first day of each week to determine month
        )
        .map((date) => ({
          name: date.toLocaleString("default", { month: "short" }),
          year: date.getFullYear(),
          firstDay: new Date(date.getFullYear(), date.getMonth(), 1),
          weekIndex: weeks.findIndex(
            (w) => w[0].date.getMonth() === date.getMonth()
          ),
        }))
    )
  ).sort((a, b) => a.firstDay.getTime() - b.firstDay.getTime());

  const weekdays = ["Mon", "Wed", "Fri"];

  return (
    <Card className="p-6 col-span-full">
      <h3 className="text-lg font-semibold mb-6">Submission Calendar</h3>
      <div className="overflow-x-auto">
        <div className="min-w-[800px] w-fit">
          {/* Month labels */}
          <div className="flex pl-8 mb-2">
            {months.map((month, idx) => {
              // Calculate how many weeks this month spans
              const nextMonth = months[idx + 1];
              const currentMonthWeeks = weeks.filter(
                (week) =>
                  week[0].date.getMonth() === month.firstDay.getMonth() &&
                  week[0].date.getFullYear() === month.firstDay.getFullYear()
              ).length;

              return (
                <div
                  key={`${month.name}-${month.year}`}
                  className="text-xs text-muted-foreground mr-4"
                  style={{
                    minWidth: `${currentMonthWeeks * 14}px`,
                    marginLeft: idx === 0 ? `${month.weekIndex * 14}px` : 0,
                  }}
                >
                  {month.name}
                </div>
              );
            })}
          </div>

          <div className="flex">
            {/* Weekday labels */}
            <div className="w-8 flex flex-col justify-between pr-2">
              {weekdays.map((day) => (
                <div
                  key={day}
                  className="text-xs text-muted-foreground h-[15px]"
                >
                  {day}
                </div>
              ))}
            </div>

            {/* Contribution grid */}
            <div className="grid grid-rows-7 grid-flow-col gap-[2px] w-fit">
              {weeks.map((week, weekIndex) =>
                week.map(({ date, count }, dayIndex) => (
                  <div
                    key={`${weekIndex}-${dayIndex}`}
                    className={`w-[12px] h-[12px] rounded-sm ${
                      count > 0
                        ? count > 5
                          ? "bg-green-500"
                          : count > 3
                          ? "bg-green-400"
                          : count > 1
                          ? "bg-green-300"
                          : "bg-green-200"
                        : "bg-secondary/20"
                    } relative group`}
                  >
                    <div className="absolute -top-8 left-1/2 -translate-x-1/2 px-2 py-1 bg-black/80 text-white text-xs rounded opacity-0 group-hover:opacity-100 whitespace-nowrap pointer-events-none z-50 transition-opacity">
                      {count} submissions on {date.toLocaleDateString()}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
};

const StreakCard = ({ currentStreak, longestStreak, platform }: any) => (
  <Card className="p-4 col-span-full">
    <h3 className="text-lg font-semibold mb-3">Contribution Streak</h3>
    <div className="grid gap-3 md:grid-cols-2">
      <div className="flex items-center space-x-3">
        <div className="p-2 rounded-full bg-orange-500/10">
          <StreakIcon className="w-4 h-4 text-orange-500" />
        </div>
        <div>
          <p className="text-xs font-medium text-muted-foreground">
            Current Streak
          </p>
          <h4 className="text-lg font-bold">{currentStreak.count} days</h4>
          <p className="text-[10px] text-muted-foreground">
            {new Date(currentStreak.startDate).toLocaleDateString()} -{" "}
            {new Date(currentStreak.endDate).toLocaleDateString()}
          </p>
        </div>
      </div>
      <div className="flex items-center space-x-3">
        <div className="p-2 rounded-full bg-purple-500/10">
          <TimerIcon className="w-4 h-4 text-purple-500" />
        </div>
        <div>
          <p className="text-xs font-medium text-muted-foreground">
            Longest Streak
          </p>
          <h4 className="text-lg font-bold">{longestStreak.count} days</h4>
          <p className="text-[10px] text-muted-foreground">
            {new Date(longestStreak.startDate).toLocaleDateString()} -{" "}
            {new Date(longestStreak.endDate).toLocaleDateString()}
          </p>
        </div>
      </div>
    </div>
  </Card>
);

export default function StatisticsPage() {
  const { data, isLoading } = useQuery({
    queryKey: ["statistics"],
    queryFn: async () => {
      const { data } = await axios.get("/api/statistics");
      return data;
    },
  });

  if (isLoading) {
    return (
      <div className="container py-8 space-y-8">
        <Skeleton className="h-8 w-48" />
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {[...Array(6)].map((_, i) => (
            <Skeleton key={i} className="h-32" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="container py-8 space-y-8">
      <motion.h1
        className="text-3xl font-bold tracking-tight"
        initial={{ x: -20, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        Coding Statistics
      </motion.h1>

      <PlatformSection title="GitHub Statistics" delay={0.2}>
        <StatCard
          title="Repositories"
          value={data?.github.repositories}
          icon={GitHubLogoIcon}
          color="bg-blue-500/10 text-blue-500"
        />
        <StatCard
          title="Contributions"
          value={data?.github.contributions}
          icon={CodeIcon}
          color="bg-green-500/10 text-green-500"
        />
        <StatCard
          title="Stars"
          value={data?.github.stars}
          icon={StarIcon}
          color="bg-yellow-500/10 text-yellow-500"
        />
        <StatCard
          title="Forks"
          value={data?.github.forks}
          icon={GitFork}
          color="bg-purple-500/10 text-purple-500"
        />
        <StatCard
          title="Followers"
          value={data?.github.followers}
          icon={PersonIcon}
          color="bg-pink-500/10 text-pink-500"
        />
        <StatCard
          title="Total Commits"
          value={data?.github.totalCommits}
          icon={CodeIcon}
          color="bg-blue-500/10 text-blue-500"
        />
        <StatCard
          title="Pull Requests"
          value={data?.github.totalPRs}
          icon={GitPullRequest}
          color="bg-green-500/10 text-green-500"
        />
        <StatCard
          title="Issues"
          value={data?.github.totalIssues}
          icon={AlertCircle}
          color="bg-red-500/10 text-red-500"
        />
        <LanguageDistribution languages={data?.github.languages} />
        <StreakCard
          currentStreak={data?.github.currentStreak}
          longestStreak={data?.github.longestStreak}
          platform="GitHub"
        />
      </PlatformSection>

      <PlatformSection title="LeetCode Statistics" delay={0.4}>
        <Card className="p-6 col-span-full">
          <h3 className="text-xl font-semibold mb-4">
            Problem Solving Progress
          </h3>
          <div className="space-y-4">
            <DifficultyBar
              solved={data?.leetcode.easySolved}
              total={data?.leetcode.totalEasy}
              difficulty="Easy"
              color="bg-green-500"
            />
            <DifficultyBar
              solved={data?.leetcode.mediumSolved}
              total={data?.leetcode.totalMedium}
              difficulty="Medium"
              color="bg-yellow-500"
            />
            <DifficultyBar
              solved={data?.leetcode.hardSolved}
              total={data?.leetcode.totalHard}
              difficulty="Hard"
              color="bg-red-500"
            />
          </div>
        </Card>
        <StatCard
          title="Total Solved"
          value={data?.leetcode.totalSolved}
          icon={LightningBoltIcon}
          color="bg-orange-500/10 text-orange-500"
        />
        <StatCard
          title="Ranking"
          value={`#${data?.leetcode.ranking}`}
          icon={StarIcon}
          color="bg-blue-500/10 text-blue-500"
        />
        <StatCard
          title="Contribution Points"
          value={data?.leetcode.contributionPoint}
          icon={Trophy}
          color="bg-yellow-500/10 text-yellow-500"
        />
        <StatCard
          title="Reputation"
          value={data?.leetcode.reputation}
          icon={StarIcon}
          color="bg-purple-500/10 text-purple-500"
        />
        <SubmissionCalendar calendar={data?.leetcode.submissionCalendar} />
        <RecentSubmissions submissions={data?.leetcode.recentSubmissions} />
        <StreakCard
          currentStreak={data?.leetcode.currentStreak}
          longestStreak={data?.leetcode.longestStreak}
          platform="LeetCode"
        />
      </PlatformSection>

      <PlatformSection title="GeeksforGeeks Statistics" delay={0.6}>
        <StatCard
          title="Institute Rank"
          value={`#${data?.gfg.instituteRank}`}
          icon={StarIcon}
          color="bg-green-500/10 text-green-500"
        />
        <StatCard
          title="Problems Solved"
          value={data?.gfg.problemsSolved}
          icon={CodeIcon}
          color="bg-blue-500/10 text-blue-500"
        />
        <StatCard
          title="Coding Score"
          value={data?.gfg.codingScore}
          icon={LightningBoltIcon}
          color="bg-yellow-500/10 text-yellow-500"
        />
        <StreakCard
          currentStreak={data?.gfg.currentStreak}
          longestStreak={data?.gfg.longestStreak}
          platform="GeeksforGeeks"
        />
        <Card className="p-6 col-span-full">
          <h3 className="text-xl font-semibold mb-4">Problems by Difficulty</h3>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <StatCard
              title="Basic"
              value={data?.gfg?.problemsByDifficulty?.basic}
              icon={CodeIcon}
              color="bg-gray-500/10 text-gray-500"
            />
            <StatCard
              title="Easy"
              value={data?.gfg?.problemsByDifficulty?.easy}
              icon={CodeIcon}
              color="bg-green-500/10 text-green-500"
            />
            <StatCard
              title="Medium"
              value={data?.gfg?.problemsByDifficulty?.medium}
              icon={CodeIcon}
              color="bg-yellow-500/10 text-yellow-500"
            />
            <StatCard
              title="Hard"
              value={data?.gfg?.problemsByDifficulty?.hard}
              icon={CodeIcon}
              color="bg-red-500/10 text-red-500"
            />
          </div>
        </Card>
      </PlatformSection>
    </div>
  );
}
