import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  experimental: {},
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    domains: ["loremflickr.com", "picsum.photos"],
  },
};

export default nextConfig;
