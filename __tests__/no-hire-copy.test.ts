/**
 * The site describes the work. It does not advertise availability.
 *
 * On 2026-09-03 a recruiter-lens review of the LIVE site found "Is Shailesh
 * Chaudhari available for hire?" in the home FAQ, "open to new opportunities?
 * Yes." in the portfolio FAQ, a /services page with a project-intake CTA and a
 * "reply within 48 hours" promise, and "Have a project in mind" on /contact.
 * Every one of those aims a personal portfolio at freelance work — and the
 * second one announces a job search on a public page belonging to someone who
 * is employed.
 *
 * This test scans the surfaces a visitor or a crawler reads and fails if any
 * of that copy returns. Comments are stripped first: a comment explaining why
 * a phrase was removed necessarily contains the phrase.
 *
 * It also bans the copy "tells" the same review flagged — "premium",
 * "sophisticated", "revolutionary", "engineering excellence" — which say
 * nothing and read as filler.
 */
import { readdirSync, readFileSync, statSync } from "node:fs";
import { join, relative } from "node:path";

const ROOT = process.cwd();

const SCAN_DIRS = ["app", "components", "lib", "constants"];
const SCAN_FILES = ["public/llms.txt", "public/llms-full.txt"];
const EXTENSIONS = new Set([".ts", ".tsx", ".txt"]);

const BANNED: { pattern: RegExp; why: string }[] = [
  { pattern: /available for hire/i, why: "advertises availability" },
  { pattern: /open to new opportunities/i, why: "announces a job search" },
  { pattern: /open to (?:new )?(?:roles|work|offers)/i, why: "same" },
  { pattern: /hire me\b/i, why: "freelance framing" },
  { pattern: /\bfreelanc/i, why: "freelance framing" },
  { pattern: /part-time software engineer/i, why: "old SEO keyword" },
  { pattern: /have a project in mind/i, why: "project-intake copy" },
  { pattern: /one-line description/i, why: "project-intake copy" },
  { pattern: /reply time/i, why: "SLA promise" },
  { pattern: /under 48 hours|within 48 hours/i, why: "SLA promise" },
  { pattern: /start a conversation/i, why: "intake CTA" },
  { pattern: /project inquiry/i, why: "intake CTA" },
  { pattern: /targeting .* roles/i, why: "announces a job search" },
  { pattern: /\bpremium\b/i, why: "copy tell" },
  { pattern: /\bsophisticated\b/i, why: "copy tell" },
  { pattern: /\brevolutionary\b/i, why: "copy tell" },
  { pattern: /engineering excellence/i, why: "copy tell" },
  { pattern: /also known as ContextQA/i, why: "ContextQA is the company" },
];

function stripComments(src: string): string {
  return src
    .replace(/\/\*[\s\S]*?\*\//g, " ")
    .replace(/\{\/\*[\s\S]*?\*\/\}/g, " ")
    .replace(/(^|[^:"'`])\/\/.*$/gm, "$1");
}

function walk(dir: string): string[] {
  const out: string[] = [];
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry);
    if (statSync(full).isDirectory()) {
      out.push(...walk(full));
    } else if (EXTENSIONS.has(full.slice(full.lastIndexOf(".")))) {
      out.push(full);
    }
  }
  return out;
}

const files = [
  ...SCAN_DIRS.flatMap((d) => walk(join(ROOT, d))),
  ...SCAN_FILES.map((f) => join(ROOT, f)),
];

describe("no availability / freelance copy on any public surface", () => {
  it("scans a meaningful number of files", () => {
    expect(files.length).toBeGreaterThan(40);
  });

  it("finds none of the banned phrases", () => {
    const offenders: string[] = [];
    for (const file of files) {
      const text = stripComments(readFileSync(file, "utf8"));
      for (const { pattern, why } of BANNED) {
        const m = text.match(pattern);
        if (m) offenders.push(`${relative(ROOT, file)}: "${m[0]}" (${why})`);
      }
    }
    expect(offenders).toEqual([]);
  });
});
