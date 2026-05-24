import { Typography, Box } from "@mui/material";
import React from "react";
import { parseNamedEntries } from "../role-entries";

type NamedEntriesDisplayProps = {
  text: string | null;
  role: string;
  showRoleHeading?: boolean;
  emptyLabel?: string;
};

const NamedEntriesDisplay = ({
  text,
  role,
  showRoleHeading = true,
  emptyLabel,
}: NamedEntriesDisplayProps) => {
  const entries = parseNamedEntries(text);

  if (entries.length === 0) {
    return (
      <Typography variant="body2" color="text.secondary">
        {emptyLabel ?? (showRoleHeading ? `${role}の反省がありません` : "なし")}
      </Typography>
    );
  }

  return (
    <Box sx={{ pt: showRoleHeading ? 1 : 0 }}>
      {showRoleHeading && (
        <Typography
          variant="body2"
          sx={{ fontWeight: "bold", textDecoration: "underline", mb: 1 }}
        >
          {role}の反省
        </Typography>
      )}
      {entries.map((entry) => (
        <Typography
          key={entry.name || entry.body.slice(0, 20)}
          variant="body2"
          component="div"
          sx={{ mb: 1.5, whiteSpace: "pre-line" }}
        >
          {entry.name ? (
            <>
              <Typography component="span" fontWeight="bold">
                {entry.name}
              </Typography>
              {"\n"}
              {entry.body}
            </>
          ) : (
            entry.body
          )}
        </Typography>
      ))}
    </Box>
  );
};

export default NamedEntriesDisplay;
