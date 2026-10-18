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

const label = (f: UnshippedFeature) => `${f.project}: ${f.feature}`;

describe.each(UNSHIPPED_FEATURES.map((f) => [label(f), f] as const))(
  "unshipped %s",
  (_name, feature) => {
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
    const refExists =
      existsSync(repoDir) &&
      gitSucceeds(repoDir, ["rev-parse", "--verify", "-q", feature.ref]);

    // CI has no sibling checkout; locally this is what retires the entry.
    (refExists ? it : it.skip)(
      `is still absent on ${feature.repo} ${feature.ref}`,
      () => {
        const present = feature.absentOnMain.filter((path) =>
          gitSucceeds(repoDir, ["cat-file", "-e", `${feature.ref}:${path}`])
        );
        expect(present).toEqual([]);
      }
    );
  }
);
