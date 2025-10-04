import { NextConfig } from "next";

const baseConfig: NextConfig = {
  reactStrictMode: true,
  productionBrowserSourceMaps: true,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**",
      },
    ],
  },
  typescript: {
    // !! WARN !!
    // Dangerously allow production builds to successfully complete even if
    // your project has type errors.
    // !! WARN !!
    ignoreBuildErrors: false,
  },
  eslint: {
    // Warning: This allows production builds to successfully complete even if
    // your project has ESLint errors.
    ignoreDuringBuilds: false,
  },
};

// Optionally wrap with bundle analyzer when ANALYZE=true
let nextConfig: NextConfig = baseConfig;
try {
  if (process.env.ANALYZE === "true") {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const withBundleAnalyzer = require("@next/bundle-analyzer")({
      enabled: true,
    });
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    nextConfig = withBundleAnalyzer(baseConfig as any) as NextConfig;
  }
} catch (e) {
  // If analyzer isn't installed, fall back to base config
  nextConfig = baseConfig;
}

export default nextConfig;
