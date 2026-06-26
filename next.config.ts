import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: 'http://44.194.104.133/api/:path*'
      }
    ];
  }
};

export default nextConfig;
