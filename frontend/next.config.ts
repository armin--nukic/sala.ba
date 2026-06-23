import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com"
      },
      {
        protocol: "http",
        hostname: "localhost",
        port: "4111"
      },
      {
        protocol: "http",
        hostname: "127.0.0.1",
        port: "4111"
      }
    ]
  }
};

export default nextConfig;
