import { readFileSync } from "node:fs";
import { join } from "node:path";

export interface BatchEntry {
  slug: string;
  published: boolean;
}

// Read from source: staged slugs are commented out, so publishing stays a one-line uncomment.
export function stagedBatch(): BatchEntry[] {
  const src = readFileSync(join(process.cwd(), "lib", "blog-data.ts"), "utf8");
  const start = src.indexOf("// STAGED 2026-10");
  const end = src.indexOf("// END STAGED 2026-10");
  if (start < 0 || end < start) {
    throw new Error("lib/blog-data.ts has no STAGED 2026-10 … END block");
  }
  const entries: BatchEntry[] = [];
  for (const line of src.slice(start, end).split("\n")) {
    const m = line.match(/^\s*(\/\/\s*)?"([a-z0-9-]+)",/);
    if (m) entries.push({ slug: m[2], published: !m[1] });
  }
  return entries;
}

export const stagedSlugs = (): string[] =>
  stagedBatch()
    .filter((e) => !e.published)
    .map((e) => e.slug);
