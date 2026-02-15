import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  experimental: {
    scrollRestoration: false,
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      {
        protocol: "https",
        hostname: "img.clerk.com",
      },
      {
        protocol: "https",
        hostname: "api.dicebear.com",
      },
    ],
  },
  async rewrites() {
    return [
      {
        // Proxy frontend /api/mentors to backend /api/mentor/mentors
        source: '/api/mentors',
        destination: `${process.env.BACKEND_URL || process.env.NEXT_PUBLIC_BACKEND_URL}/api/mentor/mentors`,
      },
    ];
  },
};

export default nextConfig;
