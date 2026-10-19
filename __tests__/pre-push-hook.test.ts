/**
 * @jest-environment node
 */
import { execFileSync, spawnSync } from "node:child_process";
import {
  chmodSync,
  copyFileSync,
  existsSync,
  mkdirSync,
  mkdtempSync,
  readFileSync,
  rmSync,
  writeFileSync,
} from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join } from "node:path";

const ROOT = process.cwd();
const HOOK = join(ROOT, ".githooks", "pre-push");
const VERIFICATION = "public/google5c16a36058a0e9e7.html";
const ZERO = "0".repeat(40);

let dir: string;
let stubDir: string;
let npxLog: string;

function git(...args: string[]): string {
  return execFileSync(
    "git",
    [
      "-c",
      "core.hooksPath=/dev/null",
      "-c",
      "commit.gpgsign=false",
      "-c",
      "user.name=Fixture",
      "-c",
      "user.email=fixture@example.com",
      ...args,
    ],
    { cwd: dir, encoding: "utf8" }
  ).trim();
}

function write(path: string, text: string) {
  mkdirSync(dirname(join(dir, path)), { recursive: true });
  writeFileSync(join(dir, path), text);
}

function commit(message: string): string {
  git("add", "-A");
  git("commit", "-q", "-m", message);
  return git("rev-parse", "HEAD");
}

/** Runs the real hook as git would, with the push line on stdin. */
function push(
  localSha: string,
  remoteSha: string,
  remoteRef = "refs/heads/main",
  jestExit = 0
) {
  return spawnSync(HOOK, ["origin", "git@example.com:repo.git"], {
    cwd: dir,
    input: `refs/heads/x ${localSha} ${remoteRef} ${remoteSha}\n`,
    encoding: "utf8",
    env: {
      ...process.env,
      PATH: `${stubDir}:${process.env.PATH}`,
      STUB_EXIT: String(jestExit),
      NPX_LOG: npxLog,
    },
  });
}

const npxRan = () => existsSync(npxLog);

beforeEach(() => {
  dir = mkdtempSync(join(tmpdir(), "pre-push-fixture-"));
  stubDir = join(dir, ".stub-bin");
  npxLog = join(dir, ".npx-log");
  mkdirSync(stubDir);
  writeFileSync(
    join(stubDir, "npx"),
    '#!/bin/sh\necho "$@" > "$NPX_LOG"\nexit "$STUB_EXIT"\n'
  );
  chmodSync(join(stubDir, "npx"), 0o755);
  git("init", "-q", "-b", "main");
  writeFileSync(join(dir, ".gitignore"), ".stub-bin/\n.npx-log\n");
  write(
    VERIFICATION,
    "google-site-verification: google5c16a36058a0e9e7.html\n"
  );
  write("README.md", "fixture\n");
  write("lib/structured-data.ts", "export const person = {};\n");
  commit("base");
});

afterEach(() => {
  rmSync(dir, { recursive: true, force: true });
});

describe(".githooks/pre-push", () => {
  it("blocks a push to main that deletes the Search Console file", () => {
    const base = git("rev-parse", "HEAD");
    rmSync(join(dir, VERIFICATION));
    const head = commit("drop verification");
    const r = push(head, base);
    expect(r.status).toBe(1);
    expect(r.stderr).toContain("google5c16a36058a0e9e7.html");
    expect(npxRan()).toBe(false);
  });

  it("lets a README-only push through without running Jest", () => {
    const base = git("rev-parse", "HEAD");
    write("README.md", "changed\n");
    const r = push(commit("docs"), base);
    expect(r.status).toBe(0);
    expect(npxRan()).toBe(false);
  });

  it("runs the SEO suites when an SEO path changes, and passes when they pass", () => {
    const base = git("rev-parse", "HEAD");
    write("lib/structured-data.ts", "export const person = { a: 1 };\n");
    const r = push(commit("schema"), base);
    expect(r.status).toBe(0);
    const args = readFileSync(npxLog, "utf8");
    expect(args).toContain("jest");
    expect(args).toContain("__tests__/seo-identity.test.ts");
  });

  it("blocks the push when the SEO suites fail (e.g. `seeks` re-added)", () => {
    const base = git("rev-parse", "HEAD");
    write("lib/structured-data.ts", 'export const person = { seeks: "x" };\n');
    const r = push(commit("seeks"), base, "refs/heads/main", 1);
    expect(r.status).toBe(1);
    expect(r.stderr).toContain("SEO suites failed");
  });

  it("ignores pushes to branches other than main", () => {
    const base = git("rev-parse", "HEAD");
    rmSync(join(dir, VERIFICATION));
    write("lib/structured-data.ts", "changed\n");
    const r = push(commit("branch work"), base, "refs/heads/feature", 1);
    expect(r.status).toBe(0);
    expect(npxRan()).toBe(false);
  });

  it("checks a first push of main (no remote sha) against the whole tree", () => {
    const head = git("rev-parse", "HEAD");
    const r = push(head, ZERO);
    expect(r.status).toBe(0);
    expect(npxRan()).toBe(true);
  });

  it("blocks when uncommitted SEO edits would be tested instead of the pushed commit", () => {
    const base = git("rev-parse", "HEAD");
    write("lib/structured-data.ts", "export const person = { a: 1 };\n");
    const head = commit("schema");
    write("lib/structured-data.ts", "export const person = { a: 2 };\n");
    const r = push(head, base);
    expect(r.status).toBe(1);
    expect(r.stderr).toContain("uncommitted changes");
    expect(npxRan()).toBe(false);
  });
});

describe("scripts/install-git-hooks.mjs (the prepare script)", () => {
  function installIn(repo: string) {
    mkdirSync(join(repo, "scripts"), { recursive: true });
    const script = join(repo, "scripts", "install-git-hooks.mjs");
    copyFileSync(join(ROOT, "scripts", "install-git-hooks.mjs"), script);
    return execFileSync("node", [script], { encoding: "utf8" }).trim();
  }
  const hooksPath = () => {
    const r = spawnSync(
      "git",
      ["config", "--local", "--get", "core.hooksPath"],
      {
        cwd: dir,
        encoding: "utf8",
      }
    );
    return r.stdout.trim();
  };

  it("sets core.hooksPath in the repo's local config, idempotently", () => {
    expect(installIn(dir)).toBe("git hooks: installed");
    expect(hooksPath()).toBe(".githooks");
    expect(installIn(dir)).toBe("git hooks: unchanged");
    expect(hooksPath()).toBe(".githooks");
  });

  it("does nothing when the package is not the repository root", () => {
    const nested = join(dir, "packages", "inner");
    mkdirSync(nested, { recursive: true });
    expect(installIn(nested)).toContain("skipped");
    expect(hooksPath()).toBe("");
  });

  it("leaves a hooksPath someone else set alone", () => {
    git("config", "--local", "core.hooksPath", ".husky");
    expect(installIn(dir)).toContain("skipped");
    expect(hooksPath()).toBe(".husky");
  });

  it("is wired as this package's prepare script", () => {
    const pkg = JSON.parse(readFileSync(join(ROOT, "package.json"), "utf8"));
    expect(pkg.scripts.prepare).toBe("node scripts/install-git-hooks.mjs");
  });
});
