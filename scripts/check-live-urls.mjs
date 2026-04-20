#!/usr/bin/env node
/**
 * check-live-urls.mjs
 *
 * Fetches every live project URL and reports status + response time.
 * Exits with code 1 if any URL fails (non-2xx or network error).
 * Use as a pre-deploy check or weekly cron.
 *
 * Run: node scripts/check-live-urls.mjs
 */

const URLS = [
  { name: "Portfolio", url: "https://shaileshchaudhari.vercel.app" },
  { name: "EduScale", url: "https://eduscale.vercel.app" },
  { name: "DevTrack", url: "https://daily-dev-track.vercel.app" },
  { name: "KhataGO", url: "https://khatago.vercel.app" },
  // Render free-tier spins down after 15 min; daily GET wakes it up,
  // which in turn reconnects to Upstash Redis — that Redis activity
  // prevents Upstash from pausing the free-tier instance.
  { name: "Redis Battle Demo", url: "https://redis-battle-demo.onrender.com/" },
  {
    name: "Stripe Patterns Demo",
    url: "https://stripe-payments-demo-eight.vercel.app",
  },
  {
    name: "Razorpay Patterns Demo",
    url: "https://razorpay-patterns-demo.vercel.app",
  },
];

const TIMEOUT_MS = 10_000;

async function checkUrl(name, url) {
  const start = Date.now();
  try {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);

    const res = await fetch(url, {
      method: "HEAD",
      signal: controller.signal,
      redirect: "follow",
    });

    clearTimeout(timer);
    const ms = Date.now() - start;
    const ok = res.status >= 200 && res.status < 300;

    return { name, url, status: res.status, ms, ok };
  } catch (err) {
    const ms = Date.now() - start;
    const message = err instanceof Error ? err.message : String(err);
    return { name, url, status: 0, ms, ok: false, error: message };
  }
}

const results = await Promise.all(
  URLS.map(({ name, url }) => checkUrl(name, url))
);

const maxName = Math.max(...results.map((r) => r.name.length));

console.log("\nURL Health Check\n" + "─".repeat(60));

for (const r of results) {
  const icon = r.ok ? "✓" : "✗";
  const statusStr = r.status > 0 ? String(r.status) : "ERR";
  const nameCol = r.name.padEnd(maxName + 2);
  const line = `${icon}  ${nameCol} ${statusStr.padEnd(6)} ${r.ms}ms  ${r.url}`;
  if (r.ok) {
    console.log(line);
  } else {
    console.error(line + (r.error ? `  (${r.error})` : ""));
  }
}

console.log("─".repeat(60));

const failed = results.filter((r) => !r.ok);
if (failed.length > 0) {
  console.error(`\n${failed.length} URL(s) failed:\n`);
  for (const r of failed) {
    console.error(`  • ${r.name}: ${r.url}`);
    if (r.error) console.error(`    ${r.error}`);
  }
  process.exit(1);
} else {
  console.log(`\nAll ${results.length} URLs healthy.`);
}
