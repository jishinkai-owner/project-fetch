import { Card, CardContent, Typography, Stack } from "@mui/material";
import MainCard from "@/components/main-card";
import Link from "next/link";
import Image from "next/image";
import LinkPopup from "@/components/link-popup";

const UserHomePage = () => {
  const usefulSites = [
    { name: "ヤマップ", url: "https://yamap.com/login" },
    { name: "てんくら", url: "https://tenkura.n-kishou.co.jp/tk/" },
    { name: "他", url: {} },
    { name: "ほかのウェブ", url: {} },
  ];

  return (
    <Stack spacing={2}>
      <LinkPopup />
      <MainCard>
        <Stack spacing={2}>
          <Typography
            variant="h2"
            fontWeight={600}
            sx={{
              pb: 2,
              pt: 1,
            }}
          >
            自親会メンバーページへようこそ!
          </Typography>
          {usefulSites.map((site) => (
            <Card
              sx={{
                backgroundColor: "rgba(3, 99, 24, 0.2)",
              }}
              key={site.name}
            >
              <Link
                href={site.url}
                style={{
                  textDecoration: "none",
                  color: "inherit",
                }}
                target="_blank"
                rel="noopener noreferrer"
              >
                <Stack
                  direction={"row"}
                  justifyContent={"space-between"}
                  alignItems={"center"}
                  sx={{
                    padding: 2,
                    "&:hover": {
                      backgroundColor: "action.hover",
                    },
                  }}
                >
                  <Typography variant="body2" fontWeight={"700"}>
                    {site.name}
                  </Typography>
                </Stack>
              </Link>
              {/* <CardContent key={site.name} sx={{}}>
                <Typography variant="body2">{site.name}</Typography>
              </CardContent> */}
            </Card>
          ))}
        </Stack>
      </MainCard>
      <Image
        src="/ogp.png"
        alt="logo"
        width={260}
        height={130}
        priority
        style={{
          margin: "4rem auto",
          padding: 0,
          display: "block",
        }}
      />
    </Stack>
  );
};

export default UserHomePage;
