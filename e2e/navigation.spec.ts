import { test, expect } from "@playwright/test";

test.describe("Navigation", () => {
  test("home page loads with hero content", async ({ page }) => {
    await page.goto("/");
    await expect(page).toHaveTitle(/Shailesh Chaudhari/i);
    await expect(
      page.getByRole("heading", { name: /Shailesh Chaudhari/i })
    ).toBeVisible();
  });

  test("navbar links are present and functional", async ({ page }) => {
    await page.goto("/");
    // All main nav links visible
    for (const label of ["About", "Portfolio", "Blog", "Contact"]) {
      await expect(
        page.getByRole("link", { name: label }).first()
      ).toBeVisible();
    }
  });

  test("about page loads with experience section", async ({ page }) => {
    await page.goto("/about");
    await expect(page).toHaveTitle(/About/i);
    // Show More button should be present (content is collapsed by default)
    await expect(
      page.getByRole("button", { name: /show more/i })
    ).toBeVisible();
  });

  test("about page expands education and experience on click", async ({
    page,
  }) => {
    await page.goto("/about");
    await page.getByRole("button", { name: /show more/i }).click();
    await expect(
      page.getByRole("heading", { name: /professional experience/i })
    ).toBeVisible();
    await expect(
      page.getByRole("heading", { name: /education/i })
    ).toBeVisible();
  });

  test("portfolio page lists projects", async ({ page }) => {
    await page.goto("/portfolio");
    await expect(page).toHaveTitle(/Portfolio/i);
    // At least EduScale should be visible
    await expect(page.getByText("EduScale")).toBeVisible();
  });

  test("blogs page loads with article cards", async ({ page }) => {
    await page.goto("/blogs");
    await expect(page).toHaveTitle(/Blog/i);
    // At least one article card should appear
    await expect(
      page
        .locator(
          "article, [data-testid='blog-card'], .blog-card, a[href^='/blog/']"
        )
        .first()
    ).toBeVisible();
  });

  test("contact page has a form", async ({ page }) => {
    await page.goto("/contact");
    await expect(page).toHaveTitle(/Contact/i);
    await expect(page.getByRole("textbox", { name: /name/i })).toBeVisible();
    await expect(page.getByRole("textbox", { name: /email/i })).toBeVisible();
  });

  test("statistics page loads", async ({ page }) => {
    await page.goto("/statistics");
    await expect(page).toHaveTitle(/Statistics/i);
  });

  test("hire page loads with correct resume link", async ({ page }) => {
    await page.goto("/hire");
    await expect(page).toHaveTitle(/Hire/i);
    const resumeLink = page.getByRole("link", { name: /resume/i });
    await expect(resumeLink).toBeVisible();
    await expect(resumeLink).toHaveAttribute(
      "href",
      "/Shailesh_Chaudhari_Resume.pdf"
    );
  });
});
