// Loads the committed last-known-good statistics payload from
// data/statistics-snapshot.json. Safe to call at build time or in server
// components — the file is shipped with the repo so it always resolves
// even when upstream APIs (GitHub, LeetCode) are slow or unreachable.
//
// The snapshot is used in two places:
//   1. /api/statistics — returned immediately if the live fetch times out.
//   2. app/statistics/page.tsx — passed as initial data to the client
//      component so the SSR HTML contains real numbers instead of a
//      "Loading..." spinner.

import { readFileSync } from "node:fs";
import { join } from "node:path";

export interface StatisticsPayload {
  github: {
    repositories: number;
    contributions: number;
    stars: number;
    forks: number;
    followers: number;
    languages: { name: string; percentage: number; color: string }[];
    currentStreak: { count: number; startDate: string; endDate: string };
    longestStreak: { count: number; startDate: string; endDate: string };
    totalCommits: number;
    totalPRs: number;
    totalIssues: number;
    totalRepos: number;
    contributionDays: { date: string; contributionCount: number }[];
  };
  leetcode: {
    totalSolved: number;
    easySolved: number;
    mediumSolved: number;
    hardSolved: number;
    ranking: number;
    contributionPoint: number;
    reputation: number;
    currentStreak: { count: number; startDate: string; endDate: string };
    longestStreak: { count: number; startDate: string; endDate: string };
    activeYears: number[];
    totalActiveDays: number;
    submissionCalendar: Record<string, number>;
  };
}

let cached: StatisticsPayload | null = null;

export function getStatisticsSnapshot(): StatisticsPayload {
  if (cached) return cached;
  try {
    const filePath = join(process.cwd(), "data", "statistics-snapshot.json");
    const raw = readFileSync(filePath, "utf8");
    const parsed = JSON.parse(raw) as Partial<StatisticsPayload> &
      Record<string, unknown>;
    cached = {
      github: parsed.github as StatisticsPayload["github"],
      leetcode: parsed.leetcode as StatisticsPayload["leetcode"],
    };
    return cached;
  } catch (error) {
    console.error("Failed to load statistics snapshot:", error);
    // Minimal fallback — keeps shape consistent so consumers don't crash.
    const emptyStreak = { count: 0, startDate: "", endDate: "" };
    cached = {
      github: {
        repositories: 0,
        contributions: 0,
        stars: 0,
        forks: 0,
        followers: 0,
        languages: [],
        currentStreak: emptyStreak,
        longestStreak: emptyStreak,
        totalCommits: 0,
        totalPRs: 0,
        totalIssues: 0,
        totalRepos: 0,
        contributionDays: [],
      },
      leetcode: {
        totalSolved: 0,
        easySolved: 0,
        mediumSolved: 0,
        hardSolved: 0,
        ranking: 0,
        contributionPoint: 0,
        reputation: 0,
        currentStreak: emptyStreak,
        longestStreak: emptyStreak,
        activeYears: [],
        totalActiveDays: 0,
        submissionCalendar: {},
      },
    };
    return cached;
  }
}
