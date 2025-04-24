import { ReactNode } from "react";
import { Box } from "@mui/material";
import MenuDrawer from "@/components/drawer";
import BreadcrumbsComp from "@/components/breadcrumbsMUI";

type MainLayoutProps = {
  children: ReactNode;
};

interface pathMap {
  [key: string]: string;
}
const pathMap: pathMap = {
  "/club-members": "ホーム",
  "/club-members/records": "記録を記入する",
  "/club-members/weather-chart": "気象通報",
  "/club-members/post-hikes": "山行の反省",
  "/club-members/register-hikes": "山行の登録",
  "/club-members/record": "記録を編集",
};

const MainLayout = ({ children }: MainLayoutProps) => {
  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        overflow: "hidden",
        overflowY: "scroll",
        height: "100vh",
      }}
    >
      <MenuDrawer />
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          ml: { md: 5, sm: 2, xs: 1 },
          mr: { md: 5, sm: 2, xs: 1 },
          mt: 10,
          mb: 10,
        }}
      >
        <BreadcrumbsComp items={pathMap} />
        {children}
      </Box>
    </Box>
  );
};

export default MainLayout;
