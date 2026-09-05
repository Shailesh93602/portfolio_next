import { test, expect, Page } from "@playwright/test";
import { projects } from "../constants/projects";
import { PROFILE } from "../lib/profile";

/**
 * The journey a recruiter or hiring manager actually takes, in order.
 *
 * Not "does /portfolio return 200" — the path: land on the home page and read
 * the hero, open the portfolio and a project, read /engineering (the page that
 * says how the work is verified), download the resume, and reach the contact
 * page. Every step asserts the outcome that step exists to produce, and the
 * things the front-door review of 2026-09-03 removed on purpose are asserted
 * ABSENT on the rendered page: no availability or freelance copy, no phone
 * number on a public surface. `__tests__/no-hire-copy.test.ts` scans the
 * source for the same phrases; this is the rendered-page counterpart.
 *
 * There is no "Hire me" call to action anywhere on the site any more — the
 * previous version of this spec asserted one, and that was the assertion that
 * went stale.
 */

const SHOWCASE = projects.filter((p) => p.isShowcase);
const showcaseWithBothLinks = SHOWCASE.find((p) => p.live && p.github);

/** The local part of the number kept OFF every public page. */
const PHONE_LOCAL = PROFILE.contact.phone.replace(/\D/g, "").slice(-10);

/** Copy the site must not carry — every phrase was live before 2026-09-03. */
const BANNED_COPY =
  /available for hire|open to new opportunities|hire me\b|freelanc|have a project in mind|within 48 hours|under 48 hours|reply time|targeting .* roles|next employer|as (?:my )?(?:next )?employer|\bopen to\b|looking for a role/i;

/**
 * Follow a navbar link on either viewport. The desktop links are `hidden` on
 * a phone and the drawer is `inert` until opened, so getByRole only ever sees
 * the set that is actually usable.
 */
async function goViaNav(page: Page, name: RegExp, urlGlob: string) {
  const nav = page.getByRole("navigation", { name: /main navigation/i });
  const desktopLink = nav.getByRole("link", { name }).first();
  if (!(await desktopLink.isVisible())) {
    await page.getByRole("button", { name: /open menu/i }).click();
  }
  await nav
    .getByRole("link", { name })
    .filter({ visible: true })
    .first()
    .click();
  await page.waitForURL(urlGlob);
}

async function visibleText(page: Page) {
  return (await page.locator("body").innerText()).replace(/\s+/g, " ");
}

test.describe("Recruiter journey", () => {
  test("home → portfolio → project → engineering → resume → contact", async ({
    page,
    request,
  }) => {
    test.setTimeout(90_000);

    // ── 1. Land: the hero says who he is, above the fold, with no pitch ──
    await page.goto("/", { waitUntil: "networkidle" });
    const h1 = page.locator("h1").first();
    await expect(h1).toBeVisible();
    await expect(h1).toContainText(/Shailesh/i);
    const box = await h1.boundingBox();
    expect(box, "h1 has no layout box").toBeTruthy();
    expect(box!.y, "hero is below the fold").toBeLessThan(900);

    await expect(
      page.getByRole("link", { name: /get in touch/i }).first()
    ).toHaveAttribute("href", "/contact");
    await expect(
      page.getByRole("link", { name: /download resume/i }).first()
    ).toBeVisible();
    expect(await visibleText(page), "home carries banned copy").not.toMatch(
      BANNED_COPY
    );

    // ── 2. Portfolio: cards exist and open the project they name ──
    await goViaNav(page, /^portfolio$/i, "**/portfolio");
    const card = page.locator('a[href^="/portfolio/"]').first();
    await expect(card).toBeVisible();
    const href = (await card.getAttribute("href"))!;
    const project = projects.find((p) => `/portfolio/${p.id}` === href);
    expect(
      project,
      `card links to ${href}, which is not a project`
    ).toBeTruthy();
    await card.evaluate((el) => el.scrollIntoView({ block: "center" }));
    await card.click();
    await page.waitForURL(`**${href}`);
    await expect(page.locator("h1").first()).toContainText(
      project!.title.split("—")[0].trim()
    );

    // ── 3. Engineering: the findings render and their write-ups resolve ──
    await goViaNav(page, /^engineering$/i, "**/engineering");
    await expect(page.locator("h1").first()).toHaveText(/how i verify/i);
    const findings = page.locator("article");
    expect(
      await findings.count(),
      "findings on /engineering"
    ).toBeGreaterThanOrEqual(5);
    const writeUps = await page
      .getByRole("link", { name: /read the full write-up/i })
      .evaluateAll((as) =>
        as.map((a) => (a as HTMLAnchorElement).getAttribute("href") ?? "")
      );
    expect(writeUps.length).toBe(await findings.count());
    const brokenWriteUps: string[] = [];
    for (const target of writeUps) {
      if (target.startsWith("/")) {
        const res = await request.get(target);
        if (res.status() !== 200)
          brokenWriteUps.push(`${res.status()} ${target}`);
      } else {
        // Remote write-ups are checked by the daily URL cron; here only that
        // the link is a real absolute URL rather than a placeholder.
        expect(target, "write-up link is not absolute").toMatch(/^https:\/\//);
      }
    }
    expect(brokenWriteUps, "internal write-ups that do not resolve").toEqual(
      []
    );

    // ── 4. Resume: the download is a real PDF, from the link and from /resume ──
    await goViaNav(page, /^home$/i, /\/$/);
    const resume = page.getByRole("link", { name: /download resume/i }).first();
    await expect(resume).toBeVisible();
    await expect(resume).toHaveAttribute("download", /.*/);
    const resumeHref = (await resume.getAttribute("href"))!;
    expect(resumeHref).toMatch(/\.pdf$/i);

    const pdf = await request.get(resumeHref);
    expect(pdf.status(), `${resumeHref} returned ${pdf.status()}`).toBe(200);
    expect(pdf.headers()["content-type"] ?? "").toContain("application/pdf");
    const bytes = await pdf.body();
    expect(bytes.subarray(0, 5).toString("utf8")).toBe("%PDF-");
    // A one-page resume is tens of KB; a stub or an HTML error page is not.
    expect(bytes.length, "resume PDF is implausibly small").toBeGreaterThan(
      20_000
    );

    const shortcut = await request.get("/resume", { maxRedirects: 0 });
    expect([301, 307, 308]).toContain(shortcut.status());
    expect(shortcut.headers()["location"] ?? "").toContain(resumeHref);

    // ── 5. Contact: a way to reach him, and nothing that reads as a pitch ──
    await goViaNav(page, /^contact$/i, "**/contact");
    await expect(page.locator("h1").first()).toHaveText(/contact/i);
    await expect(
      page.locator(`a[href="mailto:${PROFILE.contact.email}"]`).first()
    ).toBeVisible();
    for (const field of ["fullName", "email", "subject", "message"]) {
      await expect(page.locator(`#${field}`)).toBeVisible();
    }

    const contactText = await visibleText(page);
    expect(contactText, "contact page carries banned copy").not.toMatch(
      BANNED_COPY
    );
    expect(
      contactText.replace(/\D/g, ""),
      "phone number is visible on /contact"
    ).not.toContain(PHONE_LOCAL);
    expect(await page.locator('a[href^="tel:"]').count(), "tel: link").toBe(0);

    // The served HTML too: the ContactPage JSON-LD used to carry `telephone`,
    // which a crawler reads even though no visitor sees it.
    const served = await (await request.get("/contact")).text();
    expect(served, "phone number in /contact markup").not.toContain(
      PHONE_LOCAL
    );
    expect(
      served.replace(/\s+/g, " "),
      "banned copy in /contact markup"
    ).not.toMatch(BANNED_COPY);
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

  test("every project card links to a page that exists", async ({
    page,
    request,
  }) => {
    // The card hrefs are in the server-rendered HTML, so nothing here needs
    // the network to go quiet. On the GitHub runner this page, loaded as the
    // fourth test of the worker against `next start`, never reached
    // `networkidle` in 30s (3/3 attempts), while the same load standalone on
    // the same runner went idle in 2.9s — so wait for what the test reads.
    await page.goto("/portfolio", { waitUntil: "domcontentloaded" });
    await expect(page.locator('a[href^="/portfolio/"]').first()).toBeVisible();
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
