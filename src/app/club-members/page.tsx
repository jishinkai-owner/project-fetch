import { Card, CardContent, Typography, Stack } from "@mui/material";
import MainCard from "@/components/main-card";
const UserHomePage = () => {
  const usefulSites = [
    { name: "ヤマップ", url: {} },
    { name: "てんくら", url: {} },
    { name: "他", url: {} },
    { name: "ほかのウェブ", url: {} },
  ];

  return (
    <MainCard>
      <Stack>
        <Typography variant="h2">自親会メンバーページへようこそ!</Typography>
        {usefulSites.map((site) => (
          <Card
            sx={{
              backgroundColor: "background.default",
              m: 1,
            }}
            key={site.name}
          >
            <CardContent key={site.name} sx={{}}>
              <Typography variant="body2">{site.name}</Typography>
            </CardContent>
          </Card>
        ))}
      </Stack>
    </MainCard>
  );
};

export default UserHomePage;
