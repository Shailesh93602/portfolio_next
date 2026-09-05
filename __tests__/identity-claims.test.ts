/**
 * The facts a recruiter checks by clicking, stated once and stated the same
 * way everywhere.
 *
 * Second recruiter-lens pass of the LIVE site (2026-09-05) found:
 *
 *   - "Institute Rank 1 on GeeksforGeeks while in final year — 604+ problems"
 *     on /about. The GfG profile shows 650 solved and lists the institute as
 *     eSparkBiz Technologies, so the college framing was contradicted on
 *     click. The same figure was 604+ on five surfaces, 600+ on one and 700+
 *     in an archived post title.
 *   - "5 star rating in multiple programming skills including Problem Solving
 *     and Python". The public badges show C++ at five stars, Python at three,
 *     and no Problem Solving badge.
 *   - "~2 years at EsparkBiz" (home FAQ, bio, about metadata) for a Jan 2024 –
 *     Jul 2025 span, in two spellings of the company's name.
 *   - "zero production incidents" on the resume, beside "Resolved critical
 *     production bugs" on /about.
 *
 * lib/profile.ts is the single source; this test holds every other surface
 * to it, including the two hand-maintained files AI agents read and the
 * resume source, and bans the stale literals outright.
 */
import { readdirSync, readFileSync, statSync } from "node:fs";
import { join, relative } from "node:path";

import { PROFILE, PROFILE_META } from "@/lib/profile";
import { achievements, education, experiences } from "@/constants";
import { homeFaq, portfolioFaq } from "@/lib/faq-data";
import { metadata as aboutMetadata } from "@/app/about/metadata";
import { metadata as statisticsMetadata } from "@/app/statistics/metadata";
import resume from "../resume/resume.json";

const ROOT = process.cwd();
const SCAN_DIRS = ["app", "components", "lib", "constants", "resume"];
const SCAN_FILES = ["public/llms.txt", "public/llms-full.txt"];
const EXTENSIONS = new Set([".ts", ".tsx", ".txt", ".json"]);

function walk(dir: string): string[] {
  const out: string[] = [];
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry);
    if (statSync(full).isDirectory()) out.push(...walk(full));
    else if (EXTENSIONS.has(full.slice(full.lastIndexOf(".")))) out.push(full);
  }
  return out;
}

function stripComments(src: string): string {
  return src
    .replace(/\/\*[\s\S]*?\*\//g, " ")
    .replace(/\{\/\*[\s\S]*?\*\/\}/g, " ")
    .replace(/(^|[^:"'`])\/\/.*$/gm, "$1");
}

const files = [
  ...SCAN_DIRS.flatMap((d) => walk(join(ROOT, d))),
  ...SCAN_FILES.map((f) => join(ROOT, f)),
];

const llms = (f: string) => readFileSync(join(ROOT, "public", f), "utf8");

describe("the GeeksforGeeks figure", () => {
  const n = PROFILE.achievements.problemsSolved;

  it("is the one the profile shows, stated as a floor", () => {
    expect(n).toBe(650);
    expect(PROFILE_META.gfgLine).toBe(
      "Institute Rank 1 on GeeksforGeeks (650+ problems solved)"
    );
  });

  it("is rendered from PROFILE on every surface that states it", () => {
    expect(achievements[0].description).toContain(PROFILE_META.gfgLine);
    expect(homeFaq.map((f) => f.answer).join(" ")).toContain(
      PROFILE_META.gfgLine
    );
    expect(
      portfolioFaq(10)
        .map((f) => f.answer)
        .join(" ")
    ).toContain(PROFILE_META.gfgLine);
    expect(String(statisticsMetadata.description)).toContain(
      PROFILE_META.gfgLine
    );
    expect(resume.achievements).toContain(PROFILE_META.gfgLine);
    for (const f of ["llms.txt", "llms-full.txt"]) {
      expect(llms(f)).toContain(PROFILE_META.gfgLine);
    }
  });

  it("no surface states a different problem count", () => {
    // "<digits>+ problems" anywhere that is not the PROFILE figure.
    const offenders: string[] = [];
    for (const file of files) {
      const text = stripComments(readFileSync(file, "utf8"));
      for (const m of Array.from(text.matchAll(/\b(\d{3,4})\+\s*problems/gi))) {
        if (Number(m[1]) !== n)
          offenders.push(`${relative(ROOT, file)}: "${m[0]}"`);
      }
    }
    expect(offenders).toEqual([]);
  });

  it("the stale literals are gone: 604+, 600+, 700+", () => {
    const offenders: string[] = [];
    for (const file of files) {
      const text = stripComments(readFileSync(file, "utf8"));
      const m = text.match(/\b(604|600|700)\+/);
      if (m) offenders.push(`${relative(ROOT, file)}: "${m[0]}"`);
    }
    expect(offenders).toEqual([]);
  });

  it("makes no college or final-year claim about the rank", () => {
    // The GfG profile's institute is eSparkBiz Technologies. Tying the rank
    // to college is contradicted the moment someone clicks through.
    const surfaces = [
      JSON.stringify(education),
      JSON.stringify(achievements),
      homeFaq.map((f) => f.answer).join(" "),
      llms("llms.txt"),
      llms("llms-full.txt"),
      JSON.stringify(resume),
    ].join("\n");
    expect(surfaces).not.toMatch(/final[- ]year/i);
    expect(surfaces).not.toMatch(/Institute Rank[^.]*college/i);
    expect(surfaces).not.toMatch(/college[^.]*Institute Rank/i);
  });
});

describe("HackerRank and CodeChef", () => {
  it("claims the one five-star badge, C++, and nothing broader", () => {
    expect(PROFILE.achievements.hackerrank).toBe("5-star C++ on HackerRank");
    const hr = achievements.find((a) => /HackerRank/.test(a.title))!;
    expect(hr).toBeDefined();
    expect(hr.title).toBe("5-star C++ on HackerRank");
    const everywhere = [
      JSON.stringify(achievements),
      homeFaq.map((f) => f.answer).join(" "),
      llms("llms.txt"),
      llms("llms-full.txt"),
      JSON.stringify(resume),
    ].join("\n");
    expect(everywhere).not.toMatch(/5[- ]?star[^.]*Problem Solving/i);
    expect(everywhere).not.toMatch(/5[- ]?star[^.]*Python/i);
    expect(everywhere).not.toMatch(/multiple programming skills/i);
  });

  it("has no CodeChef achievement card", () => {
    // 1★, rating 1219 — a card that invited a question with no good answer.
    // The profile link may stay in a neutral list; it is not an achievement.
    expect(achievements.some((a) => /CodeChef/i.test(a.title))).toBe(false);
    expect(achievements.some((a) => /CodeChef/i.test(a.description))).toBe(
      false
    );
  });
});

describe("eSparkBiz tenure", () => {
  it("is stated from PROFILE.previousRole on every bio surface", () => {
    const t = PROFILE.previousRole.tenure;
    expect(t).toBe(
      "about 1.5 years at eSparkBiz (Jan 2024 – Jul 2025, including a 7-month internship)"
    );
    expect(PROFILE.bio.medium).toContain(t);
    expect(homeFaq.map((f) => f.answer).join(" ")).toContain(t);
    expect(
      portfolioFaq(10)
        .map((f) => f.answer)
        .join(" ")
    ).toContain(t);
    expect(String(aboutMetadata.description)).toContain(t);
    const about = readFileSync(
      join(ROOT, "app", "about", "AboutContent.tsx"),
      "utf8"
    );
    expect(about).toContain("PROFILE.previousRole.tenure");
  });

  it("is never rounded up to two years", () => {
    const offenders: string[] = [];
    for (const file of files) {
      const text = stripComments(readFileSync(file, "utf8"));
      const m = text.match(/~?\s?2 years at (?:e|E)spark/i);
      if (m) offenders.push(`${relative(ROOT, file)}: "${m[0]}"`);
    }
    expect(offenders).toEqual([]);
  });

  it("spells the company eSparkBiz everywhere", () => {
    const offenders: string[] = [];
    for (const file of files) {
      const text = stripComments(readFileSync(file, "utf8"));
      for (const m of Array.from(text.matchAll(/\besparkbiz\b/gi))) {
        // COMPANY_LINKS.ESPARKBIZ is an identifier, not copy.
        if (m[0] !== "eSparkBiz" && m[0] !== "ESPARKBIZ")
          offenders.push(`${relative(ROOT, file)}: "${m[0]}"`);
      }
    }
    expect(offenders).toEqual([]);
  });

  it("agrees with the experience timeline", () => {
    const spark = experiences.filter((e) => /eSparkBiz/.test(e.company));
    expect(spark).toHaveLength(2);
    expect(spark.map((e) => e.period)).toEqual([
      "August 2024 - July 2025",
      "January 2024 - August 2024",
    ]);
    // 7 months, not the "8-month internship" the intern entry used to say.
    expect(JSON.stringify(spark)).not.toMatch(/8-month/);
  });
});

describe("no incident-free claim", () => {
  it("neither the resume nor /about promises zero production incidents", () => {
    // Unverifiable, and /about says "Resolved critical production bugs" two
    // bullets earlier. "Delivered on schedule" is the claim the work backs.
    const text = [JSON.stringify(resume), JSON.stringify(experiences)].join(
      "\n"
    );
    expect(text).not.toMatch(/(zero|no) production incidents/i);
    expect(text).toMatch(/on schedule/);
  });
});
