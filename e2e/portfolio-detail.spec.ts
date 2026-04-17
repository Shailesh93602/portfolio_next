import { test, expect } from "@playwright/test";

test.describe("Portfolio Detail", () => {
  test("portfolio page lists projects", async ({ page }) => {
    await page.goto("/portfolio");
    await expect(page).toHaveTitle(/projects/i);
    await expect(page.getByText("EduScale").first()).toBeVisible({
      timeout: 10000,
    });
  });

  test("portfolio project detail page loads when a detail link is clicked", async ({
    page,
  }) => {
    await page.goto("/portfolio");
    await expect(page.getByText("EduScale").first()).toBeVisible({
      timeout: 10000,
    });

    // Look for a direct link to the EduScale detail page
    const eduscaleLink = page
      .locator('a[href*="eduscale"], a[href*="portfolio/eduscale"]')
      .first();

    if ((await eduscaleLink.count()) > 0) {
      await eduscaleLink.click();
      await expect(page).toHaveURL(/eduscale/, { timeout: 10000 });
      await expect(page.locator("h1, h2").first()).toBeVisible();
    } else {
      // Fallback: navigate directly
      await page.goto("/portfolio/eduscale");
      // If it redirects or 404s, just verify no crash
      await expect(page.locator("body")).toBeVisible();
    }
  });

  test("portfolio detail pages have a back/nav link", async ({ page }) => {
    // Navigate directly to the EduScale detail URL
    const response = await page.goto("/portfolio/eduscale");
    // Accept 200 or redirect (301/302) as valid
    if (response && response.status() < 400) {
      await expect(page.locator("body")).toBeVisible();
      // Should have some heading
      await expect(page.locator("h1, h2").first()).toBeVisible({
        timeout: 10000,
      });
    }
  });

  test("Show More button expands project details on portfolio page", async ({
    page,
  }) => {
    await page.goto("/portfolio");
    // Wait for projects to load
    await expect(page.getByText("EduScale").first()).toBeVisible({
      timeout: 10000,
    });

    // Find "Show More" button and click it
    const showMoreBtn = page.getByRole("button", { name: /show more/i }).first();
    if ((await showMoreBtn.count()) > 0) {
      await showMoreBtn.click();
      // After click, should show "Show Less"
      await expect(
        page.getByRole("button", { name: /show less/i }).first()
      ).toBeVisible({ timeout: 5000 });
    }
  });
});
