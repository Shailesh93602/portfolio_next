import { execFileSync } from "node:child_process";
import { copyFileSync, mkdtempSync, readFileSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join, resolve } from "node:path";

const repo = resolve(__dirname, "..");
const SCRIPT = "scripts/generate-route-dates.mjs";
const DATES = "lib/route-modified.json";

describe("generate-route-dates in a shallow clone (how Vercel builds)", () => {
  let clone: string;

  beforeAll(() => {
    clone = join(mkdtempSync(join(tmpdir(), "route-dates-")), "repo");
    execFileSync(
      "git",
      ["clone", "--quiet", "--depth", "1", `file://${repo}`, clone],
      { stdio: "ignore" }
    );
    // Run the working-tree script against the working-tree dates.
    copyFileSync(join(repo, SCRIPT), join(clone, SCRIPT));
    copyFileSync(join(repo, DATES), join(clone, DATES));
  }, 60_000);

  afterAll(() =>
    rmSync(resolve(clone, ".."), { recursive: true, force: true })
  );

  it("keeps the committed dates instead of the boundary commit's", () => {
    const before = readFileSync(join(clone, DATES), "utf8");
    execFileSync("node", [SCRIPT], { cwd: clone, stdio: "ignore" });
    expect(readFileSync(join(clone, DATES), "utf8")).toBe(before);
  });
});
