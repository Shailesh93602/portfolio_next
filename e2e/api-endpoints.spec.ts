import { test, expect } from "@playwright/test";

test.describe("API & Static Endpoints", () => {
  test("/feed.xml returns valid RSS", async ({ request }) => {
    const response = await request.get("/feed.xml");
    expect(response.status()).toBe(200);
    const body = await response.text();
    expect(body).toContain("<rss");
    expect(body).toContain("<item>");
  });

  test("/robots.txt is accessible", async ({ request }) => {
    const response = await request.get("/robots.txt");
    expect(response.status()).toBe(200);
    const body = await response.text();
    // robots.txt should mention Sitemap or User-agent
    expect(body.toLowerCase()).toMatch(/sitemap|user-agent/);
  });

  test("/sitemap.xml is accessible", async ({ request }) => {
    const response = await request.get("/sitemap.xml");
    expect(response.status()).toBe(200);
    const body = await response.text();
    // Valid sitemap contains <loc> elements
    expect(body).toContain("loc");
  });

  test("OG image API returns an image", async ({ request }) => {
    const response = await request.get("/api/og?title=Test+Post&type=blog", {
      timeout: 30000,
    });
    expect(response.status()).toBe(200);
    const contentType = response.headers()["content-type"];
    expect(contentType).toMatch(/image/);
  });

  test("/api/statistics returns JSON with github and leetcode keys", async ({
    request,
  }) => {
    const response = await request.get("/api/statistics", { timeout: 30000 });
    // Accept 200 (real data or fallback)
    expect(response.status()).toBe(200);
    const body = await response.json();
    expect(body).toHaveProperty("github");
    expect(body).toHaveProperty("leetcode");
  });
});
