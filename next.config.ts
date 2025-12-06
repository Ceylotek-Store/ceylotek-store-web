import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**.s3.amazonaws.com', // Allow all S3 buckets (AWS)
      },
      {
        protocol: 'https',
        hostname: '**.s3.us-east-1.amazonaws.com', // Specific region fallback
      },
      {
        protocol: 'http',
        hostname: '192.168.56.20', // Allow Vagrant Backend
      },
      {
        protocol: 'http',
        hostname: 'localhost',
      },
    ],
  },
};

export default nextConfig;
