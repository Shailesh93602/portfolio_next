import { test, expect } from "@playwright/test";

test.describe("SEO — structured data and meta tags", () => {
  test("home page has FAQ JSON-LD schema", async ({ page }) => {
    await page.goto("/");
    const schemas = await page.evaluate(() =>
      Array.from(
        document.querySelectorAll('script[type="application/ld+json"]')
      ).map((s) => JSON.parse(s.textContent ?? "{}"))
    );
    const faq = schemas.find((s) => s["@type"] === "FAQPage");
    expect(faq).toBeDefined();
    expect(faq.mainEntity.length).toBeGreaterThan(0);
  });

  test("layout has Person schema with required fields", async ({ page }) => {
    await page.goto("/");
    const schemas = await page.evaluate(() =>
      Array.from(
        document.querySelectorAll('script[type="application/ld+json"]')
      ).map((s) => JSON.parse(s.textContent ?? "{}"))
    );
    const person = schemas.find((s) => s["@type"] === "Person");
    expect(person).toBeDefined();
    expect(person.name).toBe("Shailesh Chaudhari");
    expect(person.worksFor).toBeDefined();
    expect(person.award).toBeDefined();
    expect(Array.isArray(person.sameAs)).toBe(true);
    expect(person.sameAs.length).toBeGreaterThan(3);
  });

  test("layout has WebSite schema with SearchAction", async ({ page }) => {
    await page.goto("/");
    const schemas = await page.evaluate(() =>
      Array.from(
        document.querySelectorAll('script[type="application/ld+json"]')
      ).map((s) => JSON.parse(s.textContent ?? "{}"))
    );
    const website = schemas.find((s) => s["@type"] === "WebSite");
    expect(website).toBeDefined();
    expect(website.potentialAction).toBeDefined();
    expect(website.potentialAction["@type"]).toBe("SearchAction");
  });

  test("portfolio page has CollectionPage + SoftwareApplication schemas", async ({
    page,
  }) => {
    await page.goto("/portfolio");
    const schemas = await page.evaluate(() =>
      Array.from(
        document.querySelectorAll('script[type="application/ld+json"]')
      ).map((s) => JSON.parse(s.textContent ?? "{}"))
    );
    const collection = schemas.find((s) => s["@type"] === "CollectionPage");
    expect(collection).toBeDefined();
    expect(collection.hasPart.length).toBeGreaterThan(0);
    const app = collection.hasPart[0];
    expect(app["@type"]).toBe("SoftwareApplication");
  });

  test("about page has ProfilePage schema", async ({ page }) => {
    await page.goto("/about");
    const schemas = await page.evaluate(() =>
      Array.from(
        document.querySelectorAll('script[type="application/ld+json"]')
      ).map((s) => JSON.parse(s.textContent ?? "{}"))
    );
    const profile = schemas.find((s) => s["@type"] === "ProfilePage");
    expect(profile).toBeDefined();
  });

  test("all pages have canonical URL meta tag", async ({ page }) => {
    for (const path of ["/", "/about", "/portfolio", "/blogs", "/contact"]) {
      await page.goto(path);
      const canonical = await page
        .locator('link[rel="canonical"]')
        .getAttribute("href");
      expect(canonical).toBeTruthy();
      expect(canonical).toContain("shaileshchaudhari.vercel.app");
    }
  });

  test("llms.txt is accessible", async ({ page }) => {
    const response = await page.request.get("/llms.txt");
    expect(response.status()).toBe(200);
    const body = await response.text();
    expect(body).toContain("Shailesh Chaudhari");
    expect(body).toContain("EduScale");
  });

  test("llms-full.txt is accessible and comprehensive", async ({ page }) => {
    const response = await page.request.get("/llms-full.txt");
    expect(response.status()).toBe(200);
    const body = await response.text();
    expect(body).toContain("ContextQA");
    expect(body).toContain("KhataGO");
    expect(body).toContain("TypeScript");
  });
});
