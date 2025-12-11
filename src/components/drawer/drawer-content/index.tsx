"use client";
import {
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Typography,
  Stack,
} from "@mui/material";
import { usePathname } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import React from "react";

const drawerItem: { title: string; route: string }[] = [
  { title: "記録を記入する", route: "/club-members/records" },
  { title: "天気図", route: "" },
  { title: "山行の反省", route: "/club-members/post-hikes" },
  { title: "山行の登録", route: "/club-members/register-hikes" },
];

const DrawerContent = () => {
  const path = usePathname();
  return (
    <Stack direction="column">
      <Stack direction="row" justifyContent="center">
        <Link href="/club-members">
          <Image
            src="/jishinkaiboard.svg"
            alt="logo"
            width={200}
            height={100}
            priority
          />
        </Link>
      </Stack>
      <List>
        {drawerItem.map((item, index) => (
          <Link href={item.route} key={index}>
            <ListItem key={index} disablePadding>
              <ListItemButton
                selected={path === item.route}
                sx={{
                  pl: 3,
                }}
              >
                <ListItemText
                  disableTypography
                  primary={
                    <Typography
                      variant="body1"
                      color="textPrimary"
                      align="justify"
                      fontWeight={600}
                    >
                      {item.title}
                    </Typography>
                  }
                />
              </ListItemButton>
            </ListItem>
          </Link>
        ))}
      </List>
    </Stack>
  );
};

export default DrawerContent;
