import type { Config } from "jest";
import nextJest from "next/jest.js";

const createJestConfig = nextJest({ dir: "./" });

const config: Config = {
  coverageProvider: "v8",
  testEnvironment: "jsdom",
  setupFilesAfterEnv: ["<rootDir>/jest.setup.ts"],
  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/$1",
  },
  testMatch: ["**/__tests__/**/*.test.ts?(x)"],
  collectCoverageFrom: [
    "lib/**/*.ts",
    "app/api/**/*.ts",
    "components/**/*.tsx",
    "!**/*.d.ts",
    "!**/node_modules/**",
    // shadcn/ui generated wrappers — Radix UI primitives, not business logic
    "!components/ui/**",
    // Third-party provider wrappers and client-only analytics stubs
    "!components/theme-provider.tsx",
    "!components/speed-insights-client.tsx",
    // Recharts-based charts (dynamic imports, ssr:false) — tested via E2E
    "!components/stats-charts.tsx",
    "!components/github-contribution-heatmap.tsx",
    // Tailwind CSS plugin — not testable in jsdom
    "!lib/blog-typography.ts",
  ],
  coverageThreshold: {
    global: { branches: 60, functions: 70, lines: 70, statements: 70 },
  },
};

export default createJestConfig(config);
