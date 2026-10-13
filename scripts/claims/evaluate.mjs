/**
 * The decision half of scripts/check-project-claims.mjs: given one claim, the
 * local source text and a set of readers, say whether the claim still holds.
 * No I/O of its own — the readers are injected — so every verdict shape is
 * unit-testable without a network.
 *
 * Each claim produces exactly one report line.
 *
 * @typedef {"pass" | "fail" | "unverifiable" | "skipped"} Outcome
 * @typedef {{ outcome: Outcome, message: string }} ClaimResult
 * @typedef {{
 *   fetchAtHead: (repo: string, path: string) => Promise<string>,
 *   fetchTree: (repo: string) => Promise<string[]>,
 *   fetchPage: (url: string) => Promise<string>,
 * }} Readers
 * @typedef {Record<string, { label: string, text: string }>} LocalSources
 */

/** Which console stream each outcome is printed on. */
export const LEVEL = {
  pass: "log",
  fail: "error",
  unverifiable: "warn",
  skipped: "warn",
};

const pass = (message) => ({ outcome: "pass", message: `✓  ${message}` });
const fail = (message) => ({ outcome: "fail", message: `✗  ${message}` });
const unverifiable = (message) => ({
  outcome: "unverifiable",
  message: `⚠  ${message}`,
});
const skipped = (message) => ({ outcome: "skipped", message: `⚠  ${message}` });

/** Count matching paths in the repository, or sum a per-file pattern across them. */
async function checkTree(claim, stated, readers) {
  const paths = (await readers.fetchTree(claim.repo)).filter((path) =>
    claim.tree.test(path)
  );
  if (paths.length === 0) {
    // Zero matching files is never the answer to "how many are there" — it
    // means the repo moved and this check stopped looking anywhere real.
    // Passing quietly against an empty set is the failure mode this whole
    // script exists to prevent.
    return fail(
      `${claim.what}: no file in ${claim.repo} matches ${claim.tree} — ` +
        `the layout changed and this check is no longer looking at anything`
    );
  }
  let upstream = String(paths.length);
  if (claim.countIn) {
    let total = 0;
    for (const path of paths) {
      const text = await readers.fetchAtHead(claim.repo, path);
      total += (text.match(claim.countIn) ?? []).length;
    }
    upstream = String(total);
  }
  if (stated === upstream) {
    return pass(
      `${claim.what}: portfolio says ${stated}, ${claim.repo} agrees ` +
        `(${paths.length} file(s))`
    );
  }
  return fail(
    `${claim.what}: portfolio says ${stated}, ${claim.repo} says ${upstream}`
  );
}

/** Presence-shaped claim: the mechanism either is still implemented there or it is not. */
function checkPresence(claim, text) {
  const ok = claim.sourceCheck
    ? claim.sourceCheck(text)
    : claim.sourceMustMatch.test(text);
  if (!ok) {
    return fail(
      `${claim.what}: ${claim.path} no longer implements this — the claim is now FALSE`
    );
  }
  return pass(`${claim.what}: still implemented in ${claim.path}`);
}

/**
 * The number the upstream states, as `{ value }`, or the ClaimResult that
 * explains why it could not be read.
 *
 * @returns {{ value: string } | { result: ClaimResult }}
 */
function readUpstreamNumber(claim, stated, text) {
  if (claim.sourceCount) {
    return { value: String((text.match(claim.sourceCount) ?? []).length) };
  }
  if (claim.sourceExtract) {
    // For counts that a single regex cannot express — a destructuring list, or
    // the cases inside one of two mirror-image describe blocks. Returning null
    // means "the upstream no longer has the shape this reads", which is a
    // failure for the same reason a non-matching sourcePattern is.
    const extracted = claim.sourceExtract(text);
    if (extracted === null || extracted === undefined) {
      return {
        result: fail(
          `${claim.what}: ${claim.path} no longer has the shape this check ` +
            `reads — the claim is unverifiable`
        ),
      };
    }
    return { value: String(extracted) };
  }
  const m = text.match(claim.sourcePattern);
  if (m) return { value: m[1] };
  if (claim.fragile) {
    // The source is a third-party page, not a file this project's owner
    // controls. Its shape changing says nothing about the claim.
    return {
      result: unverifiable(
        `${claim.what}: portfolio says ${stated}, but ${claim.url} no longer ` +
          `exposes the field this check reads — UNVERIFIABLE until the check is updated.`
      ),
    };
  }
  return {
    result: fail(
      `${claim.what}: upstream no longer states this — the claim is unverifiable`
    ),
  };
}

/** Compare the stated number with the upstream one — exactly, or as a floor. */
function compareNumbers(claim, stated, upstream) {
  if (claim.compare === "atLeast") {
    const statedN = Number(stated);
    const upstreamN = Number(upstream);
    if (upstreamN >= statedN) {
      return pass(
        `${claim.what}: portfolio says ${stated}+, upstream says ${upstream}` +
          (upstreamN > statedN ? " — the floor can be raised" : "")
      );
    }
    return fail(
      `${claim.what}: portfolio says ${stated}+, upstream says ${upstream}`
    );
  }
  if (stated === upstream) {
    return pass(`${claim.what}: portfolio says ${stated}, upstream agrees`);
  }
  return fail(
    `${claim.what}: portfolio says ${stated}, upstream says ${upstream}`
  );
}

/** A read failed: decide whether that is unverifiable or merely skipped. */
function onReadError(claim, stated, error) {
  if (claim.fragile) {
    return unverifiable(
      `${claim.what}: could not read ${claim.url} (${error.message}) — UNVERIFIABLE this run.`
    );
  }
  if (claim.privateRepo && /HTTP 404/.test(error.message)) {
    // Distinguished from an outage ON PURPOSE. A private repo is not a
    // transient failure that will clear itself — it is a claim that CANNOT be
    // checked until something changes, and reporting it as a skipped network
    // blip would hide that indefinitely.
    return unverifiable(
      `${claim.what}: portfolio says ${stated}, but ${claim.repo} is private ` +
        `so this cannot be verified. It will check itself once the repo is public.`
    );
  }
  // A network failure is not a false claim. Say so rather than failing the
  // build for someone else's outage.
  return skipped(
    `${claim.what}: could not reach source (${error.message}) — skipped`
  );
}

/**
 * Verify one claim.
 *
 * @param {object} claim           one entry of CLAIMS
 * @param {LocalSources} local     where this portfolio states things
 * @param {Readers} readers        upstream readers
 * @returns {Promise<ClaimResult>}
 */
export async function evaluateClaim(claim, local, readers) {
  const source = local[claim.localFile ?? "projects"];
  const localMatch = source.text.match(claim.localPattern);
  if (!localMatch) {
    // The claim was reworded or removed. Not automatically wrong — but this
    // checker can no longer vouch for it, and silently passing would be the
    // failure mode the whole script exists to prevent.
    return fail(
      `${claim.what}: no longer found in ${source.label} — update or remove this check`
    );
  }
  const stated = localMatch[1];

  try {
    if (claim.tree) return await checkTree(claim, stated, readers);
    const text = claim.url
      ? await readers.fetchPage(claim.url)
      : await readers.fetchAtHead(claim.repo, claim.path);
    if (claim.sourceCheck || claim.sourceMustMatch) {
      return checkPresence(claim, text);
    }
    const upstream = readUpstreamNumber(claim, stated, text);
    if ("result" in upstream) return upstream.result;
    return compareNumbers(claim, stated, upstream.value);
  } catch (error) {
    return onReadError(claim, stated, error);
  }
}
