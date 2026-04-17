import { NextResponse } from "next/server";
import { SOCIAL_LINKS } from "@/config/constants";
import { fetchGithubStats } from "@/lib/github-service";
import { fetchLeetCodeStats } from "@/lib/leetcode-service";

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

export async function GET() {
  try {
    const githubUsername = SOCIAL_LINKS.GITHUB.split("/").pop() ?? "";
    const leetcodeUsername = SOCIAL_LINKS.LEETCODE.split("/").pop() ?? "";

    let githubStats = GITHUB_FALLBACK;
    let leetcodeStats = LEETCODE_FALLBACK;

    try {
      githubStats = await fetchGithubStats(githubUsername);
    } catch (error) {
      console.error("Error fetching GitHub statistics:", error);
    }

    try {
      const result = await fetchLeetCodeStats(leetcodeUsername);
      if (result) leetcodeStats = result;
    } catch (error) {
      console.error("Error fetching LeetCode statistics:", error);
    }

    return NextResponse.json({ github: githubStats, leetcode: leetcodeStats });
  } catch (error) {
    console.error("Error in statistics API:", error);
    return NextResponse.json(
      {
        github: GITHUB_FALLBACK,
        leetcode: LEETCODE_FALLBACK,
        error: "Failed to fetch statistics, showing fallback data",
      },
      { status: 200 }
    );
  }
}
