/**
 * Network reads for scripts/check-project-claims.mjs: files and trees of a
 * GitHub repository pinned to its current HEAD SHA, and plain pages.
 */

const TIMEOUT_MS = 20_000;

const GH_HEADERS = {
  Accept: "application/vnd.github+json",
  "User-Agent": "portfolio-claim-check",
  // Present in Actions; absent locally, where the unauthenticated limit of 60
  // requests an hour is far more than this needs.
  ...(process.env.GITHUB_TOKEN
    ? { Authorization: `Bearer ${process.env.GITHUB_TOKEN}` }
    : {}),
};

/** Resolved once per repo per run — the SHA cannot change mid-run. */
const shaCache = new Map();

async function request(url, headers = GH_HEADERS) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);
  try {
    const res = await fetch(url, { signal: controller.signal, headers });
    if (!res.ok) throw new Error(`HTTP ${res.status} for ${url}`);
    return res;
  } finally {
    clearTimeout(timer);
  }
}

/** The resolved default-branch SHA for a repo, cached for the run. */
async function headSha(repo) {
  let sha = shaCache.get(repo);
  if (sha === undefined) {
    const res = await request(
      `https://api.github.com/repos/${repo}/commits/HEAD`
    );
    sha = (await res.json()).sha;
    shaCache.set(repo, sha);
  }
  return sha;
}

/**
 * Fetch a file at the CURRENT COMMIT of a repo's default branch.
 *
 * WHY NOT JUST raw.githubusercontent.com/<repo>/main/<path>.
 *
 * That URL is mutable — its content changes as `main` moves — so the CDN in
 * front of it serves stale objects for minutes after a push. This check would
 * then report a FALSE FAILURE in precisely the window that matters most: the
 * minutes after a merge, when someone is watching.
 *
 * That is not theoretical. Three consecutive runs against the same unchanged
 * file disagreed — two saw the new content, one saw the pre-merge version.
 * Cache-busting query parameters did not help; the CDN normalises them away.
 *
 * A flaky checker is worse than no checker: it wastes the investigation it
 * triggers, and it teaches everyone to disregard the next alert.
 *
 * Resolving the branch to a SHA first and fetching THAT makes the URL
 * immutable, so caching becomes correct instead of harmful — a cached response
 * for a SHA-pinned path is by definition the right content.
 */
export async function fetchAtHead(repo, path) {
  const sha = await headSha(repo);
  const res = await request(
    `https://raw.githubusercontent.com/${repo}/${sha}/${path}`,
    { "User-Agent": "portfolio-claim-check" }
  );
  return res.text();
}

/**
 * Every blob path in a repo at its current HEAD.
 *
 * Some claims are about how many FILES exist — "17 API routes", "50 tests
 * across the suite" — and no single upstream file states them. Without this
 * the only options were to leave those numbers unchecked or to invent a file
 * that restates them, and a number restated upstream to satisfy a checker is
 * not evidence of anything.
 *
 * Pinned to a SHA for the same reason fetchAtHead is: the mutable ref is
 * CDN-cached and disagrees with itself for minutes after a push.
 */
export async function fetchTree(repo) {
  const sha = await headSha(repo);
  const res = await request(
    `https://api.github.com/repos/${repo}/git/trees/${sha}?recursive=1`
  );
  const body = await res.json();
  if (body.truncated) {
    throw new Error(`tree for ${repo} was truncated by the API`);
  }
  return body.tree.filter((node) => node.type === "blob").map((n) => n.path);
}

/** A plain page, for claims whose source is not a GitHub repository. */
export async function fetchPage(url) {
  const res = await request(url, {
    "User-Agent":
      "Mozilla/5.0 (compatible; portfolio-claim-check; +https://shaileshchaudhari.vercel.app)",
    Accept: "text/html",
  });
  return res.text();
}
