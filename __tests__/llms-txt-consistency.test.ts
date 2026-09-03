import { readFileSync } from "node:fs";
import { join } from "node:path";

import { projects } from "@/constants/projects";

/**
 * `llms.txt` must not advertise a project the portfolio does not show.
 *
 * WHY THIS EXISTS.
 *
 * These two files say the same things about the same projects in two different
 * formats, maintained by hand. That is a drift machine, and it has already
 * produced one incident: `projects.ts`, `llms.txt` and `llms-full.txt` all
 * carried a "Redis-backed idempotency guard" for a project with no Redis in it.
 *
 * This is the same shape of failure, one step subtler. **CareerGlyph was
 * deliberately cut from the portfolio and stayed in `llms.txt`** — where the
 * whole purpose of the file is to be read by an AI agent describing this
 * person's work. Nothing was factually false; the file was simply still
 * recommending a project that had been withdrawn, to exactly the audience it
 * was written for.
 *
 * A dead link announces itself with a 404. A stale recommendation does not.
 */

const PUBLIC = join(process.cwd(), "public");

/** Top-level project bullets, e.g. `- [KhataGO](https://…): …`. */
const BULLET = /^- \[([A-Za-z0-9][A-Za-z0-9 .-]*)\]\(/gm;

/** Site pages, not projects — they have no `projects.ts` entry by design. */
const SITE_PAGES = new Set([
  "Home",
  "About",
  "Portfolio",
  "Blog",
  "Statistics",
  "Contact",
  "Hire",
  "Resume",
  "Services",
  "What I work on",
  "Engineering",
  "FAQ",
  "Uses",
]);

/**
 * Named in `llms-full.txt` on purpose without a `projects.ts` entry: closed
 * professional work, which the portfolio presents as employment rather than as
 * a project someone can open.
 */
const PROFESSIONAL_WORK = new Set(["Vibe Testing", "AxeTos"]);

function namesIn(file: string): string[] {
  const text = readFileSync(join(PUBLIC, file), "utf8");
  const out: string[] = [];
  BULLET.lastIndex = 0;
  let m: RegExpExecArray | null;
  while ((m = BULLET.exec(text)) !== null) out.push(m[1].trim());
  return out;
}

describe("llms.txt stays consistent with the portfolio", () => {
  it("finds project bullets at all", () => {
    // Guards everything below. If the file's format changes, the real
    // assertion starts passing vacuously — and a check that silently stops
    // checking is worse than none, because it is trusted.
    expect(namesIn("llms.txt").length).toBeGreaterThan(5);
  });

  it("names no project that projects.ts does not contain", () => {
    const known = new Set(projects.map((p) => p.title));
    const orphans = namesIn("llms.txt").filter(
      (n) => !known.has(n) && !SITE_PAGES.has(n) && !PROFESSIONAL_WORK.has(n)
    );

    // The failure message is carried IN the compared value, because jest's
    // expect() takes no message argument — unlike vitest and playwright, which
    // the other suites in this workspace use. Silently losing the explanation
    // would leave a future reader with a bare array diff and no idea what to do.
    const explained = orphans.map(
      (n) =>
        `${n} — llms.txt recommends this to an AI agent, but projects.ts does not show it. ` +
        `Restore it to projects.ts, or remove it from llms.txt.`
    );
    expect(explained).toEqual([]);
  });

  it("does not mention a project that was deliberately cut", () => {
    // Named explicitly rather than left to the rule above, so the reason
    // survives even if the general check is ever loosened.
    const cut = ["CareerGlyph"];
    for (const file of ["llms.txt", "llms-full.txt"]) {
      const text = readFileSync(join(PUBLIC, file), "utf8").toLowerCase();
      for (const name of cut) {
        const mentions = text.includes(name.toLowerCase())
          ? [`${name} was cut from the portfolio but still appears in ${file}`]
          : [];
        expect(mentions).toEqual([]);
      }
    }
  });
});
