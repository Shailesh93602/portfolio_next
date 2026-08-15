import { test, expect } from "@playwright/test";

/**
 * /statistics resilience.
 *
 * The page is server-rendered from `data/statistics-snapshot.json` and then
 * refetched client-side from /api/statistics. The failure mode that matters:
 * when the upstream GitHub / LeetCode APIs are slow or down, a recruiter must
 * still see real numbers — never a spinner, and never a red error banner
 * sitting on top of numbers that rendered perfectly well.
 */

const SNAPSHOT_MARKER = /Repositories|Total Solved|LeetCode/i;

test.describe("Statistics snapshot fallback", () => {
  test("SSR HTML already contains real numbers, not a loading spinner", async ({
    request,
  }) => {
    const res = await request.get("/statistics");
    expect(res.status()).toBe(200);
    const html = await res.text();

    expect(html).not.toContain("Loading your coding statistics");
    expect(html).toMatch(SNAPSHOT_MARKER);
  });

  test("upstream API failure still renders the snapshot numbers", async ({
    page,
  }) => {
    // Simulate the upstream timing out / erroring for the client refetch.
    await page.route("**/api/statistics", (route) =>
      route.fulfill({ status: 504, body: "gateway timeout" })
    );

    await page.goto("/statistics", { waitUntil: "networkidle" });
    // TanStack Query retries twice with a 1s delay before settling into error.
    await page.waitForTimeout(4000);

    const body = await page.locator("main, body").first().innerText();
    expect(body, "snapshot numbers disappeared on upstream failure").toMatch(
      SNAPSHOT_MARKER
    );
    expect(
      body,
      "the page fell back to a loading spinner instead of the snapshot"
    ).not.toContain("Loading your coding statistics");

    // Regression guard for the confusing double-state: the snapshot rendered
    // fine, so a red "Error loading statistics" banner on top of it is a bug,
    // not a status report.
    expect(
      body,
      "error banner shown even though the snapshot rendered"
    ).not.toContain("Error loading statistics");
  });

  test("a slow upstream never leaves the page stuck on a spinner", async ({
    page,
  }) => {
    await page.route("**/api/statistics", async (route) => {
      await new Promise((r) => setTimeout(r, 12000));
      return route.fulfill({ status: 200, body: JSON.stringify({}) });
    });

    await page.goto("/statistics", { waitUntil: "domcontentloaded" });
    await page.waitForTimeout(1500);

    const body = await page.locator("body").innerText();
    expect(body).not.toContain("Loading your coding statistics");
    expect(body).toMatch(SNAPSHOT_MARKER);
  });

  test("/api/statistics answers with the snapshot shape even when live data is unavailable", async ({
    request,
  }) => {
    const res = await request.get("/api/statistics");
    expect(res.status()).toBe(200);
    const data = await res.json();
    expect(data.github, "no github block in /api/statistics").toBeTruthy();
    expect(data.leetcode, "no leetcode block in /api/statistics").toBeTruthy();
    expect(typeof data.github.repositories).toBe("number");
    expect(typeof data.leetcode.totalSolved).toBe("number");
  });
});
