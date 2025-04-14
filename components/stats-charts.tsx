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
  BarChart,
  Bar,
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
  codechefSubmissions: {
    accepted: number;
    wrongAnswer: number;
    timeLimitExceeded: number;
    compilationError: number;
  };
}

export function StatsCharts({
  githubContributions,
  leetcodeProblemStats,
  codechefSubmissions,
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
    { name: "Easy", value: leetcodeProblemStats.easy },
    { name: "Medium", value: leetcodeProblemStats.medium },
    { name: "Hard", value: leetcodeProblemStats.hard },
  ];

  // Transform CodeChef submission stats
  const submissionStatsData = [
    { name: "Accepted", value: codechefSubmissions.accepted },
    { name: "Wrong Answer", value: codechefSubmissions.wrongAnswer },
    { name: "Time Limit", value: codechefSubmissions.timeLimitExceeded },
    { name: "Compilation Error", value: codechefSubmissions.compilationError },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-8">
      {/* GitHub Contributions Chart */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">GitHub Contributions</h3>
          <div className="h-[200px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={contributionsData}>
                <defs>
                  <linearGradient id="colorCount" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#0070f3" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="#0070f3" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis
                  dataKey="date"
                  tick={{ fontSize: 12 }}
                  interval={30}
                  tickFormatter={(value) => format(new Date(value), "MMM")}
                />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip
                  contentStyle={{
                    background: "#1a1b1e",
                    border: "1px solid #2d2e2f",
                  }}
                  labelStyle={{ color: "#fff" }}
                />
                <Area
                  type="monotone"
                  dataKey="count"
                  stroke="#0070f3"
                  fillOpacity={1}
                  fill="url(#colorCount)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </motion.div>

      {/* LeetCode Problem Distribution */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">LeetCode Problems</h3>
          <div className="h-[200px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={problemStatsData}>
                <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip
                  contentStyle={{
                    background: "#1a1b1e",
                    border: "1px solid #2d2e2f",
                  }}
                  labelStyle={{ color: "#fff" }}
                />
                <Bar dataKey="value" fill="#22c55e" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </motion.div>

      {/* CodeChef Submission Stats */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
        className="md:col-span-2"
      >
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">CodeChef Submissions</h3>
          <div className="h-[200px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={submissionStatsData}>
                <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip
                  contentStyle={{
                    background: "#1a1b1e",
                    border: "1px solid #2d2e2f",
                  }}
                  labelStyle={{ color: "#fff" }}
                />
                <Bar dataKey="value" fill="#8b5cf6" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </motion.div>
    </div>
  );
}
