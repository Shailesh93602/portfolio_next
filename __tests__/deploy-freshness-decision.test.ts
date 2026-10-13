/**
 * @jest-environment node
 *
 * scripts/deploy-freshness-decision.mjs — the decision behind the daily
 * "does live serve main?" job, run against a fake clock.
 *
 * The property under test is the grace window: a run minutes after a merge
 * sees a build in flight and must say `deploying` (exit 0, warning), while a
 * build that is missing anything older than the window is still a FAIL. The
 * window is anchored on the oldest change live is missing — NOT on main HEAD,
 * because an unrelated fresh commit must not excuse a week-old build. And a
 * private repository, having no commit times, has no window at all.
 *
 * The second property is that a failing row is ACTIONABLE: it says how long
 * live has been behind in the unit a reader thinks in ("live is 7d behind
 * main", not two shas), and for an app that can wedge its deploys on a failed
 * migration it names that cause class in one extra line. KhataGO's week-long
 * outage had exactly that cause and the daily check said none of it.
 */
import {
  DEFAULT_GRACE_MINUTES,
  MAX_LAG_MS,
  decideFreshness,
} from "../scripts/deploy-freshness-decision.mjs";
import {
  GRACE_MS,
  HOUR,
  MAIN,
  MIN,
  NOW,
  SERVED,
  aheadBy,
  fakeProbes,
  iso,
  notFound,
  opts,
  privateHead,
  readableHead,
  serving,
  target,
} from "./helpers/deploy-freshness-fixtures";

describe("decideFreshness — the grace window", () => {
  it("fresh: served sha is main HEAD → ok, and no compare call is made", async () => {
    const { probes, calls } = fakeProbes({});
    const r = await decideFreshness(
      { target, live: serving(MAIN), head: readableHead(5 * MIN) },
      probes,
      opts
    );
    expect(r).toMatchObject({ ok: true, verdict: "ok" });
    expect(r.deploying).toBeUndefined();
    expect(calls).toEqual({ route: 0, compare: 0 });
  });

  it("deploying inside grace: one commit behind, merged 5 minutes ago → deploying, ok", async () => {
    const { probes } = fakeProbes({ compare: aheadBy([5 * MIN]) });
    const r = await decideFreshness(
      { target, live: serving(SERVED), head: readableHead(5 * MIN) },
      probes,
      opts
    );
    expect(r).toMatchObject({
      ok: true,
      deploying: true,
      verdict: "deploying",
    });
    expect(r.detail).toMatch(/inside the 30m grace window/);
  });

  it("stale outside grace: one commit behind for 25 hours → FAIL, regardless of a fresh HEAD", async () => {
    // main HEAD was committed 5 minutes ago, but the OLDEST unserved commit is
    // 25 hours old: a fresh commit must not reset the window.
    const { probes } = fakeProbes({ compare: aheadBy([5 * MIN, 25 * HOUR]) });
    const r = await decideFreshness(
      { target, live: serving(SERVED), head: readableHead(5 * MIN) },
      probes,
      opts
    );
    expect(r).toMatchObject({ ok: false, verdict: "FAIL" });
    expect(r.detail).toMatch(/over the 24\.0h window/);
  });

  it("behind, past grace but under 24h → ok (not deploying, not stale)", async () => {
    const { probes } = fakeProbes({ compare: aheadBy([2 * HOUR]) });
    const r = await decideFreshness(
      { target, live: serving(SERVED), head: readableHead(2 * HOUR) },
      probes,
      opts
    );
    expect(r).toMatchObject({ ok: true, verdict: "ok" });
    expect(r.deploying).toBeUndefined();
    expect(r.detail).toMatch(/within the 24\.0h window/);
  });

  it("the grace boundary is inclusive: exactly 30 minutes is still deploying, 30m+1s is not", async () => {
    const at = async (ago: number) =>
      decideFreshness(
        { target, live: serving(SERVED), head: readableHead(ago) },
        fakeProbes({ compare: aheadBy([ago]) }).probes,
        opts
      );
    expect((await at(GRACE_MS)).verdict).toBe("deploying");
    expect((await at(GRACE_MS + 1000)).verdict).toBe("ok");
  });

  it("404 inside grace: the route reached main 3 minutes ago → deploying, ok", async () => {
    const { probes, calls } = fakeProbes({
      route: { status: 200, lastCommitDate: iso(3 * MIN) },
    });
    const r = await decideFreshness(
      { target, live: notFound, head: readableHead(3 * MIN) },
      probes,
      opts
    );
    expect(r).toMatchObject({
      ok: true,
      deploying: true,
      verdict: "deploying",
    });
    expect(r.detail).toMatch(/answers 404/);
    expect(r.detail).toMatch(/live is 3m behind main/);
    expect(calls).toEqual({ route: 1, compare: 0 });
  });

  it("404 outside grace: the route has been on main for 8 hours → FAIL, even though HEAD is 4 minutes old", async () => {
    // KhataGO on 2026-09-05 15:34Z: an unrelated commit landed at 15:29Z while
    // live was still the Aug 29 build. Anchored on HEAD this would have read
    // "deploying". It is a stale deploy.
    const { probes } = fakeProbes({
      route: { status: 200, lastCommitDate: iso(8 * HOUR) },
    });
    const r = await decideFreshness(
      { target, live: notFound, head: readableHead(4 * MIN) },
      probes,
      opts
    );
    expect(r).toMatchObject({ ok: false, verdict: "FAIL" });
    expect(r.detail).toMatch(/live is 8\.0h behind main/);
    expect(r.detail).toMatch(/outside the 30m grace window/);
    expect(r.detail).toMatch(/stale deploy/);
  });

  it("404 with no date for the route (API gave none) → FAIL: unknown age is not inside any window", async () => {
    const { probes } = fakeProbes({
      route: { status: 200, lastCommitDate: null },
    });
    const r = await decideFreshness(
      { target, live: notFound, head: readableHead(1 * MIN) },
      probes,
      opts
    );
    expect(r).toMatchObject({ ok: false, verdict: "FAIL" });
    expect(r.detail).toMatch(/how far behind live is cannot be measured/);
  });

  it("404 while the route is not on main → ok, expected", async () => {
    const { probes } = fakeProbes({
      route: { status: 404, lastCommitDate: null },
    });
    const r = await decideFreshness(
      { target, live: notFound, head: readableHead(1 * MIN) },
      probes,
      opts
    );
    expect(r).toMatchObject({ ok: true, verdict: "ok" });
    expect(r.detail).toMatch(/not on main yet/);
  });

  it("private: a served sha with an unreadable repo → cannot verify (private), never a pass", async () => {
    const { probes, calls } = fakeProbes({});
    const r = await decideFreshness(
      { target, live: serving(SERVED), head: privateHead },
      probes,
      opts
    );
    expect(r).toMatchObject({
      ok: true,
      unverifiable: true,
      verdict: "cannot verify (private)",
    });
    expect(calls).toEqual({ route: 0, compare: 0 });
  });

  it("private + 404 + declared route date → FAIL with no grace (there are no commit times to measure from)", async () => {
    // The KhataGO row as the Actions token sees it. `now` is one minute after
    // midnight on the declared date — a window anchored on the date would
    // pass it; there is no window here.
    const { probes, calls } = fakeProbes({});
    const r = await decideFreshness(
      {
        target: { ...target, routeOnMainSince: "2026-09-05" },
        live: notFound,
        head: privateHead,
      },
      probes,
      { now: Date.parse("2026-09-05T00:01:00.000Z"), graceMs: GRACE_MS }
    );
    expect(r).toMatchObject({ ok: false, verdict: "FAIL" });
    expect(r.detail).toMatch(/private to this token/);
    expect(r.detail).toMatch(/since 2026-09-05/);
    // A bound, not a claim: the true lag starts at the first failed build,
    // which a token that cannot read the repository cannot see.
    expect(r.detail).toMatch(/at least 1m behind main/);
    expect(calls).toEqual({ route: 0, compare: 0 });
  });

  it("private + 404 with no declared date → cannot verify (private)", async () => {
    const r = await decideFreshness(
      { target, live: notFound, head: privateHead },
      fakeProbes({}).probes,
      opts
    );
    expect(r).toMatchObject({
      ok: true,
      unverifiable: true,
      verdict: "cannot verify (private)",
    });
  });

  it("a zero-minute window disables grace: one commit behind by 10s is ok-in-window, never deploying", async () => {
    const r = await decideFreshness(
      { target, live: serving(SERVED), head: readableHead(10_000) },
      fakeProbes({ compare: aheadBy([10_000]) }).probes,
      { now: NOW, graceMs: 0 }
    );
    expect(r).toMatchObject({ ok: true, verdict: "ok" });
    expect(r.deploying).toBeUndefined();
  });

  it("the defaults are 30 minutes of grace and a 24-hour lag window", () => {
    expect(DEFAULT_GRACE_MINUTES).toBe(30);
    expect(MAX_LAG_MS).toBe(24 * HOUR);
  });
});

describe("decideFreshness — the rules the window does not touch", () => {
  it("unreachable live site → FAIL, before any repository lookup", async () => {
    const { probes, calls } = fakeProbes({});
    const r = await decideFreshness(
      {
        target,
        live: { status: 0, json: null, error: "ECONNREFUSED" },
        head: readableHead(1 * MIN),
      },
      probes,
      opts
    );
    expect(r).toMatchObject({ ok: false, verdict: "FAIL" });
    expect(r.detail).toMatch(/unreachable \(ECONNREFUSED\)/);
    expect(calls).toEqual({ route: 0, compare: 0 });
  });

  it("served sha `unknown` (build did not bake its sha) → FAIL, even inside grace", async () => {
    const r = await decideFreshness(
      { target, live: serving("unknown"), head: readableHead(1 * MIN) },
      fakeProbes({}).probes,
      opts
    );
    expect(r).toMatchObject({ ok: false, verdict: "FAIL" });
    expect(r.detail).toMatch(/did not bake its git sha/);
  });

  it("served sha not an ancestor of main (diverged) → FAIL, even inside grace", async () => {
    const r = await decideFreshness(
      { target, live: serving(SERVED), head: readableHead(1 * MIN) },
      fakeProbes({
        compare: {
          status: 200,
          json: { status: "diverged", ahead_by: 1, commits: [] },
        },
      }).probes,
      opts
    );
    expect(r).toMatchObject({ ok: false, verdict: "FAIL" });
    expect(r.detail).toMatch(/not an ancestor of main .* \(diverged\)/);
  });

  it("served sha unknown to the repository (compare 404) → FAIL", async () => {
    const r = await decideFreshness(
      { target, live: serving(SERVED), head: readableHead(1 * MIN) },
      fakeProbes({ compare: { status: 404, json: null } }).probes,
      opts
    );
    expect(r).toMatchObject({ ok: false, verdict: "FAIL" });
    expect(r.detail).toMatch(/not a commit in owner\/repo/);
  });

  it("GitHub API unavailable (non-200, non-404) → skipped and unverifiable, not a pass or a fail", async () => {
    const r = await decideFreshness(
      { target, live: serving(SERVED), head: { status: 403, json: null } },
      fakeProbes({}).probes,
      opts
    );
    expect(r).toMatchObject({
      ok: true,
      unverifiable: true,
      verdict: "skipped",
    });
  });
});

// The cause-class hint is covered in deploy-freshness-cause-hint.test.ts; the
// env parsing, age formatting and summary line in deploy-freshness-format.test.ts.
