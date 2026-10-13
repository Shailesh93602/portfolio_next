/** @jest-environment node */
import { LEVEL, evaluateClaim } from "../scripts/claims/evaluate.mjs";
import { CLAIMS, withinMethod } from "../scripts/claims/claim-list.mjs";

const local = {
  projects: { label: "constants/projects.ts", text: "Tests: Vitest (22)" },
  claims: { label: "lib/claims.ts", text: "export const COUNT = 7;" },
  profile: { label: "lib/profile.ts", text: "problemsSolved: 640," },
};

/** Readers that serve fixed text and record what they were asked for. */
function readers(files: Record<string, string> = {}, tree: string[] = []) {
  const calls: string[] = [];
  return {
    calls,
    io: {
      async fetchAtHead(repo: string, path: string) {
        calls.push(`file ${repo}/${path}`);
        if (!(path in files)) throw new Error(`HTTP 404 for ${path}`);
        return files[path];
      },
      async fetchTree(repo: string) {
        calls.push(`tree ${repo}`);
        return tree;
      },
      async fetchPage(url: string) {
        calls.push(`page ${url}`);
        if (!("page" in files)) throw new Error("HTTP 503");
        return files.page;
      },
    },
  };
}

const exact = {
  what: "count",
  localFile: "claims",
  localPattern: /COUNT = (\d+)/,
  repo: "o/r",
  path: "README.md",
  sourcePattern: /(\d+) tests/,
};

describe("evaluateClaim", () => {
  it("passes when upstream states the same number", async () => {
    const r = await evaluateClaim(
      exact,
      local,
      readers({ "README.md": "7 tests" }).io
    );
    expect(r).toEqual({
      outcome: "pass",
      message: "✓  count: portfolio says 7, upstream agrees",
    });
  });

  it("fails when upstream states a different number", async () => {
    const r = await evaluateClaim(
      exact,
      local,
      readers({ "README.md": "9 tests" }).io
    );
    expect(r.outcome).toBe("fail");
    expect(r.message).toBe("✗  count: portfolio says 7, upstream says 9");
  });

  it("fails without any read when the local claim is gone", async () => {
    const { io, calls } = readers();
    const r = await evaluateClaim(
      { ...exact, localPattern: /NOPE (\d+)/ },
      local,
      io
    );
    expect(r.outcome).toBe("fail");
    expect(r.message).toMatch(/no longer found in lib\/claims\.ts/);
    expect(calls).toEqual([]);
  });

  it("defaults to projects.ts when a claim names no local file", async () => {
    const r = await evaluateClaim(
      { ...exact, localFile: undefined, localPattern: /Vitest \((\d+)\)/ },
      local,
      readers({ "README.md": "22 tests" }).io
    );
    expect(r.outcome).toBe("pass");
  });

  it("fails when the upstream pattern stops matching", async () => {
    const r = await evaluateClaim(
      exact,
      local,
      readers({ "README.md": "reworded" }).io
    );
    expect(r.outcome).toBe("fail");
    expect(r.message).toMatch(/upstream no longer states this/);
  });

  it("counts matches with sourceCount", async () => {
    const claim = { ...exact, sourcePattern: undefined, sourceCount: /^x/gm };
    const r = await evaluateClaim(
      claim,
      local,
      readers({ "README.md": "x\nx\nx\nx\nx\nx\nx" }).io
    );
    expect(r.outcome).toBe("pass");
  });

  it("fails when sourceExtract reports the shape is gone", async () => {
    const claim = {
      ...exact,
      sourcePattern: undefined,
      sourceExtract: () => null,
    };
    const r = await evaluateClaim(
      claim,
      local,
      readers({ "README.md": "" }).io
    );
    expect(r.outcome).toBe("fail");
    expect(r.message).toMatch(/no longer has the shape/);
  });

  it("presence claims pass while the mechanism is there and fail when it goes", async () => {
    const claim = {
      what: "mechanism",
      localFile: "claims",
      localPattern: /(COUNT)/,
      repo: "o/r",
      path: "src.ts",
      sourceMustMatch: /withLock/,
    };
    const yes = await evaluateClaim(
      claim,
      local,
      readers({ "src.ts": "withLock()" }).io
    );
    const no = await evaluateClaim(
      claim,
      local,
      readers({ "src.ts": "nothing" }).io
    );
    expect(yes).toEqual({
      outcome: "pass",
      message: "✓  mechanism: still implemented in src.ts",
    });
    expect(no.outcome).toBe("fail");
    expect(no.message).toMatch(/the claim is now FALSE/);
  });

  describe("tree claims", () => {
    const tree = {
      what: "routes",
      localFile: "claims",
      localPattern: /COUNT = (\d+)/,
      repo: "o/r",
      tree: /^api\/.*\.ts$/,
    };
    const paths = ["api/a.ts", "api/b.ts", "README.md"];

    it("counts matching paths", async () => {
      const r = await evaluateClaim(
        { ...tree, localPattern: /(2)/ },
        { ...local, claims: { label: "x", text: "2" } },
        readers({}, paths).io
      );
      expect(r.message).toBe(
        "✓  routes: portfolio says 2, o/r agrees (2 file(s))"
      );
    });

    it("sums a per-file pattern with countIn", async () => {
      const files = { "api/a.ts": "it(it(it(", "api/b.ts": "it(it(it(it(" };
      const r = await evaluateClaim(
        { ...tree, countIn: /it\(/g },
        local,
        readers(files, paths).io
      );
      expect(r.outcome).toBe("pass");
    });

    it("fails when no file matches — the layout moved", async () => {
      const r = await evaluateClaim(tree, local, readers({}, ["x.md"]).io);
      expect(r.outcome).toBe("fail");
      expect(r.message).toMatch(/no longer looking at anything/);
    });
  });

  describe("floors (compare: atLeast)", () => {
    const floor = {
      what: "solved",
      localFile: "profile",
      localPattern: /problemsSolved: (\d+)/,
      url: "https://example.test/u",
      sourcePattern: /total":(\d+)/,
      compare: "atLeast",
      fragile: true,
    };

    it("passes above the floor and says it can be raised", async () => {
      const r = await evaluateClaim(
        floor,
        local,
        readers({ page: 'total":649' }).io
      );
      expect(r.message).toBe(
        "✓  solved: portfolio says 640+, upstream says 649 — the floor can be raised"
      );
    });

    it("fails below the floor", async () => {
      const r = await evaluateClaim(
        floor,
        local,
        readers({ page: 'total":639' }).io
      );
      expect(r.outcome).toBe("fail");
    });

    it("a fragile page that moved its field is unverifiable, not false", async () => {
      const r = await evaluateClaim(
        floor,
        local,
        readers({ page: "<html/>" }).io
      );
      expect(r.outcome).toBe("unverifiable");
      expect(r.message).toMatch(/UNVERIFIABLE until the check is updated/);
    });

    it("a fragile page that cannot be read is unverifiable this run", async () => {
      const r = await evaluateClaim(floor, local, readers().io);
      expect(r.outcome).toBe("unverifiable");
      expect(r.message).toMatch(/UNVERIFIABLE this run/);
    });
  });

  it("a private repo's 404 is unverifiable; any other read error is skipped", async () => {
    const priv = await evaluateClaim(
      { ...exact, privateRepo: true },
      local,
      readers().io
    );
    const outage = await evaluateClaim(exact, local, readers().io);
    expect(priv.outcome).toBe("unverifiable");
    expect(priv.message).toMatch(/o\/r is private/);
    expect(outage.outcome).toBe("skipped");
    expect(outage.message).toMatch(/could not reach source .* — skipped/);
  });

  it("prints passes on stdout, failures on stderr, the rest as warnings", () => {
    expect(LEVEL).toEqual({
      pass: "log",
      fail: "error",
      unverifiable: "warn",
      skipped: "warn",
    });
  });
});

describe("the claim list", () => {
  it("every claim has exactly one way to read upstream", () => {
    for (const claim of CLAIMS) {
      expect(claim.localPattern).toBeInstanceOf(RegExp);
      const ways = [
        claim.tree,
        claim.sourceCheck ?? claim.sourceMustMatch,
        claim.sourceCount ?? claim.sourceExtract ?? claim.sourcePattern,
      ].filter(Boolean);
      expect([claim.what, ways.length]).toEqual([claim.what, 1]);
    }
  });

  it("withinMethod looks only inside the named method's body", () => {
    const src = [
      "class R {",
      "  async startBattle() {",
      "    return withBattleLock(() => 1);",
      "  }",
      "  async endBattle() {",
      "    return withOtherLock();",
      "  }",
      "}",
    ].join("\n");
    expect(withinMethod(src, "async startBattle", "withBattleLock")).toBe(true);
    expect(withinMethod(src, "async startBattle", "withOtherLock")).toBe(false);
    expect(withinMethod(src, "async missing", "withBattleLock")).toBe(false);
  });
});
