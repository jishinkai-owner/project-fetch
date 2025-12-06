import type { Metadata } from "next";
import "./globals.css";
import React from "react";

export const metadata: Metadata = {
  title: {
    template: "%s - 自然に親しむ会",
    default: "自然に親しむ会",
  },
  description: "自然に親しむ会の活動記録をまとめたサイトです。",
  icons: {
    icon: [{ url: "/favicon2.webp", type: "image/webp" }],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      <body>{children}</body>
    </html>
  );
}
