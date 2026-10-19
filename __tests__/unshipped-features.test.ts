import { execFileSync } from "node:child_process";
import { existsSync } from "node:fs";
import { join } from "node:path";

import { blogPosts } from "@/lib/blog-data";
import { byId, readRepoFile } from "./helpers/claims";
import {
  UNSHIPPED_FEATURES,
  type UnshippedFeature,
} from "./helpers/unshipped-features";

interface Surface {
  name: string;
  text: string;
}

const mentions = (text: string, title: string) =>
  text.toLowerCase().includes(title.toLowerCase());

// A markdown section whose heading names the project counts whole; elsewhere
// only the lines that name it, so ContextQA's own MCP work stays sayable.
function markdownScope(text: string, title: string): string {
  return text
    .split(/\n(?=#{1,3} )|\n---\n/)
    .map((section) =>
      mentions(section.split("\n")[0], title)
        ? section
        : section
            .split("\n")
            .filter((line) => mentions(line, title))
            .join("\n")
    )
    .join("\n");
}

function surfacesFor(projectId: string): Surface[] {
  const project = byId(projectId);
  const title = project.title;
  const resume = JSON.parse(readRepoFile("resume", "resume.json")) as {
    projects: { name: string }[];
  };
  const pages = [
    ["app", "engineering", "page.tsx"],
    ["app", "HomeContent.tsx"],
  ].map((segments) => ({
    name: segments.join("/"),
    text: readRepoFile(...segments),
  }));
  return [
    {
      name: `constants/projects.ts#${projectId}`,
      text: JSON.stringify(project),
    },
    ...["llms.txt", "llms-full.txt"].map((file) => ({
      name: `public/${file}`,
      text: markdownScope(readRepoFile("public", file), title),
    })),
    ...blogPosts.map((post) => ({
      name: `blog/${post.slug}`,
      text: `${post.title}\n${post.description}\n${post.content}`,
    })),
    ...pages,
    {
      name: "resume/resume.json#projects",
      text: JSON.stringify(
        resume.projects.filter((p) => mentions(p.name, title))
      ),
    },
  ].filter((surface) => mentions(surface.text, title));
}

function gitSucceeds(repoDir: string, args: string[]): boolean {
  try {
    execFileSync("git", ["-C", repoDir, ...args], { stdio: "ignore" });
    return true;
  } catch {
    return false;
  }
}

function servedSha(feature: UnshippedFeature): string | null {
  try {
    const body = execFileSync(
      "curl",
      ["-fsS", "--max-time", "10", feature.deployed.url],
      { encoding: "utf8" }
    );
    const sha = feature.deployed.shaPath.reduce<unknown>(
      (node, key) => (node as Record<string, unknown> | undefined)?.[key],
      JSON.parse(body)
    );
    return typeof sha === "string" && /^[0-9a-f]{7,40}$/.test(sha) ? sha : null;
  } catch {
    return null;
  }
}

const label = (f: UnshippedFeature) => `${f.project}: ${f.feature}`;

// Jest refuses an empty table, so an empty ledger runs one placeholder that registers no tests.
const ledger: [string, UnshippedFeature | undefined][] =
  UNSHIPPED_FEATURES.length
    ? UNSHIPPED_FEATURES.map((f) => [label(f), f])
    : [["(none withheld)", undefined]];

it("the unshipped ledger is a list (empty once every feature is live)", () => {
  expect(Array.isArray(UNSHIPPED_FEATURES)).toBe(true);
});

describe.each(ledger)("unshipped %s", (_name, feature) => {
  if (!feature) return;
  it("each pattern matches the claim that was removed", () => {
    for (const pattern of feature.patterns) {
      expect(feature.formerClaims.some((c) => pattern.test(c))).toBe(true);
    }
  });

  it("no surface describing the project advertises it", () => {
    const surfaces = surfacesFor(feature.project);
    expect(surfaces.length).toBeGreaterThan(1);
    const hits = surfaces.flatMap((s) =>
      feature.patterns
        .filter((p) => p.test(s.text))
        .map((p) => `${s.name} matches ${p}`)
    );
    expect(hits).toEqual([]);
  });

  const repoDir = join(process.cwd(), "..", feature.repo);
  const deployedSha = existsSync(repoDir) ? servedSha(feature) : null;

  // CI has no sibling checkout; locally this is what retires the entry.
  (deployedSha ? it : it.skip)(
    `is still absent from the commit ${feature.deployed.url} serves`,
    () => {
      const sha = deployedSha as string;
      // An unfetched commit would make every path look absent.
      expect(gitSucceeds(repoDir, ["cat-file", "-e", `${sha}^{commit}`])).toBe(
        true
      );
      const present = feature.absentFromDeployed.filter((path) =>
        gitSucceeds(repoDir, ["cat-file", "-e", `${sha}:${path}`])
      );
      expect(present).toEqual([]);
    }
  );
});
