import { test, expect } from "@playwright/test";
import { projects } from "../constants/projects";

/**
 * The journey a recruiter or hiring manager actually takes.
 *
 * Not "does /portfolio return 200" — the full path: land on the home page,
 * read the hero, open a showcase project, read the case study, follow the
 * live-demo and repository links, and download the resume. Every one of
 * those steps is a place the first impression can die silently.
 */

const SHOWCASE = projects.filter((p) => p.isShowcase);
const showcaseWithBothLinks = SHOWCASE.find((p) => p.live && p.github);

test.describe("Recruiter journey", () => {
  test("land → hero states who he is and what he does", async ({ page }) => {
    await page.goto("/", { waitUntil: "networkidle" });

    const h1 = page.locator("h1").first();
    await expect(h1).toBeVisible();
    await expect(h1).toContainText(/Shailesh/i);

    // The hero must be above the fold on a laptop — a recruiter should not
    // have to scroll to learn what this person does.
    const box = await h1.boundingBox();
    expect(box, "h1 has no layout box").toBeTruthy();
    expect(box!.y).toBeLessThan(900);

    // Primary calls to action are present and reachable.
    await expect(
      page.getByRole("link", { name: /get in touch/i }).first()
    ).toBeVisible();
    await expect(
      page.getByRole("link", { name: /download resume/i }).first()
    ).toBeVisible();
  });

  test("home → portfolio → open a showcase project detail", async ({
    page,
  }) => {
    await page.goto("/", { waitUntil: "networkidle" });

    const navLink = page
      .getByRole("navigation")
      .getByRole("link", { name: /^portfolio$/i })
      .first();
    await navLink.click();
    await page.waitForURL("**/portfolio");

    const card = page.locator('a[href^="/portfolio/"]').first();
    await expect(card).toBeVisible();
    const href = await card.getAttribute("href");
    await card.evaluate((el) => el.scrollIntoView({ block: "center" }));
    await card.click();
    await page.waitForURL(`**${href}`);

    await expect(page.locator("h1").first()).toBeVisible();
  });

  test("case study on a showcase page carries real substance", async ({
    page,
  }) => {
    const project = showcaseWithBothLinks ?? SHOWCASE[0];
    await page.goto(`/portfolio/${project.id}`, { waitUntil: "networkidle" });
    // Sections below the fold mount on scroll (framer-motion whileInView), so
    // walk the page before reading its text.
    await page.evaluate(async () => {
      const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));
      for (let y = 0; y < document.body.scrollHeight; y += 500) {
        globalThis.scrollTo(0, y);
        await sleep(60);
      }
      globalThis.scrollTo(0, 0);
      await sleep(200);
    });

    // Title + description render from the project data, not a placeholder.
    await expect(page.locator("h1").first()).toContainText(
      project.title.split("—")[0].trim()
    );

    // innerText applies CSS text-transform, and the metric labels render
    // `uppercase` — compare case-insensitively rather than chasing the styling.
    const body = (await page.locator("body").innerText()).toLowerCase();
    const has = (needle: string) => body.includes(needle.toLowerCase());

    // A case study is only a case study if the problem/solution narrative and
    // the architecture actually made it onto the page.
    if (project.problem) {
      const snippet = project.problem.slice(0, 60).replace(/\s+/g, " ");
      expect(
        body.replace(/\s+/g, " ").includes(snippet.toLowerCase()),
        `problem statement missing on /portfolio/${project.id}`
      ).toBe(true);
    }
    for (const metric of project.keyMetrics ?? []) {
      expect(has(metric.label), `metric "${metric.label}" missing`).toBe(true);
    }
    for (const layer of project.architecture?.layers ?? []) {
      expect(
        has(layer.name),
        `architecture layer "${layer.name}" missing`
      ).toBe(true);
    }
  });

  test("live-demo and repository links open the URLs the data promises", async ({
    page,
    context,
  }) => {
    test.skip(
      !showcaseWithBothLinks,
      "no showcase project carries both a live and a github link"
    );
    const project = showcaseWithBothLinks!;
    await page.goto(`/portfolio/${project.id}`, { waitUntil: "networkidle" });

    // We assert on the popup's target URL rather than on the remote page
    // rendering: whether the third-party host is up is the job of
    // scripts/check-live-urls.mjs (a daily cron), not of this suite.
    for (const [label, expected] of [
      ["live", project.live!],
      ["github", project.github!],
    ] as const) {
      const link = page.locator(`a[href="${expected}"]`).first();
      await expect(link, `${label} link missing`).toBeVisible();
      await expect(link).toHaveAttribute("target", "_blank");
      await expect(link).toHaveAttribute("rel", /noopener/);

      const [popup] = await Promise.all([
        context.waitForEvent("page"),
        link.click(),
      ]);
      expect(popup.url(), `${label} popup URL`).toContain(
        new URL(expected).host
      );
      await popup.close();
    }
  });

  test("resume download link serves a PDF and is marked as a download", async ({
    page,
    request,
  }) => {
    await page.goto("/", { waitUntil: "networkidle" });
    const link = page.getByRole("link", { name: /download resume/i }).first();
    await expect(link).toBeVisible();

    const href = await link.getAttribute("href");
    expect(href).toBeTruthy();
    await expect(link).toHaveAttribute("download", /.*/);

    const res = await request.get(href!);
    expect(res.status(), `${href} returned ${res.status()}`).toBe(200);
    expect(res.headers()["content-type"] ?? "").toContain("application/pdf");
    const body = await res.body();
    expect(body.subarray(0, 5).toString("utf8")).toBe("%PDF-");
  });

  test("every project card links to a page that exists", async ({
    page,
    request,
  }) => {
    await page.goto("/portfolio", { waitUntil: "networkidle" });
    const hrefs = await page.$$eval('a[href^="/portfolio/"]', (as) => [
      ...new Set(
        as.map((a) => (a as HTMLAnchorElement).getAttribute("href") ?? "")
      ),
    ]);
    expect(hrefs.length, "no project cards rendered").toBeGreaterThan(0);

    const broken: string[] = [];
    for (const href of hrefs) {
      const res = await request.get(href);
      if (res.status() !== 200) broken.push(`${res.status()} ${href}`);
    }
    expect(broken, "project cards pointing at non-200 pages").toEqual([]);
  });
});
