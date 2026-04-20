/**
 * Tests for lib/hooks/useBlogPosts.ts
 */
import { renderHook, act, waitFor } from "@testing-library/react";

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

