/**
 * Tests for lib/hooks/useBlogPosts.ts and lib/hooks/useStats.ts
 */
import { renderHook, act, waitFor } from "@testing-library/react";
import axios from "axios";

// ─── useBlogPosts ─────────────────────────────────────────────────────────────

const mockPost = {
  slug: "redis-distributed-locks",
  title: "Redis Distributed Locks",
  description: "How to use Redlock for distributed locking",
  image: "/images/redis.webp",
  date: "2024-03-01",
  readTime: "5 min read",
  tags: ["redis", "distributed-systems"],
  author: { name: "Shailesh Chaudhari", avatar: "/shailesh.webp" },
};

const mockPost2 = {
  slug: "nestjs-auth",
  title: "NestJS JWT Auth",
  description: "Building auth in NestJS with Passport",
  image: "/images/nestjs.webp",
  date: "2024-04-01",
  readTime: "4 min read",
  tags: ["nestjs", "auth"],
  author: { name: "Shailesh Chaudhari", avatar: "/shailesh.webp" },
};

const mockFetch = jest.fn();

describe("useBlogPosts", () => {
  beforeEach(() => {
    mockFetch.mockClear();
    globalThis.fetch = mockFetch;
  });

  it("starts in loading state with empty posts", async () => {
    mockFetch.mockResolvedValueOnce({ json: async () => [mockPost] });

    const { useBlogPosts } = await import("@/lib/hooks/useBlogPosts");
    const { result } = renderHook(() => useBlogPosts());

    expect(result.current.isLoading).toBe(true);
    expect(result.current.posts).toEqual([]);
  });

  it("fetches posts and sets loading to false", async () => {
    mockFetch.mockResolvedValueOnce({
      json: async () => [mockPost, mockPost2],
    });

    const { useBlogPosts } = await import("@/lib/hooks/useBlogPosts");
    const { result } = renderHook(() => useBlogPosts());

    await waitFor(() => expect(result.current.isLoading).toBe(false));
    expect(result.current.posts).toHaveLength(2);
  });

  it("fetches with tag param when initialTag is provided", async () => {
    mockFetch.mockResolvedValueOnce({ json: async () => [mockPost] });

    const { useBlogPosts } = await import("@/lib/hooks/useBlogPosts");
    renderHook(() => useBlogPosts("redis"));

    await waitFor(() => expect(mockFetch).toHaveBeenCalled());
    const url = mockFetch.mock.calls[0][0] as string;
    expect(url).toContain("tag=redis");
  });

  it("fetches with search param when initialSearch is provided", async () => {
    mockFetch.mockResolvedValueOnce({ json: async () => [mockPost] });

    const { useBlogPosts } = await import("@/lib/hooks/useBlogPosts");
    renderHook(() => useBlogPosts("", "socket"));

    await waitFor(() => expect(mockFetch).toHaveBeenCalled());
    const url = mockFetch.mock.calls[0][0] as string;
    expect(url).toContain("search=socket");
  });

  it("does not include empty params in fetch URL", async () => {
    mockFetch.mockResolvedValueOnce({ json: async () => [] });

    const { useBlogPosts } = await import("@/lib/hooks/useBlogPosts");
    renderHook(() => useBlogPosts());

    await waitFor(() => expect(mockFetch).toHaveBeenCalled());
    const url = mockFetch.mock.calls[0][0] as string;
    expect(url).not.toContain("tag=");
    expect(url).not.toContain("search=");
  });

  it("sets loading to false even when fetch throws", async () => {
    mockFetch.mockRejectedValueOnce(new Error("Network error"));

    const { useBlogPosts } = await import("@/lib/hooks/useBlogPosts");
    const { result } = renderHook(() => useBlogPosts());

    await waitFor(() => expect(result.current.isLoading).toBe(false));
    expect(result.current.posts).toEqual([]);
  });

  it("re-fetches when selectedTag changes", async () => {
    mockFetch
      .mockResolvedValueOnce({ json: async () => [mockPost] })
      .mockResolvedValueOnce({ json: async () => [mockPost2] });

    const { useBlogPosts } = await import("@/lib/hooks/useBlogPosts");
    const { result } = renderHook(() => useBlogPosts());

    await waitFor(() => expect(result.current.isLoading).toBe(false));
    expect(mockFetch).toHaveBeenCalledTimes(1);

    act(() => {
      result.current.setSelectedTag("nestjs");
    });

    await waitFor(() => expect(mockFetch).toHaveBeenCalledTimes(2));
    const secondUrl = mockFetch.mock.calls[1][0] as string;
    expect(secondUrl).toContain("tag=nestjs");
  });

  it("exposes setSearchQuery to update the search query", async () => {
    mockFetch
      .mockResolvedValueOnce({ json: async () => [] })
      .mockResolvedValueOnce({ json: async () => [mockPost] });

    const { useBlogPosts } = await import("@/lib/hooks/useBlogPosts");
    const { result } = renderHook(() => useBlogPosts());

    await waitFor(() => expect(result.current.isLoading).toBe(false));

    act(() => {
      result.current.setSearchQuery("redis");
    });

    await waitFor(() => expect(mockFetch).toHaveBeenCalledTimes(2));
    const secondUrl = mockFetch.mock.calls[1][0] as string;
    expect(secondUrl).toContain("search=redis");
  });
});

// ─── useStats ─────────────────────────────────────────────────────────────────

jest.mock("axios");
const mockedAxios = axios as jest.Mocked<typeof axios>;

const mockStats = {
  github: {
    repositories: 42,
    contributions: 1234,
    stars: 56,
    forks: 12,
    followers: 88,
    languages: { TypeScript: 60, JavaScript: 40 },
  },
  leetcode: { totalSolved: 300, ranking: 50000 },
  gfg: {
    instituteRank: 1,
    problemsSolved: 200,
    codingScore: 500,
    problemsByDifficulty: { basic: 50, easy: 80, medium: 60, hard: 10 },
  },
};

describe("useStats", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("starts in loading state with null stats", () => {
    mockedAxios.get.mockReturnValueOnce(new Promise(() => {})); // never resolves

    const { useStats } = require("@/lib/hooks/useStats");
    const { result } = renderHook(() => useStats());

    expect(result.current.loading).toBe(true);
    expect(result.current.stats).toBeNull();
    expect(result.current.error).toBeNull();
  });

  it("sets stats and stops loading after successful fetch", async () => {
    mockedAxios.get.mockResolvedValueOnce({ data: mockStats });

    const { useStats } = require("@/lib/hooks/useStats");
    const { result } = renderHook(() => useStats());

    await waitFor(() => expect(result.current.loading).toBe(false));
    expect(result.current.stats).toEqual(mockStats);
    expect(result.current.error).toBeNull();
  });

  it("sets error and stops loading when fetch fails", async () => {
    mockedAxios.get.mockRejectedValueOnce(new Error("Network error"));

    const { useStats } = require("@/lib/hooks/useStats");
    const { result } = renderHook(() => useStats());

    await waitFor(() => expect(result.current.loading).toBe(false));
    expect(result.current.stats).toBeNull();
    expect(result.current.error).toBe("Failed to load statistics");
  });

  it("calls /api/statistics endpoint", async () => {
    mockedAxios.get.mockResolvedValueOnce({ data: mockStats });

    const { useStats } = require("@/lib/hooks/useStats");
    renderHook(() => useStats());

    await waitFor(() => expect(mockedAxios.get).toHaveBeenCalledTimes(1));
    expect(mockedAxios.get).toHaveBeenCalledWith("/api/statistics");
  });

  it("refetch re-calls the API", async () => {
    mockedAxios.get
      .mockResolvedValueOnce({ data: mockStats })
      .mockResolvedValueOnce({
        data: { ...mockStats, leetcode: { totalSolved: 310, ranking: 49000 } },
      });

    const { useStats } = require("@/lib/hooks/useStats");
    const { result } = renderHook(() => useStats());

    await waitFor(() => expect(result.current.loading).toBe(false));
    expect(mockedAxios.get).toHaveBeenCalledTimes(1);

    await act(async () => {
      await result.current.refetch();
    });

    expect(mockedAxios.get).toHaveBeenCalledTimes(2);
    expect(result.current.stats?.leetcode.totalSolved).toBe(310);
  });

  it("resets error to null on successful refetch after failure", async () => {
    mockedAxios.get
      .mockRejectedValueOnce(new Error("fail"))
      .mockResolvedValueOnce({ data: mockStats });

    const { useStats } = require("@/lib/hooks/useStats");
    const { result } = renderHook(() => useStats());

    await waitFor(() =>
      expect(result.current.error).toBe("Failed to load statistics")
    );

    await act(async () => {
      await result.current.refetch();
    });

    expect(result.current.error).toBeNull();
    expect(result.current.stats).toEqual(mockStats);
  });
});
