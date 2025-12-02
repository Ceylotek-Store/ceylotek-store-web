import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactCompiler: true, 
  experimental: {
    turbopackFileSystemCacheForDev: true, 
  },
  images: {
    remotePatterns: [
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '5000', // Allows images from your backend port
        pathname: '/uploads/**', // Matches your backend image path structure
      },
    ],
  },
};

export default nextConfig;
