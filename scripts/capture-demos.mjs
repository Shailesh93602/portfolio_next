import { chromium } from "playwright";
import fs from "fs";
import path from "path";

const eduscaleDir = path.join(process.cwd(), "public", "Videos", "eduscale");
const khatagoDir = path.join(process.cwd(), "public", "Videos", "khatago");

fs.mkdirSync(eduscaleDir, { recursive: true });
fs.mkdirSync(khatagoDir, { recursive: true });

async function captureSite(url, outDir, name, theme) {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    viewport: { width: 1440, height: 900 },
    colorScheme: theme,
    recordVideo: { dir: outDir, size: { width: 1440, height: 900 } },
  });

  const page = await context.newPage();
  console.log(`Navigating to ${url}...`);
  try {
    await page.goto(url, { waitUntil: "networkidle", timeout: 30000 });

    // Smooth scroll down to record video
    for (let i = 0; i < 5; i++) {
      await page.mouse.wheel(0, 600);
      await page.waitForTimeout(2000);
    }
  } catch (e) {
    console.error(`Error on ${url}:`, e);
  }

  await context.close();
  await browser.close();

  // Rename the webm file to a standard name
  const files = fs.readdirSync(outDir);
  const webmFile = files.find((f) => f.endsWith(".webm") && f.length > 20);
  if (webmFile) {
    fs.renameSync(
      path.join(outDir, webmFile),
      path.join(outDir, `${name}_demo.webm`)
    );
  }
}

async function run() {
  console.log("Starting Playwright capture...");
  await Promise.all([
    captureSite(
      "https://eduscale.vercel.app/",
      eduscaleDir,
      "eduscale",
      "dark"
    ),
    captureSite("https://khatago.vercel.app/", khatagoDir, "khatago", "light"),
  ]);
  console.log("Demos captured successfully!");
}

run();
