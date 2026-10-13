/**
 * Fixtures shared by the deploy-freshness-*.test.ts files: a fake clock, a
 * target, GitHub/live response shapes and probes that record their calls.
 */
export const NOW = Date.parse("2026-09-05T12:00:00.000Z");
export const GRACE_MS = 30 * 60_000;
export const MIN = 60_000;
export const HOUR = 60 * MIN;

export const iso = (msAgo: number) => new Date(NOW - msAgo).toISOString();

export const MAIN = "aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa";
export const SERVED = "bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb";

export const target = {
  name: "site",
  url: "https://site.example/api/version",
  shaPath: ["sha"],
  repo: "owner/repo",
  routePath: "app/api/version/route.ts",
};

/** GitHub `commits/main`, committed `headAgo` ms before NOW. */
export const readableHead = (headAgo: number) => ({
  status: 200,
  json: { sha: MAIN, commit: { committer: { date: iso(headAgo) } } },
});
export const privateHead = { status: 404, json: { message: "Not Found" } };

export const serving = (sha: string) => ({ status: 200, json: { sha } });
export const notFound = { status: 404, json: null };

/** Probes that record whether they were consulted. */
export function fakeProbes(answers: {
  route?: { status: number; lastCommitDate: string | null };
  compare?: { status: number; json: unknown };
}) {
  const calls = { route: 0, compare: 0 };
  return {
    calls,
    probes: {
      async route() {
        calls.route++;
        if (!answers.route) throw new Error("route probe not expected");
        return answers.route;
      },
      async compare() {
        calls.compare++;
        if (!answers.compare) throw new Error("compare probe not expected");
        return answers.compare;
      },
    },
  };
}

/** `compare/<served>...main`: main ahead by the given commits (ms ago each). */
export const aheadBy = (commitAges: number[]) => ({
  status: 200,
  json: {
    status: "ahead",
    ahead_by: commitAges.length,
    commits: commitAges.map((ago) => ({
      commit: { committer: { date: iso(ago) } },
    })),
  },
});

export const opts = { now: NOW, graceMs: GRACE_MS };
