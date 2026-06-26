import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  trailingSlash: true,
  async rewrites() {
    return [
      {
        source: '/api/:path*/',
        destination: 'http://44.194.104.133/api/:path*/'
      },
      {
        source: '/api/:path*',
        destination: 'http://44.194.104.133/api/:path*/'
      }
    ];
  }
};

export default nextConfig;
