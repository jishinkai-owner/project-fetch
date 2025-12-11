import AddPhotoAlternateIcon from "@mui/icons-material/AddPhotoAlternate";
import {
  TextField,
  Button,
  Dialog,
  DialogContent,
  DialogContentText,
  DialogTitle,
  DialogActions,
} from "@mui/material";
import { Editor } from "@tiptap/react";
import { useEffect, useCallback } from "react";
import { useImage } from "@/components/tiptap/hook";
import React from "react";

type InsertImageProps = {
  editor: Editor;
};

const InsertImage = ({ editor }: InsertImageProps) => {
  const { url, setUrl, open, handleOpen } = useImage();

  useEffect(() => {
    setUrl("");
  }, [open, setUrl]);

  const addImage = useCallback(
    (url: string) => {
      if (url) {
        editor.commands.insertContent(url);
      }
    },
    [editor],
  );

  return (
    <>
      <Button variant="outlined" onClick={handleOpen}>
        <AddPhotoAlternateIcon />
      </Button>
      <Dialog
        open={open}
        onClose={handleOpen}
        slotProps={{
          paper: {
            component: "form",
            onSubmit: () => {
              handleOpen();
            },
          },
        }}
      >
        <DialogTitle>画像を挿入</DialogTitle>
        <DialogContent>
          <DialogContentText>
            FlickrのEmbedリンクを入力してね!
          </DialogContentText>
          <TextField
            id="image-link"
            label="画像リンク"
            type="url"
            sx={{
              mt: 2,
            }}
            onChange={(e) => setUrl(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleOpen}>キャンセル</Button>
          <Button
            type="button"
            onClick={() => {
              addImage(url);
              handleOpen();
            }}
            disabled={url === ""}
          >
            挿入
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default InsertImage;
