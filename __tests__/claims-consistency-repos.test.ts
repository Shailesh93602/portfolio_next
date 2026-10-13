/**
 * Claims about the smaller public repositories (CodeSenseiSearch, grounded)
 * match lib/claims.ts and the daily claim check — split out of
 * claims-consistency.test.ts, whose header explains the loop.
 */
import { readFileSync } from "node:fs";
import { join } from "node:path";

import { CODESENSEI_NEST_MAJOR, CODESENSEI_NEXT_MAJOR } from "@/lib/claims";
import { projects } from "@/constants/projects";
import { byId, claimCheckSource } from "./helpers/claims";

/**
 * 🔴 THIS BLOCK USED TO ENFORCE THE STALE DESCRIPTION.
 *
 * It asserted `expect(p.description).toMatch(/not yet wired/)` — a guard whose
 * pass condition was that the card kept saying the pipeline was not wired. The
 * repository had moved on: `apps/web` was on Next 16 while the card said
 * "Next.js 14", `mock-data.ts` had been deleted in favour of a typed API
 * client, and the chunking and embedding workers were implemented and unit
 * tested. Correcting the copy would have turned this test RED. That is the
 * defect: the one test naming this project by name was holding the
 * description still instead of holding it to the repo.
 *
 * It also banned the word "BullMQ" outright, as a proxy for "does not claim a
 * deployed queue". BullMQ is genuinely used upstream (`services/queue.service.ts`),
 * so the ban forbade a true statement while the thing actually worth policing —
 * claiming a HOSTED instance that does not exist — went unchecked.
 *
 * The split now matches the rest of this file: the version numbers live in
 * lib/claims.ts and are verified against `apps/web/package.json` and
 * `apps/api/package.json` daily by scripts/check-project-claims.mjs; this test
 * checks the card renders those constants and makes no deployment claim.
 */
describe("CodeSenseiSearch", () => {
  const p = byId("codesensei-search");
  const text = JSON.stringify(p);

  it("renders the framework versions from lib/claims.ts, with no stale literal", () => {
    expect(text).toContain(`Next.js ${CODESENSEI_NEXT_MAJOR}`);
    expect(text).toContain(`NestJS ${CODESENSEI_NEST_MAJOR}`);
    // Patterns BUILT FROM the constants — never a literal "14". Updating the
    // constant has to be the whole edit, or this is the same kind of guard it
    // replaced.
    expect(text).not.toMatch(
      new RegExp(`Next\\.js (?!${CODESENSEI_NEXT_MAJOR}\\b)\\d+`)
    );
    expect(text).not.toMatch(
      new RegExp(`NestJS (?!${CODESENSEI_NEST_MAJOR}\\b)\\d+`)
    );
  });

  it("the files AI agents read state the same versions", () => {
    // The surface that keeps getting missed. llms.txt described "NestJS
    // backend scaffolding" and a pipeline "not yet wired end to end" long
    // after both stopped being true, because every guard read projects.ts.
    for (const file of ["llms.txt", "llms-full.txt"]) {
      const txt = readFileSync(join(process.cwd(), "public", file), "utf8");
      const section = txt.slice(txt.indexOf("CodeSenseiSearch"));
      const codesensei = section.slice(0, section.indexOf("### BALLAST"));
      expect(codesensei).toContain(`Next.js ${CODESENSEI_NEXT_MAJOR}`);
      expect(codesensei).toContain(`NestJS ${CODESENSEI_NEST_MAJOR}`);
      expect(codesensei).not.toMatch(
        new RegExp(`Next\\.js (?!${CODESENSEI_NEXT_MAJOR}\\b)\\d+`)
      );
      expect(codesensei).not.toMatch(/scaffolding|not yet wired|mock dataset/i);
    }
  });

  it("claims no hosted instance, because there is none", () => {
    expect(p.live).toBeUndefined();
    // The property that matters is "nothing is deployed", not a word ban — so
    // this forbids the AFFIRMATIVE claim rather than the vocabulary. "there is
    // no hosted instance" has to stay sayable; "live demo" must not.
    expect(text).not.toMatch(/\blive demo\b|deployed on|\bin production\b/i);
    expect(text).toMatch(/no hosted (?:instance|deployment)/i);
  });

  it("still says what is NOT done", () => {
    // The old sentence was stale, but the honesty it encoded is not optional:
    // this project has no deployment and no real-Postgres integration test,
    // and the page says both.
    expect(p.detailedDescription).toMatch(/is NOT done/);
    expect(p.detailedDescription).toMatch(/real Postgres/i);
  });
});

/**
 * 🔴 EVERY FALSE CLAIM THE LAST AUDIT FOUND WAS IN A PROJECT THE DAILY CHECK
 * DID NOT COVER.
 *
 * `scripts/check-project-claims.mjs` watched BALLAST, KhataGO and the home
 * page. DevTrack, grounded, idempotency-kit, promptproof and CodeSenseiSearch
 * stated a dozen numbers between them and nothing read any of them — so
 * idempotency-kit advertised 13 tests for a suite that runs 22, and
 * CodeSenseiSearch described a Next.js major and a mock dataset that were both
 * two generations out of date.
 *
 * This is the anti-regression for the GAP rather than for any one number: a
 * card may not advertise a test count for a public repository that the daily
 * check does not read. Derived from `projects.ts`, so adding the next project
 * with a "Tests: Vitest (N)" line fails here until its entry exists.
 */
describe("the daily claim check covers every project that states a test count", () => {
  const script = claimCheckSource();

  const withTestCounts = projects.filter(
    (p) =>
      p.github?.includes("github.com/") &&
      (p.techStack ?? []).some((line) => /Tests:.*\b\d+\b/.test(line))
  );

  it("finds cards that state one at all", () => {
    // Otherwise the loop below passes vacuously the day techStack is reshaped.
    expect(withTestCounts.length).toBeGreaterThanOrEqual(4);
  });

  it.each(withTestCounts.map((p) => [p.id, p.github!] as const))(
    "%s is named in the claim check",
    (_id, github) => {
      const repo = github
        .replace(/^https?:\/\/github\.com\//, "")
        .replace(/\/$/, "");
      expect(script).toContain(repo);
    }
  );
});

/**
 * grounded states three numbers in one sentence: a total, an offline subset and
 * the gated remainder. The daily check verifies the total and the gated count
 * against the repository; nothing could verify the middle one, because "how
 * many tests run when a database is absent" is not a number any upstream file
 * states.
 *
 * What CAN be checked is that the sentence adds up. A card claiming "50 tests;
 * 44 run offline, the 9 pgvector tests skip" would pass both upstream checks
 * and still be wrong on its face.
 */
describe("grounded's test-count sentence is internally consistent", () => {
  it("offline + gated = total", () => {
    const line = (byId("grounded").techStack ?? []).find((l) =>
      l.startsWith("Tests:")
    );
    expect(line).toBeDefined();
    const total = Number(/Vitest — (\d+) tests/.exec(line!)?.[1]);
    const offline = Number(/(\d+) run offline/.exec(line!)?.[1]);
    const gated = Number(/the (\d+) pgvector tests skip/.exec(line!)?.[1]);
    expect([total, offline, gated].some(Number.isNaN)).toBe(false);
    expect(offline + gated).toBe(total);
  });
});
