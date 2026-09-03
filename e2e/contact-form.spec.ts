import { test, expect } from "@playwright/test";

/**
 * Contact form — the one interactive surface on the site.
 *
 * Two things must hold:
 *   1. Invalid input surfaces the *real* validation copy (react-hook-form
 *      messages, announced via role="alert"), not a silent no-op.
 *   2. Without RESEND_API_KEY the API answers 503 + {fallback:"mailto"} and
 *      the UI has to visibly fall back rather than showing a generic error.
 *      That is the behaviour on a fresh local/preview environment, so it is
 *      the path most likely to be hit by someone reviewing the site.
 */

test.describe("Contact form", () => {
  test("submitting empty shows the real per-field validation messages", async ({
    page,
  }) => {
    await page.goto("/contact", { waitUntil: "networkidle" });
    await page.getByRole("button", { name: /send message/i }).click();

    const alerts = page.locator('[role="alert"]');
    await expect(alerts.first()).toBeVisible();

    const messages = await alerts.allInnerTexts();
    expect(messages.join(" | ")).toContain("Full name is required");
    expect(messages.join(" | ")).toContain("Email is required");
    expect(messages.join(" | ")).toContain("Subject is required");
    expect(messages.join(" | ")).toContain("Message is required");

    // Errors must be wired to the inputs for screen readers, not just painted.
    await expect(page.locator("#fullName")).toHaveAttribute(
      "aria-invalid",
      "true"
    );
    await expect(page.locator("#fullName")).toHaveAttribute(
      "aria-describedby",
      "fullName-error"
    );
  });

  test("field-level rules reject a malformed email and phone", async ({
    page,
  }) => {
    await page.goto("/contact", { waitUntil: "networkidle" });

    await page.locator("#fullName").fill("Ada Lovelace");
    await page.locator("#email").fill("not-an-email");
    await page.locator("#phoneNumber").fill("12345");
    await page.locator("#subject").fill("Role");
    await page.locator("#message").fill("too short");
    await page.getByRole("button", { name: /send message/i }).click();

    const messages = (
      await page.locator('[role="alert"]').allInnerTexts()
    ).join(" | ");
    expect(messages).toContain("Invalid email format");
    expect(messages).toContain("valid phone number");
    expect(messages).toContain("Message must be at least 10 characters");
  });

  test("the API validates server-side too, not just in the browser", async ({
    request,
  }) => {
    const res = await request.post("/api/contact", {
      data: { fullName: "", email: "nope", subject: "", message: "short" },
    });
    expect(res.status()).toBe(400);
    const body = await res.json();
    expect(body.ok).toBe(false);
    expect(body.error).toBe("Validation failed");
    expect(Array.isArray(body.details)).toBe(true);
    expect(body.details.map((d: { field: string }) => d.field)).toEqual(
      expect.arrayContaining(["fullName", "email", "subject", "message"])
    );
  });

  test("a valid submit with no RESEND_API_KEY falls back to mailto instead of erroring", async ({
    page,
  }) => {
    await page.goto("/contact", { waitUntil: "networkidle" });

    // Capture the API answer so the assertion below reflects the environment
    // we're actually running in rather than assuming one.
    const responsePromise = page.waitForResponse(
      (r) => r.url().includes("/api/contact") && r.request().method() === "POST"
    );

    // The fallback path sets window.location to a mailto: URL. Block the
    // navigation so the test can assert on it without handing control to the
    // OS mail client.
    const mailtoUrls: string[] = [];
    await page.route("mailto:**", (route) => {
      mailtoUrls.push(route.request().url());
      return route.abort();
    });

    await page.locator("#fullName").fill("Ada Lovelace");
    await page.locator("#email").fill("ada@example.com");
    await page.locator("#subject").fill("Backend role");
    await page
      .locator("#message")
      .fill("Hello — I would like to talk about a backend engineering role.");
    await page.getByRole("button", { name: /send message/i }).click();

    const response = await responsePromise;
    const status = response.status();
    const payload = await response.json().catch(() => ({}));

    if (status === 503) {
      // Expected local/preview behaviour.
      expect(payload.fallback).toBe("mailto");
      const banner = page.locator('[role="status"]');
      await expect(banner).toBeVisible({ timeout: 15000 });
      await expect(banner).toContainText(/email client should open/i);
      // And it must NOT render the red generic failure banner. Scoped to the
      // form: Next.js ships a route announcer with role="alert" on every page,
      // so an unscoped count is always 1 and would assert nothing.
      await expect(
        page.locator('form [role="alert"]'),
        "generic failure banner shown alongside the mailto fallback"
      ).toHaveCount(0);
    } else if (status === 200) {
      // Configured environment — the success banner is the contract.
      const banner = page.locator('[role="status"]');
      await expect(banner).toBeVisible({ timeout: 15000 });
      await expect(banner).toContainText(/message sent/i);
    } else {
      throw new Error(
        `unexpected /api/contact status ${status}: ${JSON.stringify(payload)}`
      );
    }
  });

  test("the form is reachable and operable by keyboard", async ({ page }) => {
    await page.goto("/contact", { waitUntil: "networkidle" });
    await page.locator("#fullName").focus();
    await page.keyboard.type("Ada");
    await page.keyboard.press("Tab");
    await expect(page.locator("#email")).toBeFocused();
  });
});
