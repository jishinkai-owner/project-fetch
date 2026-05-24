import { Stack } from "@mui/material";
import { ChangeEvent, useEffect, useState } from "react";
import React from "react";
import EntryTextField from "../entry-textfield";
import NamedEntriesDisplay from "../../named-entries-display";
import { getNamedEntryBody } from "../../role-entries";
import {
  CL_COMMENT_SECTIONS,
  ClCommentDrafts,
  PostHikeContentProps,
} from "../entry-types";

type ClCommentsFormProps = {
  entries: PostHikeContentProps;
  authorName: string;
  setCommentDrafts: React.Dispatch<React.SetStateAction<ClCommentDrafts>>;
};

const emptyDrafts = (): ClCommentDrafts => ({
  meal: "",
  equipment: "",
  weather: "",
  sl: "",
});

const ClCommentsForm = ({
  entries,
  authorName,
  setCommentDrafts,
}: ClCommentsFormProps) => {
  const [drafts, setDrafts] = useState<ClCommentDrafts>(emptyDrafts);

  useEffect(() => {
    if (!authorName.trim()) {
      const empty = emptyDrafts();
      setDrafts(empty);
      setCommentDrafts(empty);
      return;
    }
    const next: ClCommentDrafts = {
      meal: getNamedEntryBody(entries.mealComment, authorName),
      equipment: getNamedEntryBody(entries.equipmentComment, authorName),
      weather: getNamedEntryBody(entries.weatherComment, authorName),
      sl: getNamedEntryBody(entries.slComment, authorName),
    };
    setDrafts(next);
    setCommentDrafts(next);
  }, [authorName, entries, setCommentDrafts]);

  const updateDraft = (key: keyof ClCommentDrafts, value: string) => {
    setDrafts((prev) => {
      const next = { ...prev, [key]: value };
      setCommentDrafts(next);
      return next;
    });
  };

  return (
    <Stack spacing={2}>
      {CL_COMMENT_SECTIONS.map(
        ({ role, reflectionKey, draftKey, label }) => (
          <Stack key={draftKey} spacing={1}>
            <NamedEntriesDisplay text={entries[reflectionKey]} role={role} />
            <EntryTextField
              id={`comment-${draftKey}`}
              label={label}
              value={drafts[draftKey]}
              handleChange={(e: ChangeEvent<HTMLInputElement>) =>
                updateDraft(draftKey, e.target.value)
              }
            />
          </Stack>
        ),
      )}
    </Stack>
  );
};

export default ClCommentsForm;
