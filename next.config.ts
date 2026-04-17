import { NextConfig } from "next";

const baseConfig: NextConfig = {
  reactStrictMode: true,
  productionBrowserSourceMaps: false,
  poweredByHeader: false,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**",
      },
    ],
    formats: ["image/avif", "image/webp"],
  },
  typescript: {
    ignoreBuildErrors: false,
  },
};

// Bundle analysis findings (run: npm run analyze)
// Top offenders (client bundle, 2026-04-17):
//   recharts + lodash  394 kB  — already lazy-loaded (ssr:false dynamic import)
//   lucide-react       359 kB  — named imports only, tree-shaken as well as possible
//   Next.js internals  217 kB  — framework overhead, not optimizable
//   yup (removed)      195 kB  — eliminated; replaced with react-hook-form built-in rules
//
// Optionally wrap with bundle analyzer when ANALYZE=true
let nextConfig: NextConfig = baseConfig;
try {
  if (process.env.ANALYZE === "true") {
    // eslint-disable-next-line @typescript-eslint/no-var-requires, @typescript-eslint/no-require-imports
    const withBundleAnalyzer = require("@next/bundle-analyzer")({
      enabled: true,
    });
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    nextConfig = withBundleAnalyzer(baseConfig as any) as NextConfig;
  }
} catch {
  // If analyzer isn't installed, fall back to base config
  nextConfig = baseConfig;
}

const finalConfig = nextConfig;
export default finalConfig;
