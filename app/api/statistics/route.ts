import { NextResponse } from "next/server";
import { PROFILE_USERNAMES } from "@/lib/constants";
import { fetchGithubStats } from "@/lib/github-service";
import { fetchLeetCodeStats } from "@/lib/leetcode-service";
import { getStatisticsSnapshot } from "@/lib/statistics-snapshot";

const EMPTY_STREAK = { count: 0, startDate: "", endDate: "" };

const GITHUB_FALLBACK = {
  repositories: 0 as number,
  contributions: 0,
  stars: 0 as number,
  forks: 0 as number,
  followers: 0,
  languages: [] as { name: string; percentage: number; color: string }[],
  currentStreak: EMPTY_STREAK,
  longestStreak: EMPTY_STREAK,
  totalCommits: 0,
  totalPRs: 0,
  totalIssues: 0,
  totalRepos: 0,
  contributionDays: [] as { date: string; contributionCount: number }[],
};

const LEETCODE_FALLBACK = {
  totalSolved: 0,
  easySolved: 0,
  mediumSolved: 0,
  hardSolved: 0,
  ranking: 0,
  contributionPoint: 0,
  reputation: 0,
  currentStreak: EMPTY_STREAK,
  longestStreak: EMPTY_STREAK,
  activeYears: [] as number[],
  totalActiveDays: 0,
  submissionCalendar: {} as Record<string, number>,
};

// Cap external API calls at 10s so the statistics page never hangs forever.
// On timeout we fall through to the committed snapshot (last-known-good).
const UPSTREAM_TIMEOUT_MS = 10_000;

function withTimeout<T>(p: Promise<T>, ms: number, label: string): Promise<T> {
  return new Promise<T>((resolve, reject) => {
    const timer = setTimeout(
      () => reject(new Error(`${label} timed out after ${ms}ms`)),
      ms
    );
    p.then(
      (v) => {
        clearTimeout(timer);
        resolve(v);
      },
      (e) => {
        clearTimeout(timer);
        reject(e);
      }
    );
  });
}

export async function GET() {
  try {
    const githubUsername = PROFILE_USERNAMES.GITHUB;
    const leetcodeUsername = PROFILE_USERNAMES.LEETCODE;

    const snapshot = getStatisticsSnapshot();
    let githubStats = snapshot.github ?? GITHUB_FALLBACK;
    let leetcodeStats = snapshot.leetcode ?? LEETCODE_FALLBACK;

    try {
      githubStats = await withTimeout(
        fetchGithubStats(githubUsername),
        UPSTREAM_TIMEOUT_MS,
        "GitHub stats fetch"
      );
    } catch (error) {
      console.error("Error fetching GitHub statistics:", error);
    }

    try {
      const result = await withTimeout(
        fetchLeetCodeStats(leetcodeUsername),
        UPSTREAM_TIMEOUT_MS,
        "LeetCode stats fetch"
      );
      if (result) leetcodeStats = result;
    } catch (error) {
      console.error("Error fetching LeetCode statistics:", error);
    }

    return NextResponse.json(
      { github: githubStats, leetcode: leetcodeStats },
      {
        headers: {
          // Cache at the edge for 1 h; serve stale for 2 h while revalidating
          "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=7200",
        },
      }
    );
  } catch (error) {
    console.error("Error in statistics API:", error);
    const snapshot = getStatisticsSnapshot();
    return NextResponse.json(
      {
        github: snapshot.github ?? GITHUB_FALLBACK,
        leetcode: snapshot.leetcode ?? LEETCODE_FALLBACK,
        error: "Failed to fetch statistics, showing fallback data",
      },
      {
        status: 200,
        headers: {
          "Cache-Control": "public, s-maxage=60, stale-while-revalidate=300",
        },
      }
    );
  }
}
