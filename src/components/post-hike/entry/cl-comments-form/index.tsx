import { Stack } from "@mui/material";
import { ChangeEvent } from "react";
import React from "react";
import EntryTextField from "../entry-textfield";
import RetrospectiveText from "../retrospective-text";
import {
  CL_COMMENT_SECTIONS,
  PostHikeContentProps,
} from "../entry-types";

type ClCommentsFormProps = {
  entries: PostHikeContentProps;
  setEntries: React.Dispatch<React.SetStateAction<PostHikeContentProps>>;
};

const ClCommentsForm = ({ entries, setEntries }: ClCommentsFormProps) => {
  return (
    <Stack spacing={2}>
      {CL_COMMENT_SECTIONS.map(
        ({ role, reflectionKey, commentKey, label }) => (
          <Stack key={commentKey} spacing={1}>
            <RetrospectiveText
              text={entries[reflectionKey]}
              role={role}
            />
            <EntryTextField
              id={`comment-${commentKey}`}
              label={label}
              value={entries[commentKey] ?? ""}
              handleChange={(e: ChangeEvent<HTMLInputElement>) =>
                setEntries((prev) => ({
                  ...prev,
                  [commentKey]: e.target.value,
                }))
              }
            />
          </Stack>
        ),
      )}
    </Stack>
  );
};

export default ClCommentsForm;
