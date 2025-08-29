import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */

  eslint: {
    // ✅ Don’t block production builds on ESLint errors
    ignoreDuringBuilds: true,
  },

 
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'utfs.io',
        port: '',
      },
    ],
  },
};

export default nextConfig;
