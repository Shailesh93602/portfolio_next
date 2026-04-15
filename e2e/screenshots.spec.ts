import { test } from "@playwright/test";
import node_path from "node:path";
import node_fs from "node:fs";

const screenshotDir = node_path.join(
  process.cwd(),
  "public",
  "Images",
  "screenshots"
);

test.beforeAll(() => {
  node_fs.mkdirSync(screenshotDir, { recursive: true });
});

/** Override CSS transitions/animations to instant so screenshots capture final state */
async function disableAnimations(page: import("@playwright/test").Page) {
  await page.addStyleTag({
    content: `
      *, *::before, *::after {
        animation-duration: 0.001ms !important;
        animation-delay: 0.001ms !important;
        transition-duration: 0.001ms !important;
        transition-delay: 0.001ms !important;
      }
    `,
  });
  await page.evaluate(() => {
    document.querySelectorAll<HTMLElement>("[style]").forEach((el) => {
      if (el.style.opacity === "0") el.style.opacity = "1";
      if (el.style.transform?.includes("translateY")) el.style.transform = "none";
    });
  });
}

/** Set the site theme by writing to localStorage and reloading */
async function setTheme(
  page: import("@playwright/test").Page,
  theme: "light" | "dark"
) {
  await page.evaluate((t) => localStorage.setItem("theme", t), theme);
  await page.reload({ waitUntil: "networkidle" });
}

const pages = [
  { name: "home", path: "/" },
  { name: "about", path: "/about" },
  { name: "portfolio", path: "/portfolio" },
  { name: "blogs", path: "/blogs" },
  { name: "contact", path: "/contact" },
  { name: "statistics", path: "/statistics" },
  { name: "hire", path: "/hire" },
];

const viewports = [
  { label: "desktop", width: 1440, height: 900 },
  { label: "tablet", width: 768, height: 1024 },
  { label: "mobile", width: 390, height: 844 },
];

const themes: Array<"light" | "dark"> = ["light", "dark"];

for (const { name, path: pagePath } of pages) {
  for (const { label, width, height } of viewports) {
    for (const theme of themes) {
      test(`screenshot: ${name} (${label}, ${theme})`, async ({ page }) => {
        await page.setViewportSize({ width, height });
        await page.goto(pagePath, { waitUntil: "networkidle" });
        await setTheme(page, theme);
        await disableAnimations(page);
        await page.waitForTimeout(300);
        await page.screenshot({
          path: node_path.join(screenshotDir, `${name}-${label}-${theme}.png`),
          fullPage: true,
        });
      });
    }
  }
}
