import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  basePath:"/mongolian-esports-awards",
  crossOrigin:"anonymous",
  images: {
    unoptimized: true
  }
};

export default nextConfig;
