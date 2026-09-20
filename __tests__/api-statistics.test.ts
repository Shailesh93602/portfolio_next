/**
 * @jest-environment node
 *
 * Tests for app/api/statistics/route.ts
 * Mocks both github-service and leetcode-service.
 * Uses node environment because Next.js Response/NextResponse requires native Request globals.
 */

// Must mock before importing the route
jest.mock("@/lib/github-service", () => ({
  fetchGithubStats: jest.fn(),
}));
jest.mock("@/lib/leetcode-service", () => ({
  fetchLeetCodeStats: jest.fn(),
}));
// When upstream fetches fail, the route falls through to the committed
// last-known-good snapshot.
//
// 🔴 THE MOCK IS DELIBERATELY NON-ZERO.
//
// It used to be all zeros, which made the only interesting assertion
// impossible to write: "fell back to the snapshot" and "served zeros" were the
// same numbers, so a route that destroyed the snapshot and one that preserved
// it passed identically. That is precisely the defect this file now covers —
// `getGitHubContributions` swallowed its errors and answered with zeros, so an
// expired GITHUB_TOKEN rendered "Contributions: 0" over a snapshot holding
// thousands. Sentinel values make the difference visible.
const SNAPSHOT = {
  github: {
    repositories: 35,
    contributions: 9628,
    stars: 1,
    forks: 1,
    followers: 10,
    languages: [{ name: "TypeScript", percentage: 70, color: "#3178c6" }],
    currentStreak: { count: 4, startDate: "2026-09-01", endDate: "2026-09-04" },
    longestStreak: {
      count: 120,
      startDate: "2024-03-01",
      endDate: "2024-06-28",
    },
    totalCommits: 4200,
    totalPRs: 130,
    totalIssues: 20,
    totalRepos: 35,
    contributionDays: [{ date: "2024-01-02", contributionCount: 5 }],
  },
  leetcode: {
    totalSolved: 310,
    easySolved: 150,
    mediumSolved: 140,
    hardSolved: 20,
    ranking: 400000,
    contributionPoint: 500,
    reputation: 0,
    currentStreak: { count: 2, startDate: "", endDate: "" },
    longestStreak: { count: 30, startDate: "", endDate: "" },
    activeYears: [2024, 2025, 2026],
    totalActiveDays: 260,
    submissionCalendar: {},
  },
};

jest.mock("@/lib/statistics-snapshot", () => ({
  getStatisticsSnapshot: () => SNAPSHOT,
}));

import { GET } from "@/app/api/statistics/route";
import { fetchGithubStats } from "@/lib/github-service";
import { fetchLeetCodeStats } from "@/lib/leetcode-service";

const mockFetchGithubStats = fetchGithubStats as jest.MockedFunction<
  typeof fetchGithubStats
>;
const mockFetchLeetCodeStats = fetchLeetCodeStats as jest.MockedFunction<
  typeof fetchLeetCodeStats
>;

const MOCK_GITHUB = {
  repositories: 42,
  contributions: 500,
  stars: 10,
  forks: 5,
  followers: 20,
  languages: [{ name: "TypeScript", percentage: 80, color: "#3178c6" }],
  currentStreak: { count: 7, startDate: "2024-01-01", endDate: "2024-01-07" },
  longestStreak: { count: 30, startDate: "2023-01-01", endDate: "2023-01-30" },
  totalCommits: 1000,
  totalPRs: 50,
  totalIssues: 10,
  totalRepos: 42,
  contributionDays: [],
};

const MOCK_LEETCODE = {
  totalSolved: 700,
  easySolved: 300,
  mediumSolved: 300,
  hardSolved: 100,
  ranking: 5000,
  contributionPoint: 100,
  reputation: 0,
  currentStreak: { count: 5, startDate: "2024-01-01", endDate: "2024-01-05" },
  longestStreak: { count: 20, startDate: "2023-06-01", endDate: "2023-06-20" },
  activeYears: [2023, 2024],
  totalActiveDays: 200,
  submissionCalendar: {},
};

beforeEach(() => {
  jest.clearAllMocks();
});

describe("GET /api/statistics", () => {
  it("returns 200 with github and leetcode keys when both succeed", async () => {
    mockFetchGithubStats.mockResolvedValueOnce(MOCK_GITHUB as never);
    mockFetchLeetCodeStats.mockResolvedValueOnce(MOCK_LEETCODE as never);

    const response = await GET();
    expect(response.status).toBe(200);

    const body = await response.json();
    expect(body).toHaveProperty("github");
    expect(body).toHaveProperty("leetcode");
    expect(body.github.repositories).toBe(42);
    expect(body.leetcode.totalSolved).toBe(700);
  });

  it("serves the SNAPSHOT — not zeros — when fetchGithubStats throws", async () => {
    mockFetchGithubStats.mockRejectedValueOnce(new Error("GitHub API error"));
    mockFetchLeetCodeStats.mockResolvedValueOnce(MOCK_LEETCODE as never);

    const response = await GET();
    expect(response.status).toBe(200);

    const body = await response.json();
    // The assertion the all-zeros mock could not make: the last-known-good
    // numbers survive an upstream failure.
    expect(body.github).toEqual(SNAPSHOT.github);
    expect(body.github.contributions).toBe(SNAPSHOT.github.contributions);
    expect(body.stale.github).toBe(true);
    // LeetCode is unaffected, and says so.
    expect(body.leetcode.totalSolved).toBe(MOCK_LEETCODE.totalSolved);
    expect(body.stale.leetcode).toBe(false);
  });

  it("marks nothing stale when both upstreams answer", async () => {
    mockFetchGithubStats.mockResolvedValueOnce(MOCK_GITHUB as never);
    mockFetchLeetCodeStats.mockResolvedValueOnce(MOCK_LEETCODE as never);

    const body = await (await GET()).json();
    expect(body.stale).toEqual({ github: false, leetcode: false });
  });

  it("serves a GENUINE zero as live data, not as a fallback", async () => {
    // The other half of the distinction. A real zero must reach the page: if
    // the route treated it as a failure, a quiet year would be papered over
    // with last year's numbers forever.
    mockFetchGithubStats.mockResolvedValueOnce({
      ...MOCK_GITHUB,
      contributions: 0,
      contributionDays: [],
    } as never);
    mockFetchLeetCodeStats.mockResolvedValueOnce(MOCK_LEETCODE as never);

    const body = await (await GET()).json();
    expect(body.github.contributions).toBe(0);
    expect(body.stale.github).toBe(false);
  });

  it("returns 200 with fallback leetcode data when fetchLeetCodeStats throws", async () => {
    mockFetchGithubStats.mockResolvedValueOnce(MOCK_GITHUB as never);
    mockFetchLeetCodeStats.mockRejectedValueOnce(
      new Error("LeetCode API error")
    );

    const response = await GET();
    expect(response.status).toBe(200);

    const body = await response.json();
    // GitHub should have real data
    expect(body.github.repositories).toBe(42);
    expect(body.stale.github).toBe(false);
    // LeetCode falls back to the snapshot, and says so.
    expect(body.leetcode).toEqual(SNAPSHOT.leetcode);
    expect(body.stale.leetcode).toBe(true);
  });

  it("returns 200 with fallback data when both services throw", async () => {
    mockFetchGithubStats.mockRejectedValueOnce(new Error("GitHub down"));
    mockFetchLeetCodeStats.mockRejectedValueOnce(new Error("LeetCode down"));

    const response = await GET();
    expect(response.status).toBe(200);

    const body = await response.json();
    expect(body.github).toEqual(SNAPSHOT.github);
    expect(body.leetcode).toEqual(SNAPSHOT.leetcode);
    expect(body.stale).toEqual({ github: true, leetcode: true });
  });

  it("response body is valid JSON", async () => {
    mockFetchGithubStats.mockResolvedValueOnce(MOCK_GITHUB as never);
    mockFetchLeetCodeStats.mockResolvedValueOnce(MOCK_LEETCODE as never);

    const response = await GET();
    // If json() doesn't throw, the response is valid JSON
    await expect(response.json()).resolves.not.toThrow();
  });
});
