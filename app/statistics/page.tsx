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
} from "@radix-ui/react-icons";
import { GitFork, Trophy, GitPullRequest, AlertCircle } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";

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

const DifficultyBar = ({
  solved,
  total,
  difficulty,
  color,
}: {
  solved: number;
  total: number;
  difficulty: string;
  color: string;
}) => (
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

// Create a common CalendarBase component to ensure consistency between both calendars
const CalendarBase = ({
  title,
  months,
  weeks,
  getColorClass,
  tooltipText,
  emptyText = "No data available",
  isEmpty = false,
}: {
  title: string;
  months: Array<{
    name: string;
    year: number;
    firstDay: Date;
    weekIndex: number;
  }>;
  weeks: Array<Array<{ date: Date; count: number }>>;
  getColorClass: (count: number) => string;
  tooltipText: (count: number, date: Date) => string;
  emptyText?: string;
  isEmpty?: boolean;
}) => {
  if (isEmpty) {
    return (
      <Card className="p-6 col-span-full bg-card/90 border shadow-sm">
        <h3 className="text-lg font-semibold mb-6">{title}</h3>
        <div className="text-center text-muted-foreground py-8">
          {emptyText}
        </div>
      </Card>
    );
  }

  const weekdays = ["Mon", "Wed", "Fri"];

  return (
    <Card className="p-6 col-span-full bg-card/90 border shadow-sm h-full min-h-max">
      <h3 className="text-lg font-semibold mb-6">{title}</h3>
      <div className="overflow-x-auto overflow-y-hidden h-full min-h-[160px]">
        <div className="min-w-[800px] w-fit h-full">
          {/* Month labels */}
          <div className="relative pl-8 mb-4 h-8">
            <div className="relative w-full h-8 mb-8">
              {months.map((month) => {
                const weekWidth = 17;
                const position = month.weekIndex * weekWidth;
                return (
                  <div
                    key={`${month.name}-${month.year}-${month.weekIndex}-${position}`}
                    className="text-xs font-medium text-muted-foreground absolute whitespace-nowrap"
                    style={{
                      left: `${position}px`,
                      top: "0.25rem",
                    }}
                  >
                    {month.name}{" "}
                    {month.year !== months[0].year ? ` ${month.year}` : ""}
                  </div>
                );
              })}
            </div>
            <div className="flex mt-4">
              {/* Weekday labels */}
              <div className="w-8 flex flex-col justify-between pr-2 gap-[10px]">
                {weekdays.map((day) => (
                  <div
                    key={day}
                    className="text-xs font-medium text-muted-foreground h-[14px] flex items-center"
                  >
                    {day}
                  </div>
                ))}
              </div>
              {/* Contribution grid */}
              <div className="grid grid-rows-7 grid-flow-col gap-[3px] w-fit">
                {weeks.map((week, weekIndex) =>
                  week.map(({ date, count }, dayIndex) => (
                    <div
                      key={`${weekIndex}-${dayIndex}`}
                      className={`w-[14px] h-[14px] rounded-sm transition-all duration-200 ${getColorClass(
                        count
                      )} relative group hover:scale-110`}
                    >
                      <div className="absolute -top-12 left-1/2 -translate-x-1/2 px-3 py-1.5 bg-black/90 text-white text-xs font-medium rounded opacity-0 group-hover:opacity-100 whitespace-nowrap pointer-events-none z-[9999] transition-all duration-200 shadow-md">
                        {tooltipText(count, date)}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
};

const SubmissionCalendar = ({
  calendar,
}: {
  calendar: Record<string, number>;
}) => {
  if (!calendar || Object.keys(calendar).length === 0) {
    return (
      <CalendarBase
        title="Submission Calendar"
        months={[]}
        weeks={[]}
        getColorClass={() => ""}
        tooltipText={() => ""}
        isEmpty={true}
        emptyText="No submission data available"
      />
    );
  }

  const dates = Object.entries(calendar)
    .map(([timestamp, count]) => ({
      date: new Date(parseInt(timestamp) * 1000),
      count,
    }))
    .sort((a, b) => a.date.getTime() - b.date.getTime());

  // Get the date range
  const startDate =
    dates.length > 0 ? dates[0].date : new Date(new Date().getFullYear(), 0, 1);

  // Limit end date to today to prevent empty future months
  const today = new Date();
  const endDate =
    dates.length > 0
      ? new Date(
          Math.min(dates[dates.length - 1].date.getTime(), today.getTime())
        )
      : today;

  // Ensure we're looking at data from January 1, 2024 (or the first available date)
  const adjustedStartDate = new Date(
    Math.max(startDate.getTime(), new Date(2024, 0, 1).getTime())
  );

  // Create a map of all dates for quick lookup
  const dateMap = dates.reduce((acc, { date, count }) => {
    const key = date.toISOString().split("T")[0];
    acc[key] = count;
    return acc;
  }, {} as Record<string, number>);

  // Generate all weeks between start and end
  const weeks: Array<Array<{ date: Date; count: number }>> = [];
  let currentWeek: Array<{ date: Date; count: number }> = [];
  const currentDate = new Date(adjustedStartDate);

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

  // Get months that need to be displayed - only include months that have actual data
  const months = Array.from(
    new Set(
      weeks
        .flatMap((week) => {
          // Only include weeks that have at least one day with data
          if (week.some((day) => day.date <= endDate)) {
            return week[0].date;
          }
          return [];
        })
        .map((date) => ({
          name: date.toLocaleString("default", { month: "short" }),
          year: date.getFullYear(),
          firstDay: new Date(date.getFullYear(), date.getMonth(), 1),
          weekIndex: weeks.findIndex((w) =>
            w.some(
              (d) =>
                d.date.getMonth() === date.getMonth() &&
                d.date.getFullYear() === date.getFullYear() &&
                d.date.getDate() === 1
            )
          ),
        }))
    )
  ).sort((a, b) => a.firstDay.getTime() - b.firstDay.getTime());

  // Get max submission count for better color scaling
  const maxCount = Math.max(...dates.map((d) => d.count), 5);

  // Dynamic color intensity based on submission count
  const getColorClass = (count: number) => {
    if (count === 0) return "bg-secondary/20 dark:bg-secondary/10";

    const intensity = Math.min(Math.ceil((count / maxCount) * 4), 4);

    switch (intensity) {
      case 1:
        return "bg-green-200 dark:bg-green-900/70";
      case 2:
        return "bg-green-300 dark:bg-green-700/80";
      case 3:
        return "bg-green-400 dark:bg-green-600/90";
      case 4:
        return "bg-green-500 dark:bg-green-500";
      default:
        return "bg-secondary/20 dark:bg-secondary/10";
    }
  };

  const tooltipText = (count: number, date: Date) => {
    if (count === 0) return `No submissions on ${date.toLocaleDateString()}`;
    if (count === 1) return `1 submission on ${date.toLocaleDateString()}`;
    return `${count} submissions on ${date.toLocaleDateString()}`;
  };

  return (
    <CalendarBase
      title="Submission Calendar"
      months={months}
      weeks={weeks}
      getColorClass={getColorClass}
      tooltipText={tooltipText}
    />
  );
};

const GitHubContributionCalendar = ({
  contributionDays,
}: {
  contributionDays: Array<{ date: string; contributionCount: number }>;
}) => {
  if (!contributionDays || contributionDays.length === 0) {
    console.log("No GitHub contribution days data available");
    return (
      <CalendarBase
        title="Contribution Calendar"
        months={[]}
        weeks={[]}
        getColorClass={() => ""}
        tooltipText={() => ""}
        isEmpty={true}
        emptyText="No contribution data available"
      />
    );
  }

  console.log(`Rendering GitHub calendar with ${contributionDays.length} days`);

  // Sort dates by time
  const dates = [...contributionDays].sort(
    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
  );

  console.log(
    `Date range: ${dates[0]?.date} to ${dates[dates.length - 1]?.date}`
  );

  // Get the date range
  const startDate =
    dates.length > 0
      ? new Date(dates[0].date)
      : new Date(new Date().getFullYear(), 0, 1);

  // Limit the end date to today (don't show future months)
  const today = new Date();
  const endDate =
    dates.length > 0
      ? new Date(
          Math.min(
            new Date(dates[dates.length - 1].date).getTime(),
            today.getTime()
          )
        )
      : today;

  // Ensure we're looking at data from January 1, 2024 (or the first available date)
  const adjustedStartDate = new Date(
    Math.max(startDate.getTime(), new Date(2024, 0, 1).getTime())
  );

  // Create a map of all dates for quick lookup
  const dateMap = dates.reduce((acc, { date, contributionCount }) => {
    const key = date.split("T")[0];
    acc[key] = contributionCount;
    return acc;
  }, {} as Record<string, number>);

  // Generate all weeks between start and end
  const weeks: Array<Array<{ date: Date; count: number }>> = [];
  let currentWeek: Array<{ date: Date; count: number }> = [];
  const currentDate = new Date(adjustedStartDate);

  // Go to the start of the week (Sunday)
  const tempDate = new Date(currentDate);
  while (tempDate.getDay() !== 0) {
    tempDate.setDate(tempDate.getDate() - 1);
  }
  currentDate.setTime(tempDate.getTime());

  while (currentDate <= endDate) {
    const key = currentDate.toISOString().split("T")[0];
    currentWeek.push({
      date: new Date(currentDate),
      count: dateMap[key] || 0,
    });

    if (currentWeek.length === 7) {
      weeks.push([...currentWeek]);
      currentWeek = [];
    }

    currentDate.setDate(currentDate.getDate() + 1);
  }

  // Fill the last week if incomplete
  while (currentWeek.length > 0 && currentWeek.length < 7) {
    currentWeek.push({
      date: new Date(currentDate),
      count: 0,
    });
    currentDate.setDate(currentDate.getDate() + 1);
  }
  if (currentWeek.length === 7) {
    weeks.push([...currentWeek]);
  }

  console.log(`Generated ${weeks.length} weeks for the calendar`);

  // Get unique months between start and end date
  const months: Array<{
    name: string;
    year: number;
    firstDay: Date;
    weekIndex: number;
  }> = [];

  // Track months we've already added to avoid duplicates
  const addedMonths = new Set<string>();

  const currentMonth = new Date(adjustedStartDate);
  currentMonth.setDate(1); // Set to first day of month

  while (currentMonth <= endDate) {
    const monthKey = `${currentMonth.getMonth()}-${currentMonth.getFullYear()}`;

    // Only process this month if we haven't added it yet
    if (!addedMonths.has(monthKey)) {
      const weekIndex = weeks.findIndex((week) =>
        week.some(
          (day) =>
            day.date.getMonth() === currentMonth.getMonth() &&
            day.date.getFullYear() === currentMonth.getFullYear()
        )
      );

      if (weekIndex !== -1) {
        months.push({
          name: currentMonth.toLocaleString("default", { month: "short" }),
          year: currentMonth.getFullYear(),
          firstDay: new Date(currentMonth),
          weekIndex,
        });

        // Mark this month as added
        addedMonths.add(monthKey);
      }
    }

    // Move to next month
    currentMonth.setMonth(currentMonth.getMonth() + 1);
  }

  console.log(`Generated ${months.length} months for the calendar`);

  // Get max contribution count for better color scaling
  const maxCount = Math.max(...dates.map((d) => d.contributionCount), 5);

  // Dynamic color intensity based on contribution count
  const getColorClass = (count: number) => {
    if (count === 0) return "bg-[#ebedf0] dark:bg-[#161b22]";

    const intensity = Math.min(Math.ceil((count / maxCount) * 4), 4);

    switch (intensity) {
      case 1:
        return "bg-[#9be9a8] dark:bg-[#0e4429]";
      case 2:
        return "bg-[#40c463] dark:bg-[#006d32]";
      case 3:
        return "bg-[#30a14e] dark:bg-[#26a641]";
      case 4:
        return "bg-[#216e39] dark:bg-[#39d353]";
      default:
        return "bg-[#ebedf0] dark:bg-[#161b22]";
    }
  };

  const tooltipText = (count: number, date: Date) => {
    if (count === 0) return `No contributions on ${date.toLocaleDateString()}`;
    if (count === 1) return `1 contribution on ${date.toLocaleDateString()}`;
    return `${count} contributions on ${date.toLocaleDateString()}`;
  };

  if (weeks.length === 0 || months.length === 0) {
    console.log("No weeks or months generated for GitHub calendar");
    return (
      <CalendarBase
        title="Contribution Calendar"
        months={[]}
        weeks={[]}
        getColorClass={() => ""}
        tooltipText={() => ""}
        isEmpty={true}
        emptyText="Failed to generate calendar data"
      />
    );
  }

  return (
    <CalendarBase
      title="Contribution Calendar"
      months={months}
      weeks={weeks}
      getColorClass={getColorClass}
      tooltipText={tooltipText}
    />
  );
};

// Enhance the StreakCard component for better appearance
const StreakCard = ({
  currentStreak,
  longestStreak,
  platform,
}: {
  currentStreak: { count: number; startDate: string; endDate: string };
  longestStreak: { count: number; startDate: string; endDate: string };
  platform: string;
}) => (
  <Card className="p-5 col-span-full bg-card/90 border shadow-sm">
    <h3 className="text-lg font-semibold mb-4">{platform} Streak</h3>
    <div className="grid gap-4 md:grid-cols-2">
      <div className="flex items-center space-x-4 p-4 bg-background/50 rounded-lg border border-border/40">
        <div className="p-3 rounded-full bg-orange-500/10">
          <StreakIcon className="w-5 h-5 text-orange-500" />
        </div>
        <div>
          <p className="text-xs font-medium text-muted-foreground">
            Current Streak
          </p>
          <h4 className="text-xl font-bold">{currentStreak.count} days</h4>
          <p className="text-xs text-muted-foreground">
            {new Date(currentStreak.startDate).toLocaleDateString()} -{" "}
            {new Date(currentStreak.endDate).toLocaleDateString()}
          </p>
        </div>
      </div>
      <div className="flex items-center space-x-4 p-4 bg-background/50 rounded-lg border border-border/40">
        <div className="p-3 rounded-full bg-purple-500/10">
          <TimerIcon className="w-5 h-5 text-purple-500" />
        </div>
        <div>
          <p className="text-xs font-medium text-muted-foreground">
            Longest Streak
          </p>
          <h4 className="text-xl font-bold">{longestStreak.count} days</h4>
          <p className="text-xs text-muted-foreground">
            {new Date(longestStreak.startDate).toLocaleDateString()} -{" "}
            {new Date(longestStreak.endDate).toLocaleDateString()}
          </p>
        </div>
      </div>
    </div>
  </Card>
);

export default function StatisticsPage() {
  const { data, isLoading, error } = useQuery({
    queryKey: ["statistics"],
    queryFn: async () => {
      const { data } = await axios.get("/api/statistics");
      console.log("Statistics data loaded:", {
        githubContributionDays: data?.github?.contributionDays?.length || 0,
        leetcodeSubmissions:
          Object.keys(data?.leetcode?.submissionCalendar || {}).length || 0,
      });
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

  if (error) {
    console.error("Error loading statistics:", error);
    return (
      <div className="container py-8">
        <h1 className="text-3xl font-bold tracking-tight mb-4">
          Coding Statistics
        </h1>
        <Card className="p-6">
          <p className="text-red-500">
            Error loading statistics. Please try again later.
          </p>
        </Card>
      </div>
    );
  }

  const hasGithubContributions =
    data?.github?.contributionDays && data.github.contributionDays.length > 0;
  const hasLeetcodeSubmissions =
    data?.leetcode?.submissionCalendar &&
    Object.keys(data.leetcode.submissionCalendar).length > 0;

  return (
    <div className="container py-8 space-y-12">
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
        <LanguageDistribution languages={data?.github?.languages || []} />

        {hasGithubContributions ? (
          <GitHubContributionCalendar
            contributionDays={data.github.contributionDays}
          />
        ) : (
          <CalendarBase
            title="Contribution Calendar"
            months={[]}
            weeks={[]}
            getColorClass={() => ""}
            tooltipText={() => ""}
            isEmpty={true}
            emptyText="No contribution data available. Please check your GitHub username in the settings."
          />
        )}

        <StreakCard
          currentStreak={
            data?.github?.currentStreak || {
              count: 0,
              startDate: "",
              endDate: "",
            }
          }
          longestStreak={
            data?.github?.longestStreak || {
              count: 0,
              startDate: "",
              endDate: "",
            }
          }
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
        {hasLeetcodeSubmissions ? (
          <SubmissionCalendar calendar={data.leetcode.submissionCalendar} />
        ) : (
          <CalendarBase
            title="Submission Calendar"
            months={[]}
            weeks={[]}
            getColorClass={() => ""}
            tooltipText={() => ""}
            isEmpty={true}
            emptyText="No submission data available. Please check your LeetCode username in the settings."
          />
        )}
        <RecentSubmissions
          submissions={data?.leetcode?.recentSubmissions || []}
        />
        <StreakCard
          currentStreak={
            data?.leetcode?.currentStreak || {
              count: 0,
              startDate: "",
              endDate: "",
            }
          }
          longestStreak={
            data?.leetcode?.longestStreak || {
              count: 0,
              startDate: "",
              endDate: "",
            }
          }
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
