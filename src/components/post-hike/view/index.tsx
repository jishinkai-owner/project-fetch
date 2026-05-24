"use client";

import { useRouter } from "next/navigation";
import MainCard from "@/components/main-card";
import {
  Typography,
  Stack,
  List,
  ListItem,
  ListItemText,
  Button,
  ListItemAvatar,
} from "@mui/material";
import LocalDiningIcon from "@mui/icons-material/LocalDining";
import HomeRepairServiceIcon from "@mui/icons-material/HomeRepairService";
import WbSunnyIcon from "@mui/icons-material/WbSunny";
import SnowboardingIcon from "@mui/icons-material/Snowboarding";
import { usePostPostHikesWithRecordId } from "../hook";
import { ErrorMessage, Loading } from "@/components/load-status";
import NamedEntriesDisplay from "../named-entries-display";
import React from "react";

type PostHikeViewCompProps = {
  recordId: number;
};
const PostHikeViewComp = ({ recordId }: PostHikeViewCompProps) => {
  const { postHikes, isLoading, isError } =
    usePostPostHikesWithRecordId(recordId);

  const router = useRouter();

  if (isLoading) {
    return <Loading />;
  }

  if (isError || !postHikes) {
    return <ErrorMessage />;
  }

  return (
    <>
      <Button
        variant="text"
        onClick={() => router.back()}
        color="primary"
        sx={{
          mb: 0,
        }}
      >
        &lt; 戻る
      </Button>
      <MainCard>
        <Typography variant="h3">
          {postHikes.place} - {postHikes.date}/{postHikes.year}
        </Typography>
        {postHikes.postHikeContents.map((e) => (
          <Stack spacing={1} key={e.clId}>
            <Typography
              variant="body1"
              sx={{
                fontWeight: "bold",
                textDecoration: "underline",
                pt: 2,
              }}
            >
              TEAM {e.clName}
            </Typography>
            <Typography
              variant="body2"
              sx={{
                fontWeight: "bold",
              }}
            >
              係の反省
            </Typography>
            <List disablePadding dense>
              <ListItem disablePadding>
                <ListItemAvatar>
                  <LocalDiningIcon />
                </ListItemAvatar>
                <ListItemText
                  primary="食事係"
                  secondary={
                    <>
                      <NamedEntriesDisplay
                        text={e.roleComments.meal}
                        role="食事係"
                      />
                      <Typography variant="body2" sx={{ mt: 1, fontWeight: "bold" }}>
                        CLからのコメント
                      </Typography>
                      <NamedEntriesDisplay
                        text={e.clComments.meal}
                        role="食事係"
                        showRoleHeading={false}
                        emptyLabel="なし"
                      />
                    </>
                  }
                />
              </ListItem>
              <ListItem disablePadding>
                <ListItemAvatar>
                  <HomeRepairServiceIcon />
                </ListItemAvatar>
                <ListItemText
                  primary="装備係"
                  secondary={
                    <>
                      <NamedEntriesDisplay
                        text={e.roleComments.equipment}
                        role="装備係"
                      />
                      <Typography variant="body2" sx={{ mt: 1, fontWeight: "bold" }}>
                        CLからのコメント
                      </Typography>
                      <NamedEntriesDisplay
                        text={e.clComments.equipment}
                        role="装備係"
                        showRoleHeading={false}
                        emptyLabel="なし"
                      />
                    </>
                  }
                />
              </ListItem>
              <ListItem disablePadding>
                <ListItemAvatar>
                  <WbSunnyIcon />
                </ListItemAvatar>
                <ListItemText
                  primary="天気図係"
                  secondary={
                    <>
                      <NamedEntriesDisplay
                        text={e.roleComments.weather}
                        role="天気図係"
                      />
                      <Typography variant="body2" sx={{ mt: 1, fontWeight: "bold" }}>
                        CLからのコメント
                      </Typography>
                      <NamedEntriesDisplay
                        text={e.clComments.weather}
                        role="天気図係"
                        showRoleHeading={false}
                        emptyLabel="なし"
                      />
                    </>
                  }
                />
              </ListItem>
              <ListItem disablePadding>
                <ListItemAvatar>
                  <SnowboardingIcon />
                </ListItemAvatar>
                <ListItemText
                  primary="SL"
                  secondary={
                    <>
                      <NamedEntriesDisplay text={e.roleComments.sl} role="SL" />
                      <Typography variant="body2" sx={{ mt: 1, fontWeight: "bold" }}>
                        CLからのコメント
                      </Typography>
                      <NamedEntriesDisplay
                        text={e.clComments.sl}
                        role="SL"
                        showRoleHeading={false}
                        emptyLabel="なし"
                      />
                    </>
                  }
                />
              </ListItem>
            </List>

            <Typography
              variant="body2"
              sx={{
                fontWeight: "bold",
              }}
            >
              感想
            </Typography>
            <Typography variant="body2" sx={{ whiteSpace: "pre-line" }}>
              {e.impression.reduce((acc: string, cur: string) => {
                return acc + cur + "\n";
              }, "")}
            </Typography>
          </Stack>
        ))}
      </MainCard>
    </>
  );
};

export default PostHikeViewComp;
