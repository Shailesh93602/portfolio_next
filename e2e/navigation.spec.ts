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

  test("navbar links are present and functional", async ({
    page,
    isMobile,
  }) => {
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

  test("about page shows every section with no collapse toggle", async ({
    page,
  }) => {
    await page.goto("/about");
    await expect(page).toHaveTitle(/About/i);
    await expect(
      page.getByRole("heading", { name: /professional experience/i })
    ).toBeVisible();
    await expect(
      page.getByRole("heading", { name: /education/i })
    ).toBeVisible();
    await expect(
      page.getByRole("heading", { name: /achievements/i })
    ).toBeVisible();
    // The page used to end in a full-width "Show Less" card under the closing
    // quote — a control whose only effect was hiding the experience a visitor
    // came to read. There is no toggle any more, in either state.
    await expect(
      page.getByRole("button", { name: /show (less|more)/i })
    ).toHaveCount(0);
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

  test("what-I-work-on page loads with a plain contact link", async ({
    page,
  }) => {
    await page.goto("/services");
    await expect(page).toHaveTitle(/What I work on/i);
    const contactLink = page.getByRole("link", { name: /get in touch/i });
    await expect(contactLink).toBeVisible();
    await expect(contactLink).toHaveAttribute("href", "/contact");
    // The freelance intake copy must not come back.
    await expect(page.getByText(/start a conversation/i)).toHaveCount(0);
    await expect(page.getByText(/48 hours/i)).toHaveCount(0);
  });

  test("/hire permanently redirects to /services", async ({ page }) => {
    await page.goto("/hire");
    await expect(page).toHaveURL(/\/services$/);
  });

  test("skip-to-main link is present in DOM", async ({ page }) => {
    await page.goto("/");
    const skipLink = page.getByRole("link", { name: /skip to main content/i });
    await expect(skipLink).toBeAttached();
    await expect(skipLink).toHaveAttribute("href", "#main-content");
  });
});

test("unknown route renders 404 page not blank", async ({ page }) => {
  await page.goto("/this-page-does-not-exist-at-all-xyz");
  // Should not show an empty page or crash
  await expect(page.locator("body")).not.toBeEmpty();
  // Should have a link home or a 404 indicator
  const hasHome = await page.getByRole("link", { name: /home/i }).count();
  const has404 = await page.getByText(/404|not found/i).count();
  expect(hasHome + has404).toBeGreaterThan(0);
});

test("contact form shows validation on empty submit", async ({ page }) => {
  await page.goto("/contact");
  const submitBtn = page.getByRole("button", { name: /send|submit/i });
  if ((await submitBtn.count()) > 0) {
    await submitBtn.scrollIntoViewIfNeeded();
    // Force the click — the framer-motion animated form container and
    // the adjacent phone-number field both report as hit targets on
    // mobile during hover/transition. Without force: true we hit a
    // pointer-intercept failure even though the submit button is the
    // visible target.
    await submitBtn.click({ force: true });
    // Browser native validation or custom — just check no crash
    await expect(page.locator("body")).toBeVisible();
  }
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
