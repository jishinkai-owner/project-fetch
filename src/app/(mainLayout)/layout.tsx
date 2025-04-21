import MenuWrapper from "@/components/MenuWrapper/MenuWrapper";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <MenuWrapper>
      {children}
    </MenuWrapper>
  );
}
