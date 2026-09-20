/**
 * Every component under `components/` is imported by something that ships.
 *
 * WHY THIS EXISTS.
 *
 * A test suite proves the component it renders behaves correctly. It proves
 * nothing about whether that component is on the site. On 2026-09-20 three
 * were not, and all three were green:
 *
 *   - `components/header.tsx` — a second navigation bar, with a different set
 *     of links from the real one. The site's header is inlined in
 *     `app/layout.tsx` and renders `components/navbar`.
 *   - `components/footer.tsx` — seven assertions, including "renders LinkedIn
 *     link", "renders Twitter link" and "renders Email link". The deployed
 *     footer has none of those: it is inlined in `app/layout.tsx` and carries
 *     one "Built by / Hosted on" sentence. The dead file also held a second
 *     spelling of the LinkedIn URL — the exact fact PR #56 went hunting for
 *     across the repo after the resume shipped a dead profile link.
 *   - `components/skills-showcase.tsx` — a proficiency grid asserting "React
 *     90", "AWS 70", "Figma 70". Numbers nobody measured, of the kind the
 *     honesty bar exists to keep off this site, one import away from being
 *     rendered, kept permanently green by six tests.
 *
 * That last one is why this is a guard and not a tidy-up. Dead code is
 * cheap; dead code that a suite certifies is a loaded gun, because the next
 * person to need a skills section finds a tested component and wires it in.
 *
 * THE GENERAL RULE, from this workspace's CLAUDE.md: infrastructure existing
 * is not a feature shipped. After building a helper, grep for its call sites;
 * after building a component, grep for its importers. A test is not a caller.
 */
import { readdirSync, readFileSync, statSync } from "node:fs";
import { extname, join, relative } from "node:path";

const ROOT = process.cwd();

/** Directories whose files can legitimately import a component. */
const PRODUCTION_DIRS = ["app", "components", "lib", "constants"];

/**
 * Files that exist to be imported by name from elsewhere, or that Next.js
 * loads by convention rather than by import.
 */
const EXEMPT = [
  /^components\/ui\//, // shadcn primitives: a vendored kit, kept whole on purpose
  /^components\/icons\//, // icon barrel, consumed by named export
];

function walk(dir: string): string[] {
  const out: string[] = [];
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry);
    if (statSync(full).isDirectory()) out.push(...walk(full));
    else if ([".ts", ".tsx"].includes(extname(full))) out.push(full);
  }
  return out;
}

const componentFiles = walk(join(ROOT, "components")).map((f) =>
  relative(ROOT, f)
);
const productionFiles = PRODUCTION_DIRS.flatMap((d) =>
  walk(join(ROOT, d)).map((f) => relative(ROOT, f))
);
const sources = new Map(
  productionFiles.map((f) => [f, readFileSync(join(ROOT, f), "utf8")])
);

/** Module specifiers that would resolve to this file. */
function specifiersFor(file: string): string[] {
  const noExt = file.replace(/\.tsx?$/, "");
  const alias = `@/${noExt}`;
  const out = [alias];
  // A directory import resolves to its index.
  if (noExt.endsWith("/index")) out.push(alias.slice(0, -"/index".length));
  // Relative imports inside components/ use the bare basename or a path tail.
  const parts = noExt.split("/");
  out.push(`/${parts[parts.length - 1]}`);
  return out;
}

describe("no component ships untested-into-nowhere", () => {
  it("finds components to check", () => {
    // Load-bearing: an empty list would make the assertion below vacuous.
    expect(componentFiles.length).toBeGreaterThan(10);
  });

  it("every component is imported by production code, not only by a test", () => {
    const offenders: string[] = [];
    for (const file of componentFiles) {
      if (EXEMPT.some((re) => re.test(file))) continue;
      const specs = specifiersFor(file);
      const importedBy = Array.from(sources.entries()).filter(
        ([other, src]) =>
          other !== file &&
          specs.some((s) => {
            const lit = s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
            // `from "…"` covers static imports; `import("…")` covers
            // next/dynamic, which is how the recharts bundle is loaded
            // (ssr:false). Matching only the first reported a live component
            // as dead — the first thing this guard was asked, it got wrong.
            return (
              new RegExp(`from\\s+["'][^"']*${lit}["']`).test(src) ||
              new RegExp(`import\\(\\s*["'][^"']*${lit}["']`).test(src)
            );
          })
      );
      if (importedBy.length === 0) {
        offenders.push(
          `${file} is imported by nothing under ${PRODUCTION_DIRS.join("/, ")}/. ` +
            `If a test renders it, the test is green against markup no visitor loads. ` +
            `Wire it into a page or delete it — and delete its test with it.`
        );
      }
    }
    expect(offenders).toEqual([]);
  });
});
