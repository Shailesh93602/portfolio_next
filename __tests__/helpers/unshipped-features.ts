// Local-only features in sibling repos that this site must not advertise (todos HON-01).
// When one ships to `ref`, the guard fails: delete its entry and restore the claim.
export interface UnshippedFeature {
  /** Project id in constants/projects.ts; scopes the search to that project. */
  project: string;
  feature: string;
  /** Sibling checkout next to this repo, and the ref that counts as shipped. */
  repo: string;
  ref: string;
  /** Paths whose absence on `ref` is the evidence the feature is unshipped. */
  absentOnMain: string[];
  patterns: RegExp[];
  /** Text this site carried before commit 13df30b; every pattern must match one. */
  formerClaims: string[];
}

export const UNSHIPPED_FEATURES: UnshippedFeature[] = [
  {
    project: "khatago",
    feature: "MCP server (@khatago/mcp)",
    repo: "KhataGO",
    ref: "origin/main",
    absentOnMain: ["mcp-server/server.ts"],
    patterns: [/@khatago\/mcp/i, /Model Context Protocol/i, /\bMCP\b/],
    formerClaims: [
      "Native Model Context Protocol (MCP) Server (@khatago/mcp) with stdio JSON-RPC 2.0 tools",
    ],
  },
  {
    project: "khatago",
    feature: "Transaction voiding and #undo",
    repo: "KhataGO",
    ref: "origin/main",
    absentOnMain: ["app/api/transactions/[id]/void/route.ts"],
    patterns: [/#undo/i, /\/void\b/i, /\bvoiding\b/i],
    formerClaims: [
      "Offline #undo and voiding escape hatch (POST /api/transactions/[id]/void)",
    ],
  },
  {
    project: "eduscale",
    feature: "Matchmaking frontend (radar HUD, instant battle)",
    repo: "EduScale",
    ref: "origin2/main",
    absentOnMain: [
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
