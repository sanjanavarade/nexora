import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Your existing config options…

  webpack: (config) => {
    // Add 'node:crypto' as an external CommonJS module.
    config.externals = config.externals || [];
    config.externals.push({
      'node:crypto': 'commonjs crypto',
    });
    return config;
  },
};

export default nextConfig;
