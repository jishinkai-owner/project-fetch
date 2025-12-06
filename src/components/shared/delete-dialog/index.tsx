import {
  Dialog,
  DialogActions,
  DialogTitle,
  DialogContent,
  DialogContentText,
  Button,
} from "@mui/material";
import React from "react";

type DeleteDialogProps = {
  open: boolean;
  onDelete?: () => void;
  handleOpen: () => void;
};
const DeleteDialog = ({ open, onDelete, handleOpen }: DeleteDialogProps) => {
  return (
    <Dialog open={open} onClose={() => handleOpen()}>
      <DialogTitle>削除</DialogTitle>
      <DialogContent>
        <DialogContentText>
          削除処理を行いますか？この操作は取り消せません。
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleOpen} color="primary">
          キャンセル
        </Button>
        <Button
          onClick={() => {
            if (onDelete !== undefined) {
              onDelete();
            }
            handleOpen();
          }}
          color="primary"
        >
          削除
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default DeleteDialog;
