import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // 1. Enables Docker to create a tiny, efficient production image
  output: "standalone", 

  reactStrictMode: true,

  images: {
    remotePatterns: [
      // --- AWS S3 (For Production) ---
      {
        protocol: 'https',
        hostname: '**.s3.amazonaws.com',
      },
      
      // --- Local Development (Docker Port Forwarding) ---
      // This allows Next.js to optimize images served from http://localhost:5000
      {
        protocol: 'http',
        hostname: 'localhost',
      },
      
      // --- Internal Docker Network (Optional but Recommended) ---
      // If server-side Next.js tries to fetch an image directly from the container
      {
        protocol: 'http',
        hostname: 'ceylotek-api',
      }
    ],
  },
};

export default nextConfig;