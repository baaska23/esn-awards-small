import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  basePath:"/mea",
  crossOrigin:"anonymous",
  images: {
    unoptimized: true
  }
};

export default nextConfig;
