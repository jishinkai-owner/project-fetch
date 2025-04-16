import { Snackbar, Alert } from "@mui/material";
import { useSnackbar } from "./hook";

type SubmitSnackbarProps = {
  message: string;
  open: boolean;
  handleClose: (event?: React.SyntheticEvent | Event, reason?: string) => void;
  status: "success" | "error";
};

const SubmitSnackbar = ({
  open,
  handleClose,
  message,
  status,
}: SubmitSnackbarProps) => {
  // const { open, message, status, handleClose } = useSnackbar();
  // const { open, handleClose, message, status } = useSnackbar();
  return (
    <Snackbar
      open={open}
      autoHideDuration={5000}
      onClose={handleClose}
      anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
    >
      <Alert onClose={handleClose} severity={status} sx={{ width: "100%" }}>
        {message}
      </Alert>
    </Snackbar>
  );
};

export default SubmitSnackbar;
