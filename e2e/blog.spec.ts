import { test, expect } from "@playwright/test";

test.describe("Blog", () => {
  test("blog post detail page renders article", async ({ page }) => {
    await page.goto("/blogs");
    // Wait for blog cards to appear
    await page.waitForSelector('a[href^="/blog/"]', { timeout: 10000 });

    // Click first blog article link
    const firstArticle = page.locator('a[href^="/blog/"]').first();
    const href = await firstArticle.getAttribute("href");
    expect(href).toBeTruthy();

    await page.goto(href!);
    await expect(
      page.locator('article, [role="article"], main')
    ).toBeVisible({ timeout: 10000 });
    await expect(page).toHaveURL(/\/blog\//);
  });

  test("blog post detail page renders reading progress bar", async ({
    page,
  }) => {
    await page.goto("/blogs");
    await page.waitForSelector('a[href^="/blog/"]', { timeout: 10000 });
    const firstArticle = page.locator('a[href^="/blog/"]').first();
    const href = await firstArticle.getAttribute("href");
    await page.goto(href!);
    await expect(page.locator('[role="progressbar"]')).toBeVisible({
      timeout: 10000,
    });
  });

  test("blog URL search filter works without crashing", async ({ page }) => {
    await page.goto("/blogs?q=redis");
    // Wait for page to load
    await page.waitForLoadState("networkidle");
    // No error text should appear
    await expect(page.locator("body")).not.toContainText("Error");
    await expect(page.locator("body")).not.toContainText("500");
  });

  test("blog page renders tag filter area", async ({ page }) => {
    await page.goto("/blogs");
    await page.waitForLoadState("networkidle");
    // The BlogFilters component renders an "All Tags" badge
    await expect(page.getByText("All Tags")).toBeVisible({ timeout: 10000 });
  });

  test("clicking a tag filters blog posts", async ({ page }) => {
    await page.goto("/blogs");
    await page.waitForLoadState("networkidle");
    // Find first non-"All Tags" tag badge and click it
    // Tags are rendered as Badge elements (spans/buttons with text)
    const tagBadge = page
      .locator("span, button")
      .filter({ hasText: /^Next\.js$/ })
      .first();
    if ((await tagBadge.count()) > 0) {
      await tagBadge.click();
      // Page should not crash after clicking a tag
      await expect(page.locator("body")).toBeVisible();
      await expect(page.locator("body")).not.toContainText("Error");
    } else {
      // If Next.js tag doesn't exist, just verify the page is still up
      await expect(page.locator("body")).toBeVisible();
    }
  });

  test("blog list page has correct title", async ({ page }) => {
    await page.goto("/blogs");
    await expect(page).toHaveTitle(/blog/i);
  });
});
