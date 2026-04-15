import { test, expect } from "@playwright/test";

/** Set the site theme via localStorage and reload */
async function setTheme(
  page: import("@playwright/test").Page,
  theme: "light" | "dark"
) {
  await page.evaluate((t) => localStorage.setItem("theme", t), theme);
  await page.reload({ waitUntil: "load" });
}

test.describe("Navigation", () => {
  test("home page loads with hero content", async ({ page }) => {
    await page.goto("/");
    await expect(page).toHaveTitle(/Shailesh Chaudhari/i);
    await expect(
      page.getByRole("heading", { name: /Shailesh Chaudhari/i })
    ).toBeVisible();
  });

  test("navbar links are present and functional", async ({ page, isMobile }) => {
    await page.goto("/");

    if (isMobile) {
      // On mobile, open the hamburger menu first
      await page.getByRole("button", { name: /open menu/i }).click();
      await page.waitForTimeout(400); // wait for slide-in animation
    }

    for (const label of ["About", "Portfolio", "Blogs", "Contact"]) {
      await expect(
        page.getByRole("link", { name: label }).first()
      ).toBeVisible();
    }
  });

  test("about page loads with all sections visible by default", async ({
    page,
  }) => {
    await page.goto("/about");
    await expect(page).toHaveTitle(/About/i);
    // Content is expanded by default — key sections should be visible
    await expect(
      page.getByRole("heading", { name: /professional experience/i })
    ).toBeVisible();
    await expect(
      page.getByRole("heading", { name: /education/i })
    ).toBeVisible();
    // Show Less button should be present (content is expanded)
    await expect(
      page.getByRole("button", { name: /show less/i })
    ).toBeVisible();
  });

  test("about page collapses content on Show Less click", async ({ page }) => {
    await page.goto("/about");
    const showLessBtn = page.getByRole("button", { name: /show less/i });
    await showLessBtn.scrollIntoViewIfNeeded();
    await showLessBtn.click({ force: true });
    // After collapse the button becomes "Show More"
    await expect(
      page.getByRole("button", { name: /show more/i })
    ).toBeVisible();
  });

  test("portfolio page lists projects", async ({ page }) => {
    await page.goto("/portfolio");
    await expect(page).toHaveTitle(/Projects/i);
    await expect(page.getByText("EduScale").first()).toBeVisible({
      timeout: 10000,
    });
  });

  test("blogs page loads with article cards", async ({ page }) => {
    await page.goto("/blogs");
    await expect(page).toHaveTitle(/Blog/i);
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
    await expect(page).toHaveTitle(/Coding Stats/i);
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

  test("skip-to-main link is present in DOM", async ({ page }) => {
    await page.goto("/");
    const skipLink = page.getByRole("link", { name: /skip to main content/i });
    await expect(skipLink).toBeAttached();
    await expect(skipLink).toHaveAttribute("href", "#main-content");
  });
});

test.describe("Navigation — dark mode", () => {
  test("home page renders in dark mode", async ({ page }) => {
    await page.goto("/");
    await setTheme(page, "dark");
    await expect(page.locator("html")).toHaveClass(/dark/);
    await expect(
      page.getByRole("heading", { name: /Shailesh Chaudhari/i })
    ).toBeVisible();
  });

  test("about page shows all sections in dark mode", async ({ page }) => {
    await page.goto("/about");
    await setTheme(page, "dark");
    await expect(page.locator("html")).toHaveClass(/dark/);
    await expect(
      page.getByRole("heading", { name: /professional experience/i })
    ).toBeVisible();
  });

  test("portfolio page lists projects in dark mode", async ({ page }) => {
    await page.goto("/portfolio");
    await setTheme(page, "dark");
    await expect(page.locator("html")).toHaveClass(/dark/);
    await expect(page.getByText("EduScale").first()).toBeVisible({
      timeout: 10000,
    });
  });

  test("contact form is visible in dark mode", async ({ page }) => {
    await page.goto("/contact");
    await setTheme(page, "dark");
    await expect(page.locator("html")).toHaveClass(/dark/);
    await expect(page.getByRole("textbox", { name: /name/i })).toBeVisible();
  });
});
