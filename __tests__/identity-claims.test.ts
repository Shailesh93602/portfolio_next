/**
 * The facts a recruiter checks by clicking, stated once and stated the same
 * way everywhere.
 *
 * Second recruiter-lens pass of the LIVE site (2026-09-05) found:
 *
 *   - "Institute Rank 1 on GeeksforGeeks while in final year — 604+ problems"
 *     on /about. The GfG profile showed 650 solved and lists the institute as
 *     eSparkBiz Technologies, so the college framing was contradicted on
 *     click. The same figure was 604+ on five surfaces, 600+ on one and 700+
 *     in an archived post title.
 *
 * Third pass (2026-09-06) dropped the rank framing altogether. A rank is only
 * as meaningful as the population it ranks within: "Institute Rank 1" reads as
 * a college cohort, and resolves on click to a former employer with an unknown
 * and probably tiny number of GfG users. A claim that deflates when verified is
 * worse than a smaller one that holds, so the site states the volume only —
 * "<n>+ problems solved on GeeksforGeeks" — and "Institute Rank" is banned
 * outright below so it cannot come back.
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
import { SOCIAL_LINKS } from "@/lib/constants";
import { achievements, education, experiences } from "@/constants";
import { homeFaq, portfolioFaq } from "@/lib/faq-data";
import { metadata as aboutMetadata } from "@/app/about/metadata";
import { metadata as blogsMetadata } from "@/app/blogs/metadata";
import { metadata as statisticsMetadata } from "@/app/statistics/metadata";
import resume from "../resume/resume.json";

const ROOT = process.cwd();
const SCAN_DIRS = ["app", "components", "lib", "constants", "resume"];
// public/ is WALKED, not listed. It used to name llms.txt and llms-full.txt,
// and on 2026-09-20 public/index.html was found deployed and indexable with
// eSparkBiz as the current employer — a file in this very directory that no
// enumeration mentioned. humans.txt, also unlisted, carries the LinkedIn slug
// this suite exists to keep consistent, and credited two services the site
// does not use. Naming files is how a surface goes unchecked; walk the
// directory and a new file is covered the day it lands.
const SCAN_DIRS_PUBLIC = ["public"];
const EXTENSIONS = new Set([".ts", ".tsx", ".txt", ".json", ".html", ".xml"]);

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
  ...SCAN_DIRS_PUBLIC.flatMap((d) => walk(join(ROOT, d))),
];

const llms = (f: string) => readFileSync(join(ROOT, "public", f), "utf8");

describe("the GeeksforGeeks figure", () => {
  const n = PROFILE.achievements.problemsSolved;

  it("is a floor the profile clears, with room for the count to move", () => {
    // 🔴 Asserted as a RANGE, not as a literal.
    //
    // The old version pinned the exact number: `expect(n).toBe(650)`. When the
    // GfG profile went 650 -> 649 on its own (a recount, or a retired problem)
    // that assertion did not describe the defect at all — it would have failed
    // just as loudly if the claim had been corrected. The property that
    // actually matters is that the stated figure is a floor the live profile
    // clears, and that the floor is not so far below it as to be useless.
    //
    // The live number is verified daily by scripts/check-project-claims.mjs
    // with `compare: "atLeast"`; this holds the shape of the claim.
    expect(n).toBeGreaterThanOrEqual(600);
    expect(n).toBeLessThanOrEqual(649);
    expect(n % 10).toBe(0); // a round floor, never a spuriously exact count
    expect(PROFILE_META.gfgLine).toBe(`${n}+ problems solved on GeeksforGeeks`);
  });

  it("states the volume only — no rank, on any surface", () => {
    // Verified against the live profile 2026-09-20: total_problems_solved 649,
    // institute_rank 1, institute_name "eSparkBiz Technologies". The rank is
    // true and still not worth claiming; see the header note.
    expect(PROFILE.achievements).not.toHaveProperty("geeksforgeeksRank");
    const offenders: string[] = [];
    for (const file of files) {
      const text = stripComments(readFileSync(file, "utf8"));
      const m = text.match(/institute rank/i);
      if (m) offenders.push(`${relative(ROOT, file)}: "${m[0]}"`);
    }
    expect(offenders).toEqual([]);
  });

  it("is rendered from PROFILE on every surface that states it", () => {
    expect(JSON.stringify(achievements[0])).toContain(PROFILE_META.gfgLine);
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

  it("makes no college or final-year claim", () => {
    // The GfG profile's institute is eSparkBiz Technologies. Tying the count
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
    expect(surfaces).not.toMatch(/GeeksforGeeks[^.]*college/i);
    expect(surfaces).not.toMatch(/college[^.]*GeeksforGeeks/i);
  });
});

describe("the ContextQA platform is polyglot and he owns the Node side", () => {
  // 2026-09-06: "Also contribute to the platform's Java (Spring Boot) and
  // Python services with AI-assisted development" is gone from every surface.
  // He can modify and ship that code with AI help but has said he cannot
  // answer interview questions on it, and the ATS gain is marginal for a
  // TypeScript/Node target — not worth a line that invites the question. He
  // can raise it verbally when it helps. What replaces it is the honest
  // framing, not silence: a polyglot platform whose Node/TypeScript side is
  // his.
  const contextqa = experiences.find((e) => e.company === "ContextQA")!;

  it("no surface claims the Java or Spring Boot contribution", () => {
    const offenders: string[] = [];
    for (const file of files) {
      const text = stripComments(readFileSync(file, "utf8"));
      const m = text.match(/Spring Boot|AI-assisted development/i);
      if (m) offenders.push(`${relative(ROOT, file)}: "${m[0]}"`);
    }
    expect(offenders).toEqual([]);
  });

  it("says polyglot rather than reading as a single-language platform", () => {
    expect(contextqa.description).toMatch(/polyglot/i);
    expect(contextqa.description).toMatch(/Node\.js\/TypeScript/);
    const resumeContextqa = resume.experience.find(
      (e) => e.company === "ContextQA"
    )!;
    expect(resumeContextqa.bullets[0]).toMatch(/polyglot/i);
    for (const f of ["llms.txt", "llms-full.txt"]) {
      expect(llms(f)).toMatch(/polyglot/i);
    }
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

describe("one LinkedIn profile, spelled one way", () => {
  /**
   * The site linked `shaileshbhaichaudhari` and the RESUME linked
   * `shaileshbhai-chaudhari`. Only the first is real, so the PDF a recruiter
   * downloads carried a dead link to his own profile — the worst place for it,
   * because a resume link is clicked by exactly the person you cannot afford to
   * lose. He confirmed the correct one on 2026-09-13.
   *
   * The hyphenated form is banned outright rather than merely corrected. Two
   * spellings of one URL is the same failure as two values for one number: it
   * is not a typo that gets fixed once, it is a fact with two sources.
   */
  const WRONG = "shaileshbhai-chaudhari";
  const RIGHT = "shaileshbhaichaudhari";

  it("the dead hyphenated slug appears in no scanned source", () => {
    const offenders = files.filter((f) =>
      readFileSync(f, "utf8").includes(WRONG)
    );
    expect(offenders.map((f) => relative(ROOT, f))).toEqual([]);
  });

  it("the compiled resume artifacts carry the real slug, not the source's word for it", () => {
    // resume.json is the source; these are built from it by resume/build.mjs.
    // Asserting only the source would pass while the served PDF stayed wrong —
    // the same gap that let a stale BALLAST test count reach the live PDF.
    //
    // resume.html is deliberately NOT in this list: it is gitignored (an
    // intermediate render input, per resume/README.md), so it does not exist on
    // a fresh checkout and asserting it would fail in CI for the wrong reason.
    // resume.txt is the committed compiled artifact, and it cannot be right
    // unless build.mjs was re-run.
    //
    // `public/index.html` used to be in this list, and its presence here is
    // the clearest evidence of the problem it caused: the file was the 2024
    // static site this app replaced, still committed and still answering 200
    // at /index.html, and the only reason anybody touched it was to correct a
    // LinkedIn slug inside it. Its Person JSON-LD still named a former
    // employer as the current one, and its meta description still offered
    // freelance services. Deleted on 2026-09-20; see
    // __tests__/public-static-surface.test.ts for the rule that replaced it.
    // 2026-09-20: this loop used to read exactly one file. Widening the file
    // list above did nothing for it, which is the whole lesson twice over — an
    // enumeration inside a guard is as blind as an enumeration outside one.
    // The wrong slug must appear in NO scanned file; the right one must still
    // appear in the artifact portals actually parse.
    const offenders = files.filter((f) =>
      readFileSync(f, "utf8").includes(WRONG)
    );
    expect(offenders.map((f) => f.slice(ROOT.length + 1))).toEqual([]);

    const resumeTxt = readFileSync(join(ROOT, "resume/resume.txt"), "utf8");
    expect({
      file: "resume/resume.txt",
      right: resumeTxt.includes(RIGHT),
    }).toEqual({ file: "resume/resume.txt", right: true });
  });

  it("the constant and the resume source agree", () => {
    expect(SOCIAL_LINKS.LINKEDIN).toContain(RIGHT);
    expect(resume.contact.linkedin).toContain(RIGHT);
    expect(SOCIAL_LINKS.LINKEDIN).not.toContain(WRONG);
  });
});

/**
 * 🔴 A CONSTANT NOTHING IMPORTS IS NOT A SOURCE OF TRUTH.
 *
 * `PROFILE.role.yearsExperience` existed from the day this file was written and
 * had ZERO call sites. Every surface typed the figure out by hand, and by
 * 2026-09-20 they had forked into three phrasings — "~2.5 years" on the home
 * page and in llms.txt, "About 2.5 years" in the FAQ, "2.5+ years" on the
 * résumé. Nobody had noticed, because nothing compared them.
 *
 * The phrasings are allowed to differ: an approximation and a floor say
 * different, both-true things and belong on different surfaces. The NUMBER may
 * not. So the patterns below are BUILT FROM `PROFILE.role.yearsExperience` —
 * never written as `2.5` — for the reason `claims-consistency.test.ts` records
 * at length: a guard that repeats the value it guards is not a guard, and this
 * repo has already shipped one that stayed green for four days.
 */
describe("years of experience", () => {
  const years = PROFILE.role.yearsExperience;

  it("is rendered from PROFILE, in each surface's own phrasing", () => {
    expect(PROFILE_META.yearsApprox).toBe(`~${years} years`);
    expect(PROFILE_META.yearsFloor).toBe(`${years}+ years`);
    expect(PROFILE_META.yearsSentence).toBe(
      `About ${years} years of professional experience`
    );
    expect(PROFILE.bio.oneLine).toContain(PROFILE_META.yearsApprox);
    expect(
      portfolioFaq(10)
        .map((f) => f.answer)
        .join(" ")
    ).toContain(PROFILE_META.yearsSentence);
    expect(String(blogsMetadata.description)).toContain(
      PROFILE_META.yearsFloor
    );
  });

  it("the home page derives it rather than carrying its own literal", () => {
    // A server-rendered string check would pass on a hardcoded copy; reading
    // the source proves the page cannot fork on its own.
    const src = readFileSync(join(ROOT, "app", "HomeContent.tsx"), "utf8");
    expect(src).toContain("PROFILE_META.yearsApprox");
    expect(stripComments(src)).not.toMatch(/[~+]?\d(?:\.\d)? years/);
  });

  it("the static files AI agents and recruiters read state the same number", () => {
    // These cannot import PROFILE (plain text / JSON consumed by a build), so
    // this is the join between them and the constant.
    expect(llms("llms.txt")).toContain(PROFILE_META.yearsApprox);
    expect(resume.summary).toContain(PROFILE_META.yearsFloor);
  });

  it("the compiled resume.txt was rebuilt, and states it too", () => {
    // resume.txt is the cheap proof that `node resume/build.mjs` ran: the PDF
    // a recruiter opens and the DOCX a portal parses come out of the same run.
    const txt = readFileSync(join(ROOT, "resume", "resume.txt"), "utf8");
    expect(txt).toContain(PROFILE_META.yearsFloor);
  });

  it("no surface states a different figure", () => {
    // `(?<![\d.])` so "2.5+ years" is read as one number rather than as a
    // stray "5" — the first draft of this guard reported the correct résumé
    // line as an offender, which is how a guard gets loosened and stops
    // catching anything.
    const yearsPattern = new RegExp(
      `(?<![\\d.])(?!${years}\\b)\\d(?:\\.\\d)?\\+?\\s*years?\\s+(?:of\\s+)?` +
        `(?:professional\\s+)?(?:experience|in the industry|shipping|building)`,
      "gi"
    );
    const offenders: string[] = [];
    for (const file of files) {
      const text = stripComments(readFileSync(file, "utf8"));
      for (const m of Array.from(text.matchAll(yearsPattern))) {
        offenders.push(`${relative(ROOT, file)}: "${m[0].trim()}"`);
      }
    }
    expect(offenders).toEqual([]);
  });
});

/**
 * The college is spelled one way.
 *
 * It was a literal in `lib/profile.ts`, in `constants/index.ts` (the education
 * card a visitor reads) and twice in `app/layout.tsx`'s Person JSON-LD — and
 * `constants/index.ts` had lost the comma, so the rendered page and the
 * structured data named the institution differently. Structured data that
 * disagrees with the page it describes is the same defect class as KhataGO's
 * hand-written FAQPage markup.
 */
describe("the education institution", () => {
  const institution = PROFILE.education.institution;

  it("the education card and the Person JSON-LD both come from PROFILE", () => {
    expect(education[0].institution).toBe(institution);
    const layout = readFileSync(join(ROOT, "app", "layout.tsx"), "utf8");
    expect(layout).toContain("PROFILE.education.institution");
    expect(stripComments(layout)).not.toContain(institution);
  });

  it("every surface spells it identically", () => {
    // Any "Government Engineering College …" that is not the canonical string.
    const offenders: string[] = [];
    for (const file of files) {
      const text = stripComments(readFileSync(file, "utf8"));
      for (const m of Array.from(
        text.matchAll(/Government Engineering College[,\s]+Bhavnagar/g)
      )) {
        if (m[0] !== institution)
          offenders.push(`${relative(ROOT, file)}: "${m[0]}"`);
      }
    }
    expect(offenders).toEqual([]);
  });
});
