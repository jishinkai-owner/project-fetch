import { Typography } from "@mui/material";
import React from "react";
type RetrospectiveTextProps = {
  text: string | null;
  role: string;
};
const RetrospectiveText = ({ text, role }: RetrospectiveTextProps) => {
  return (
    <>
      {text ? (
        <Typography variant="body2">
          <Typography
            component={"span"}
            variant="body2"
            sx={{
              fontWeight: "bold",
              textDecoration: "underline",
            }}
          >
            {role}の反省
          </Typography>
          : {text}
        </Typography>
      ) : (
        <Typography variant="body2" sx={{ fontWeight: "bold", pt: 2 }}>
          {role}の反省がありません
        </Typography>
      )}
    </>
  );
};

export default RetrospectiveText;
