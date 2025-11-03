import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  eslint: {
    // ✅ This tells Vercel and Next.js not to block the build on lint warnings
    ignoreDuringBuilds: true,
  },
  webpack: (config) => {
    // ✅ This ensures your `@/lib/...` imports resolve correctly
    config.resolve.alias = {
      ...config.resolve.alias,
      "@": "./",
    };
    return config;
  },
};

export default nextConfig;

