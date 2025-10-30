import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'img.naukimg.com',
        pathname: '/logo_images/**',
      },
    ],
  },
};

export default nextConfig;
