"use client";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
} from "@mui/material";
import { useEffect, useState } from "react";

import { checkLinked } from "@/utils/discord/checkLinked";
import { linkDiscord } from "@/app/actions";
import { getDiscordInfo } from "@/app/actions";

const LinkPopup = () => {
  const [open, setOpen] = useState(false);
  const [isLinked, setIsLinked] = useState(false);

  useEffect(() => {
    const checkIfLinked = async () => {
      try {
        const linked = await checkLinked();
        setIsLinked(linked);
        setOpen(!linked);
      } catch (error) {
        console.error("Error checking linked status: ", error);
      }
    };
    checkIfLinked();
  }, []);

  useEffect(() => {
    const fetchDiscordInfo = async () => {
      try {
        const discordInfo = await getDiscordInfo();
        console.log("Discord Info: ", discordInfo?.userIdentity);
      } catch (error) {
        console.error("Error fetching Discord info: ", error);
      }
    };
    fetchDiscordInfo();
  }, []);

  if (isLinked) {
    return null;
  }
  return (
    <Dialog
      open={open}
      onClose={() => {}}
      aria-labelledby="link-popup-title"
      aria-describedby="link-popup-description"
    >
      <DialogTitle id="link-popup-title">
        Discordのアカウントと連携してください
      </DialogTitle>
      <DialogContent>
        係・役職を登録するためには、Discordのアカウントと連携する必要があります。
        <br />
        連携するには、以下のボタンをクリックしてください。
        <br />
      </DialogContent>
      <DialogActions>
        <Button onClick={() => linkDiscord()}>連携する</Button>
      </DialogActions>
    </Dialog>
  );
};

export default LinkPopup;
