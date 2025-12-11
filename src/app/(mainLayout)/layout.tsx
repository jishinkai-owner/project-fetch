import MenuWrapper from "@/components/MenuWrapper/MenuWrapper";
import { ScrollToTop } from "@/components/ScrollToTop";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <MenuWrapper>
      {children}
      <ScrollToTop />
    </MenuWrapper>
  );
}
