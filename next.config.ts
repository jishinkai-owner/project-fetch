import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // トップの HTML が CDN/ブラウザに長く残り、旧デザインのまま見えるのを防ぐ
  async headers() {
    return [
      {
        source: "/",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=0, must-revalidate",
          },
        ],
      },
    ];
  },
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
