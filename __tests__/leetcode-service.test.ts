/**
 * Tests for lib/leetcode-service.ts
 * Covers fetchLeetCodeStats (and the private helpers it calls:
 * calculateCurrentStreak, calculateLongestStreak, formatLeetCodeData).
 */
import axios from "axios";
import { getLocalDate, daysBetween } from "@/lib/github-service";
import { fetchLeetCodeStats } from "@/lib/leetcode-service";

jest.mock("axios");
const mockedAxios = axios as jest.Mocked<typeof axios>;

// ─── Shared helper re-tests (LeetCode usage patterns) ────────────────────────

describe("LeetCode streak helpers (via github-service exports)", () => {
  describe("getLocalDate with LeetCode UNIX timestamps", () => {
    it("returns a YYYY-MM-DD string for any UNIX timestamp (seconds)", () => {
      const timestamps = [1704067200, 1704063600, 1609459200, 1672531200];
      timestamps.forEach((ts) => {
        expect(getLocalDate(new Date(ts * 1000))).toMatch(
          /^\d{4}-\d{2}-\d{2}$/
        );
      });
    });

    it("produces the same date for timestamps on the same calendar day in IST", () => {
      const morning = new Date("2024-01-01T00:00:00.000Z");
      const afternoon = new Date("2024-01-01T12:30:00.000Z");
      expect(getLocalDate(morning)).toBe(getLocalDate(afternoon));
    });
  });

  describe("daysBetween for streak calculation", () => {
    it("single-day streak counts as 1", () => {
      expect(daysBetween("2024-01-01", "2024-01-01")).toBe(1);
    });

    it("7-day streak counts as 7", () => {
      expect(daysBetween("2024-01-01", "2024-01-07")).toBe(7);
    });

    it("returns 0 for empty inputs", () => {
      expect(daysBetween("", "2024-01-01")).toBe(0);
      expect(daysBetween("2024-01-01", "")).toBe(0);
    });
  });
});

// ─── fetchLeetCodeStats ───────────────────────────────────────────────────────

const pastDay1 = Math.floor(new Date("2024-01-01").getTime() / 1000).toString();
const pastDay2 = Math.floor(new Date("2024-01-02").getTime() / 1000).toString();
const pastDay3 = Math.floor(new Date("2024-01-03").getTime() / 1000).toString();

const makeMatchedUser = () => ({
  submissionCalendar: JSON.stringify({
    [pastDay1]: 2,
    [pastDay2]: 3,
    [pastDay3]: 1,
  }),
  userCalendar: {
    streak: 3,
    totalActiveDays: 150,
    activeYears: [2022, 2023, 2024],
  },
  submitStats: {
    acSubmissionNum: [
      { difficulty: "All", count: 300, submissions: 500 },
      { difficulty: "Easy", count: 150, submissions: 200 },
      { difficulty: "Medium", count: 120, submissions: 250 },
      { difficulty: "Hard", count: 30, submissions: 50 },
    ],
    totalSubmissionNum: [
      { difficulty: "All", count: 500, submissions: 500 },
      { difficulty: "Easy", count: 200, submissions: 200 },
      { difficulty: "Medium", count: 250, submissions: 250 },
      { difficulty: "Hard", count: 50, submissions: 50 },
    ],
  },
  contributions: { points: 500 },
  profile: { reputation: 100, ranking: 50000 },
});

// mockResolvedValue (not Once) so all year-iterations (2022–now) get the same response
// Note: service does `return res.data.data as LeetCodeYearData` so all fields go inside data.data
const makeApiResponse = () => ({
  data: {
    data: {
      matchedUser: makeMatchedUser(),
      allQuestionsCount: [
        { difficulty: "All", count: 3000 },
        { difficulty: "Easy", count: 800 },
        { difficulty: "Medium", count: 1700 },
        { difficulty: "Hard", count: 500 },
      ],
      recentSubmissionList: [
        {
          title: "Two Sum",
          titleSlug: "two-sum",
          timestamp: 1704067200,
          statusDisplay: "Accepted",
          lang: "typescript",
          __typename: "SubmissionDump",
        },
      ],
    },
  },
});

describe("fetchLeetCodeStats", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("returns formatted stats for a valid user", async () => {
    mockedAxios.post.mockResolvedValue(makeApiResponse());
    mockedAxios.get.mockRejectedValue(new Error("skip"));

    const result = await fetchLeetCodeStats("shailesh93602");

    expect(result).not.toBeNull();
    expect(result?.totalSolved).toBe(300);
    expect(result?.easySolved).toBe(150);
    expect(result?.mediumSolved).toBe(120);
    expect(result?.hardSolved).toBe(30);
    expect(result?.ranking).toBe(50000);
  });

  it("returns total questions from the API", async () => {
    mockedAxios.post.mockResolvedValue(makeApiResponse());
    mockedAxios.get.mockRejectedValue(new Error("skip"));

    const result = await fetchLeetCodeStats("shailesh93602");

    expect(result?.totalQuestions).toBe(3000);
    expect(result?.totalEasy).toBe(800);
    expect(result?.totalMedium).toBe(1700);
    expect(result?.totalHard).toBe(500);
  });

  it("includes submission calendar in result", async () => {
    mockedAxios.post.mockResolvedValue(makeApiResponse());
    mockedAxios.get.mockRejectedValue(new Error("skip"));

    const result = await fetchLeetCodeStats("shailesh93602");

    expect(result?.submissionCalendar).toBeDefined();
    expect(typeof result?.submissionCalendar).toBe("object");
  });

  it("includes streak objects in result", async () => {
    mockedAxios.post.mockResolvedValue(makeApiResponse());
    mockedAxios.get.mockRejectedValue(new Error("skip"));

    const result = await fetchLeetCodeStats("shailesh93602");

    expect(result?.currentStreak).toBeDefined();
    expect(typeof result?.currentStreak.count).toBe("number");
    expect(result?.longestStreak).toBeDefined();
    expect(typeof result?.longestStreak.count).toBe("number");
  });

  it("includes recent submissions in result", async () => {
    mockedAxios.post.mockResolvedValue(makeApiResponse());
    mockedAxios.get.mockRejectedValue(new Error("skip"));

    const result = await fetchLeetCodeStats("shailesh93602");

    expect(Array.isArray(result?.recentSubmissions)).toBe(true);
    expect(result?.recentSubmissions[0].title).toBe("Two Sum");
  });

  it("returns null when all year fetches fail", async () => {
    mockedAxios.post.mockRejectedValue(new Error("Network error"));
    mockedAxios.get.mockRejectedValue(new Error("Network error"));

    const result = await fetchLeetCodeStats("shailesh93602");

    expect(result).toBeNull();
  });

  it("returns null when API returns GraphQL errors for every year", async () => {
    mockedAxios.post.mockResolvedValue({
      data: {
        errors: [{ message: "User not found" }],
        data: {
          matchedUser: null,
          allQuestionsCount: [],
          recentSubmissionList: [],
        },
      },
    });
    mockedAxios.get.mockRejectedValue(new Error("skip"));

    const result = await fetchLeetCodeStats("ghost-user");

    expect(result).toBeNull();
  });

  it("includes active years from userCalendar", async () => {
    mockedAxios.post.mockResolvedValue(makeApiResponse());
    mockedAxios.get.mockRejectedValue(new Error("skip"));

    const result = await fetchLeetCodeStats("shailesh93602");

    expect(result?.activeYears).toContain(2024);
    expect(typeof result?.totalActiveDays).toBe("number");
  });

  it("returns null when matchedUser is null in all year data", async () => {
    mockedAxios.post.mockResolvedValue({
      data: {
        data: {
          matchedUser: null,
          allQuestionsCount: [{ difficulty: "All", count: 3000 }],
          recentSubmissionList: [],
        },
      },
    });
    mockedAxios.get.mockRejectedValue(new Error("skip"));

    const result = await fetchLeetCodeStats("shailesh93602");

    expect(result).toBeNull();
  });
});
