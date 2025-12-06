import MenuWrapper from "@/components/MenuWrapper/MenuWrapper";
import React from "react";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <MenuWrapper>{children}</MenuWrapper>;
}
