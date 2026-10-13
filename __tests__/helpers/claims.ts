import { readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";

import { projects } from "@/constants/projects";

/** A project by id; throws so a renamed id fails loudly instead of as `undefined`. */
export function byId(id: string) {
  const project = projects.find((p) => p.id === id);
  if (!project) throw new Error(`no project with id "${id}"`);
  return project;
}

/** A file in this repository, as text. */
export const readRepoFile = (...segments: string[]) =>
  readFileSync(join(process.cwd(), ...segments), "utf8");

/**
 * The daily claim check's source: the runner plus the modules it imports from
 * `scripts/claims/`, where the claim list itself lives. Tests that assert what
 * the check reads must read all of it, or moving a claim between files would
 * turn them red (or, worse, vacuous).
 */
export function claimCheckSource(): string {
  const dir = join(process.cwd(), "scripts", "claims");
  const modules = readdirSync(dir)
    .filter((f) => f.endsWith(".mjs"))
    .sort()
    .map((f) => readFileSync(join(dir, f), "utf8"));
  return [readRepoFile("scripts", "check-project-claims.mjs"), ...modules].join(
    "\n"
  );
}
