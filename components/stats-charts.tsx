"use client";

import React from "react";
import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";
import { format, parseISO } from "date-fns";
import { contributionRange } from "@/lib/contribution-range";

interface ContributionData {
  date: string;
  count: number;
}

interface ProblemStats {
  easy: number;
  medium: number;
  hard: number;
}

interface StatsChartsProps {
  /** Real calendar days. The chart used to receive bare counts and invent
   *  dates by counting back 364 days from "now" — for the 980-day series the
   *  page actually passes, that labelled most points with dates in the future. */
  githubContributions: { date: string; count: number }[];
  leetcodeProblemStats: ProblemStats;
}

export function StatsCharts({
  githubContributions,
  leetcodeProblemStats,
}: StatsChartsProps) {
  const contributionsData: ContributionData[] = githubContributions.map(
    ({ date, count }) => ({
      date: format(parseISO(date), "MMM d, yyyy"),
      count,
    })
  );
  const totalContributions = githubContributions.reduce(
    (a, b) => a + b.count,
    0
  );
  const range = contributionRange(githubContributions);

  // Transform LeetCode problem stats
  const problemStatsData = [
    { name: "Easy", value: leetcodeProblemStats.easy, color: "#10b981" },
    { name: "Medium", value: leetcodeProblemStats.medium, color: "#f59e0b" },
    { name: "Hard", value: leetcodeProblemStats.hard, color: "#ef4444" },
  ];

  // Calculate total problems
  const totalProblems = problemStatsData.reduce(
    (acc, curr) => acc + curr.value,
    0
  );

  // Custom tooltip for GitHub contributions
  const CustomTooltip = ({
    active,
    payload,
    label,
  }: {
    active?: boolean;
    payload?: Array<{ value: number }>;
    label?: string;
  }) => {
    if (active && payload && payload.length) {
      return (
        <div className="rounded-md border border-border bg-card p-2 shadow-md">
          <p className="text-xs font-medium">{label}</p>
          <p className="text-sm font-bold text-primary">
            {`${payload[0].value} contributions`}
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
      {/* GitHub Contributions Chart */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Card className="border-primary/20 bg-gradient-to-br from-background to-background/80 p-6 backdrop-blur-sm">
          <h3 className="mb-4 text-lg font-semibold">GitHub Contributions</h3>
          {githubContributions.length === 0 ? (
            <div className="flex h-[250px] flex-col items-center justify-center gap-2 rounded-md border border-dashed border-border bg-muted/20 text-center text-sm text-muted-foreground">
              <span>
                Daily contribution history is refreshing from the GitHub API.
              </span>
              <span className="text-xs">
                Aggregate totals above are from the last successful snapshot.
              </span>
            </div>
          ) : (
            <>
              <div
                className="h-[250px]"
                role="img"
                aria-label={`GitHub contribution trend, ${range}. Total ${totalContributions} contributions.`}
              >
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={contributionsData}>
                    <defs>
                      <linearGradient
                        id="colorCount"
                        x1="0"
                        y1="0"
                        x2="0"
                        y2="1"
                      >
                        <stop
                          offset="5%"
                          stopColor="hsl(var(--primary))"
                          stopOpacity={0.8}
                        />
                        <stop
                          offset="95%"
                          stopColor="hsl(var(--primary))"
                          stopOpacity={0}
                        />
                      </linearGradient>
                    </defs>
                    <XAxis
                      dataKey="date"
                      tick={{
                        fontSize: 12,
                        fill: "hsl(var(--muted-foreground))",
                      }}
                      interval={30}
                      tickFormatter={(value) => format(new Date(value), "MMM")}
                      stroke="hsl(var(--muted-foreground))"
                    />
                    <YAxis
                      tick={{
                        fontSize: 12,
                        fill: "hsl(var(--muted-foreground))",
                      }}
                      stroke="hsl(var(--muted-foreground))"
                    />
                    <Tooltip content={<CustomTooltip />} />
                    <Area
                      type="monotone"
                      dataKey="count"
                      stroke="hsl(var(--primary))"
                      strokeWidth={2}
                      fillOpacity={1}
                      fill="url(#colorCount)"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
              <div className="mt-4 flex justify-between text-sm text-muted-foreground">
                <span>{range}</span>
                <span>
                  Total: {totalContributions.toLocaleString("en-US")}{" "}
                  contributions
                </span>
              </div>
            </>
          )}
        </Card>
      </motion.div>

      {/* LeetCode Problem Distribution */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <Card className="border-primary/20 bg-gradient-to-br from-background to-background/80 p-6 backdrop-blur-sm">
          <h3 className="mb-4 text-lg font-semibold">LeetCode Problems</h3>
          <div
            className="flex h-[250px] items-center"
            role="img"
            aria-label={`LeetCode difficulty distribution — Easy ${leetcodeProblemStats.easy}, Medium ${leetcodeProblemStats.medium}, Hard ${leetcodeProblemStats.hard}. Total ${totalProblems} problems solved.`}
          >
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={problemStatsData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                  // No outer labels, deliberately.
                  //
                  // They rendered outside an 80px-radius donut inside a 250px
                  // box, so on a 390px viewport the left and right labels were
                  // clipped by the container. They also inherited the SVG
                  // default fill (black), which is invisible on the dark
                  // canvas — `stroke` on a chart element colours the line, not
                  // the text.
                  //
                  // The legend below carries name, count AND percentage, is
                  // laid out by flow rather than by angle, and therefore cannot
                  // clip at any width.
                  labelLine={false}
                  isAnimationActive={false}
                  rootTabIndex={-1}
                >
                  {problemStatsData.map((entry, index) => (
                    // Each sector gets its own accessible name so axe's
                    // svg-img-alt rule doesn't flag the role=img path
                    // that recharts emits per sector. The parent div
                    // already has the aggregate aria-label for screen
                    // readers; these per-sector labels cover the nodes
                    // individually.
                    <Cell
                      key={`cell-${index}`}
                      fill={entry.color}
                      aria-label={`${entry.name}: ${entry.value} problems`}
                    />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(value) => [`${value} problems`, "Count"]}
                  contentStyle={{
                    background: "hsl(var(--card))",
                    border: "1px solid hsl(var(--border))",
                  }}
                />
                <Legend
                  verticalAlign="bottom"
                  height={36}
                  formatter={(value, entry, index) => {
                    const item = problemStatsData[index];
                    const pct =
                      totalProblems > 0
                        ? Math.round((item.value / totalProblems) * 100)
                        : 0;
                    return (
                      <span className="text-sm text-foreground">
                        {value}:{" "}
                        <span className="font-medium">{item.value}</span>{" "}
                        <span className="text-muted-foreground">({pct}%)</span>
                      </span>
                    );
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-2 text-center text-sm text-muted-foreground">
            <span>Total: {totalProblems} problems solved</span>
          </div>
        </Card>
      </motion.div>
    </div>
  );
}
