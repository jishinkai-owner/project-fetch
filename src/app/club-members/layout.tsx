import { ReactNode } from "react";
import { AppRouterCacheProvider } from "@mui/material-nextjs/v15-appRouter";
import Theming from "@/providers/theme";
import MainLayout from "./index";
import React from "react";

type MembersPageLayoutProps = {
  children: ReactNode;
};

export default function MembersPageLayout({
  children,
}: MembersPageLayoutProps) {
  return (
    <AppRouterCacheProvider>
      <Theming>
        <MainLayout>{children}</MainLayout>
      </Theming>
    </AppRouterCacheProvider>
  );
}
