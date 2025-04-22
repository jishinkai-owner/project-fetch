import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    template: "%s - 自然に親しむ会",
    default: "自然に親しむ会",
  },
  description: "自然に親しむ会の活動記録をまとめたサイトです。",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      <body >
        {children}
      </body>
    </html>
  );
}
