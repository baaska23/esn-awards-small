import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  basePath:"/esport",
  crossOrigin:"anonymous",
  images: {
    unoptimized: true
  }
};

export default nextConfig;
