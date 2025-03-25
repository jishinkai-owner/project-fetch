import { CircularProgress, Alert } from "@mui/material";

export const Loading = () => {
  return <CircularProgress color="primary" />;
};

export const ErrorMessage = () => {
  return <Alert severity="error">Something has gone wrong...</Alert>;
};
