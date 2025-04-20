"use client";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
} from "@mui/material";

import { linkDiscord } from "@/app/actions";
import { useLinked } from "./hook";
import { useUserContext } from "@/providers/user";

const LinkPopup = () => {
  const { contextValue } = useUserContext();
  const { open } = useLinked(
    contextValue.userId,
    contextValue.grade,
    contextValue.Role,
    contextValue.isLoading,
    contextValue.isError
  );

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
