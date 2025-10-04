import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  experimental: {
    optimizeCss: false, // disable lightningcss, use postcss instead
  },
};

export default nextConfig;
