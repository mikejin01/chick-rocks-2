import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  typescript: { ignoreBuildErrors: true },
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "chickrocksusa.com" },
      { protocol: "https", hostname: "chickrocksus.com" },
    ],
  },
};

export default nextConfig;
