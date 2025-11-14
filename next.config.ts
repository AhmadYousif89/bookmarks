import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: { remotePatterns: [new URL("https://res.cloudinary.com/jo89/**")] },
  experimental: {
    serverActions: { bodySizeLimit: "5mb" },
  },
  cacheComponents: true,
  turbopack: {
    rules: {
      "*.svg": {
        loaders: ["@svgr/webpack"],
        as: "*.js",
      },
    },
  },
  webpack: (config) => {
    config.module.rules.push({
      test: /\.svg$/,
      use: ["@svgr/webpack"],
    });
    return config;
  },
};

export default nextConfig;
