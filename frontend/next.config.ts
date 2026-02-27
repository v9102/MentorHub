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
      {
        protocol: "https",
        hostname: "lh3.googleusercontent.com",
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
      {
        // Proxy frontend /api/mentors/:id to backend /api/mentor/:id
        source: '/api/mentors/:mentorId',
        destination: `${process.env.BACKEND_URL || process.env.NEXT_PUBLIC_BACKEND_URL}/api/mentor/:mentorId`,
      },
      // Note: /api/booking is handled by frontend API route (src/app/api/booking/route.ts)
      // which forwards to backend with proper auth handling
    ];
  },
};

export default nextConfig;
