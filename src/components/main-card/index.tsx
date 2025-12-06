import Grid from "@mui/material/Grid2";
import { Card } from "@mui/material";
import { ReactNode } from "react";
import React from "react";

type MainCardProps = {
  children: ReactNode;
  minHeight?: number;
};

const MainCard = ({ children, minHeight }: MainCardProps) => {
  return (
    <Grid
      container
      spacing={0}
      direction="column"
      sx={{
        alignItems: "center",
        width: "100%",
      }}
    >
      <Card
        sx={{
          width: "100%",
          minHeight: minHeight || 0,
          pt: 3,
          pb: 3,
          pl: { md: 5, sm: 2, xs: 2 },
          pr: { md: 5, sm: 2, xs: 2 },
          mb: 2,
        }}
      >
        {children}
      </Card>
    </Grid>
  );
};

export default MainCard;
