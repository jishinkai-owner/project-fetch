import { SyntheticEvent } from "react";
import { useState } from "react";

export const useSnackbar = () => {
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState<"success" | "error">("success");

  const handleClose = (event?: SyntheticEvent | Event, reason?: string) => {
    if (reason === "clickaway") {
      return;
    }
    setOpen(false);
  };

  const handleOpen = (message: string) => {
    setOpen(true);
    setMessage(message);
  };

  const handleSuccess = (message: string) => {
    setMessage(message);
    setOpen(true);
    setStatus("success");
  };

  const handleError = (message: string) => {
    setMessage(message);
    setOpen(true);
    setStatus("error");
  };

  return {
    open,
    setOpen,
    message,
    setMessage,
    handleClose,
    // handleSuccess,
    // handleError,
    status,
    setStatus,
  };
};
