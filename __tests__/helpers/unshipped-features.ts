// Features in sibling repos that this site must not advertise until they are live (todos HON-01).
// When one is live, the guard fails: delete its entry and restore the claim.
export interface UnshippedFeature {
  /** Project id in constants/projects.ts; scopes the search to that project. */
  project: string;
  feature: string;
  /** Sibling checkout next to this repo. */
  repo: string;
  /** The deploy the feature depends on; its JSON carries the served commit at `shaPath`. */
  deployed: { url: string; shaPath: string[] };
  /** Paths whose absence from the deployed commit is the evidence the feature is not live. */
  absentFromDeployed: string[];
  patterns: RegExp[];
  /** Text this site carried before commit 13df30b; every pattern must match one. */
  formerClaims: string[];
}

// EduScale matchmaking left this list 2026-10-19: its files are in the live API (f339236). The claim
// stays off the site until the feature is verified working live (Vercel functions hold no socket).
export const UNSHIPPED_FEATURES: UnshippedFeature[] = [];
