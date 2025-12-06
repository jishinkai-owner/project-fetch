import { Typography, Button } from "@mui/material";
import { ReactNode } from "react";
import React from "react";

type FloatingButtonProps = {
  onClick: () => void;
  children: ReactNode;
};

export const FloatingButton = ({ onClick, children }: FloatingButtonProps) => {
  return (
    <Button
      variant="contained"
      color="secondary"
      onClick={onClick}
      sx={{
        height: "2rem",
      }}
    >
      <Typography variant="caption">{children}</Typography>
    </Button>
  );
};
