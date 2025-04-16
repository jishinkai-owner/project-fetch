import { ReactNode } from "react";
import { AppRouterCacheProvider } from "@mui/material-nextjs/v15-appRouter";
import Theming from "@/providers/theme";
import MainLayout from "./index";
import { UserContextProvider } from "@/providers/user";

type MembersPageLayoutProps = {
  children: ReactNode;
};

export default function MembersPageLayout({
  children,
}: MembersPageLayoutProps) {
  return (
    <AppRouterCacheProvider>
      <UserContextProvider>
        <Theming>
          <MainLayout>{children}</MainLayout>
        </Theming>
      </UserContextProvider>
    </AppRouterCacheProvider>
  );
}
