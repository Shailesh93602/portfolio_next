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

  it("returns 200 with fallback github data when fetchGithubStats throws", async () => {
    mockFetchGithubStats.mockRejectedValueOnce(new Error("GitHub API error"));
    mockFetchLeetCodeStats.mockResolvedValueOnce(MOCK_LEETCODE as never);

    const response = await GET();
    expect(response.status).toBe(200);

    const body = await response.json();
    expect(body).toHaveProperty("github");
    expect(body).toHaveProperty("leetcode");
    // Fallback github has repositories: 0
    expect(body.github.repositories).toBe(0);
    // LeetCode should still have data
    expect(body.leetcode.totalSolved).toBe(700);
  });

  it("returns 200 with fallback leetcode data when fetchLeetCodeStats throws", async () => {
    mockFetchGithubStats.mockResolvedValueOnce(MOCK_GITHUB as never);
    mockFetchLeetCodeStats.mockRejectedValueOnce(new Error("LeetCode API error"));

    const response = await GET();
    expect(response.status).toBe(200);

    const body = await response.json();
    expect(body).toHaveProperty("github");
    expect(body).toHaveProperty("leetcode");
    // GitHub should have real data
    expect(body.github.repositories).toBe(42);
    // Fallback leetcode has totalSolved: 0
    expect(body.leetcode.totalSolved).toBe(0);
  });

  it("returns 200 with fallback data when both services throw", async () => {
    mockFetchGithubStats.mockRejectedValueOnce(new Error("GitHub down"));
    mockFetchLeetCodeStats.mockRejectedValueOnce(new Error("LeetCode down"));

    const response = await GET();
    expect(response.status).toBe(200);

    const body = await response.json();
    expect(body).toHaveProperty("github");
    expect(body).toHaveProperty("leetcode");
    expect(body.github.repositories).toBe(0);
    expect(body.leetcode.totalSolved).toBe(0);
  });

  it("response body is valid JSON", async () => {
    mockFetchGithubStats.mockResolvedValueOnce(MOCK_GITHUB as never);
    mockFetchLeetCodeStats.mockResolvedValueOnce(MOCK_LEETCODE as never);

    const response = await GET();
    // If json() doesn't throw, the response is valid JSON
    await expect(response.json()).resolves.not.toThrow();
  });
});
