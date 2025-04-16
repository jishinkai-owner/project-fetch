import { Box, CircularProgress, Alert } from "@mui/material";

export const Loading = () => {
  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <CircularProgress color="primary" />
    </Box>
  );
};

export const ErrorMessage = () => {
  return <Alert severity="error">Something has gone wrong...</Alert>;
};
