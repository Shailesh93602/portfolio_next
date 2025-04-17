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
import { format } from "date-fns";

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
  githubContributions: number[];
  leetcodeProblemStats: ProblemStats;
}

export function StatsCharts({
  githubContributions,
  leetcodeProblemStats,
}: StatsChartsProps) {
  // Transform GitHub contributions data
  const contributionsData: ContributionData[] = githubContributions.map(
    (count, index) => ({
      date: format(
        new Date(Date.now() - (364 - index) * 24 * 60 * 60 * 1000),
        "MMM dd"
      ),
      count,
    })
  );

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
    label 
  }: {
    active?: boolean;
    payload?: Array<{value: number}>;
    label?: string;
  }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-card border border-border p-2 rounded-md shadow-md">
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
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
      {/* GitHub Contributions Chart */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Card className="p-6 border-primary/20 bg-gradient-to-br from-background to-background/80 backdrop-blur-sm">
          <h3 className="text-lg font-semibold mb-4">GitHub Contributions</h3>
          <div className="h-[250px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={contributionsData}>
                <defs>
                  <linearGradient id="colorCount" x1="0" y1="0" x2="0" y2="1">
                    <stop
                      offset="5%"
                      stopColor="var(--color-primary)"
                      stopOpacity={0.8}
                    />
                    <stop
                      offset="95%"
                      stopColor="var(--color-primary)"
                      stopOpacity={0}
                    />
                  </linearGradient>
                </defs>
                <XAxis
                  dataKey="date"
                  tick={{ fontSize: 12 }}
                  interval={30}
                  tickFormatter={(value) => format(new Date(value), "MMM")}
                  stroke="var(--color-muted-foreground)"
                />
                <YAxis
                  tick={{ fontSize: 12 }}
                  stroke="var(--color-muted-foreground)"
                />
                <Tooltip content={<CustomTooltip />} />
                <Area
                  type="monotone"
                  dataKey="count"
                  stroke="var(--color-primary)"
                  strokeWidth={2}
                  fillOpacity={1}
                  fill="url(#colorCount)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-4 flex justify-between text-sm text-muted-foreground">
            <span>Last 365 days</span>
            <span>
              Total: {githubContributions.reduce((a, b) => a + b, 0)}{" "}
              contributions
            </span>
          </div>
        </Card>
      </motion.div>

      {/* LeetCode Problem Distribution */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <Card className="p-6 border-primary/20 bg-gradient-to-br from-background to-background/80 backdrop-blur-sm">
          <h3 className="text-lg font-semibold mb-4">LeetCode Problems</h3>
          <div className="h-[250px] flex items-center">
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
                  label={({ name, percent }) =>
                    `${name} ${(percent * 100).toFixed(0)}%`
                  }
                  labelLine={false}
                >
                  {problemStatsData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(value) => [`${value} problems`, "Count"]}
                  contentStyle={{
                    background: "var(--color-card)",
                    border: "1px solid var(--color-border)",
                  }}
                />
                <Legend
                  verticalAlign="bottom"
                  height={36}
                  formatter={(value, entry, index) => {
                    const item = problemStatsData[index];
                    return (
                      <span className="text-sm">
                        {value}:{" "}
                        <span className="font-medium">{item.value}</span>
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
