import {
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Typography,
  Stack,
} from "@mui/material";
import { useRouter, usePathname } from "next/navigation";
import Image from "next/image";

const drawerItem: { title: string; route: string }[] = [
  { title: "記録を記入する", route: "/club-members/records" },
  { title: "天気図", route: "/club-members/weather-chart" },
  { title: "山行の反省", route: "/club-members/post-hike" },
  { title: "山行の登録", route: "/club-members/register-hikes" },
];

const DrawerContent = () => {
  const router = useRouter();
  const path = usePathname();
  return (
    <Stack direction="column">
      <Stack
        onClick={() => {
          router.push("/club-members");
        }}
        direction="row"
        justifyContent="center"
      >
        <Image
          src="/jishinkaiboard.svg"
          alt="logo"
          width={200}
          height={100}
          priority
        />
      </Stack>
      <List>
        {drawerItem.map((item, index) => (
          <ListItem key={index} disablePadding>
            <ListItemButton
              selected={path === item.route}
              sx={{
                pl: 3,
              }}
              onClick={() => {
                router.push(item.route);
              }}
            >
              <ListItemText
                disableTypography
                primary={
                  <Typography
                    variant="body1"
                    color="textPrimary"
                    align="justify"
                  >
                    {item.title}
                  </Typography>
                }
              />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Stack>
  );
};

export default DrawerContent;
