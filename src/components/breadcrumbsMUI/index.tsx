"use client";

import { Typography, Link, Box, Breadcrumbs } from "@mui/material";
import { usePathname } from "next/navigation";
import React from "react";

type breadcrumbItemProps = {
  items: { [key: string]: string };
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

const BreadcrumbsComp = ({ items }: breadcrumbItemProps) => {
  const path = usePathname();
  const pathnames = path
    .split("/")
    .filter((x) => x)
    .slice(0, 2);

  return (
    <Box component="nav" sx={{ ml: 2, mb: 2 }}>
      <Breadcrumbs separator=" / ">
        {pathnames.map((pathname, index) => {
          const href = "/" + pathnames.slice(0, index + 1).join("/");
          const breadcrumbLabel = items[href] || pathnames;
          return (
            <Link underline="hover" key={pathname} href={href}>
              <Typography variant="body2">{breadcrumbLabel}</Typography>
            </Link>
          );
        })}
      </Breadcrumbs>
    </Box>
  );
};

export default BreadcrumbsComp;
