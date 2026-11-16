import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  basePath:"/mea",
  crossOrigin:"anonymous",
  // Set by `npm run dev:phone` so a phone on the LAN can load dev resources.
  allowedDevOrigins: process.env.DEV_ORIGIN ? [process.env.DEV_ORIGIN] : [],
  images: {
    unoptimized: true
  }
};

export default nextConfig;
