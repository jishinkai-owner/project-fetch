import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "gfcvqixevbidquwttgow.supabase.co",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "live.staticflickr.com",
        port: "",
        pathname: "/**",
      },
    ],
  },
  experimental: {
    authInterrupts: true,
  },
};

export default nextConfig;
