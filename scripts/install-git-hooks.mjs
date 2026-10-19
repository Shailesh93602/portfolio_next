#!/usr/bin/env node
// Points this clone's core.hooksPath at .githooks. Runs from `prepare`;
// touches only this repository's local config, and only when it is the git root.
import { execFileSync } from "node:child_process";
import { realpathSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const HOOKS_PATH = ".githooks";
const repoDir = join(dirname(fileURLToPath(import.meta.url)), "..");

function git(args) {
  return execFileSync("git", ["-C", repoDir, ...args], {
    encoding: "utf8",
    stdio: ["ignore", "pipe", "ignore"],
  }).trim();
}

function install() {
  let top;
  try {
    top = git(["rev-parse", "--show-toplevel"]);
  } catch {
    return "skipped: not a git checkout";
  }
  if (realpathSync(top) !== realpathSync(repoDir)) {
    return "skipped: package is not the root of its git repository";
  }
  let current = "";
  try {
    current = git(["config", "--local", "--get", "core.hooksPath"]);
  } catch {
    current = "";
  }
  if (current === HOOKS_PATH) return "unchanged";
  if (current) return `skipped: core.hooksPath is already "${current}"`;
  git(["config", "--local", "core.hooksPath", HOOKS_PATH]);
  return "installed";
}

console.log(`git hooks: ${install()}`);
