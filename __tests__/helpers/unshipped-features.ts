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

export const UNSHIPPED_FEATURES: UnshippedFeature[] = [
  {
    project: "eduscale",
    feature: "Matchmaking frontend (radar HUD, instant battle)",
    repo: "EduScale",
    // The UI is live on eduscale.vercel.app but needs the API, whose deploy still serves f87d81a.
    deployed: {
      url: "https://api-eduscale.vercel.app/api/v1/health",
      shaPath: ["version", "sha"],
    },
    absentFromDeployed: [
      "Frontend/src/hooks/useMatchmaking.ts",
      "Frontend/src/components/Battle/MatchmakingRadar.tsx",
    ],
    patterns: [
      /radar/i,
      /3-second match confirmations/i,
      /Instant (Battle )?Matchmaking/i,
    ],
    formerClaims: [
      "Instant Battle Matchmaking: Automated skill-based queue with expanding Elo bands, live radar HUD, and 3-second match confirmations.",
    ],
  },
];
