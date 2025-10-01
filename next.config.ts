import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  eslint: {
    // ✅ Ignores ESLint errors/warnings during build
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;
