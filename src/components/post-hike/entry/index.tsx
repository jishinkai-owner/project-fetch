import React, { useEffect, useState } from "react";
import { Button, Stack, Box } from "@mui/material";
import Grid from "@mui/material/Grid2";
import { ChangeEvent } from "react";
import { useEntriesState, useCL } from "../hook";
import EntryTextField from "./entry-textfield";
import AuthorNameField from "./author-name-field";
import { Loading, ErrorMessage } from "@/components/load-status";
import CLSelect from "./cl-select";
import HikeSelect from "./hike-select";
import EntryTypeSelect from "./entry-type-select";
import { usePostHikes } from "../hook";
import { Toaster } from "react-hot-toast";
import { useFormSubmit } from "../hook";
import { useIds } from "../hook";
import ClCommentsForm from "./cl-comments-form";
import useData from "@/lib/swr/useSWR";
import { UserRes } from "@/types/apiResponse";
import { getNamedEntryBody } from "../role-entries";
import {
  EntryType,
  ENTRY_TYPE_OPTIONS,
  ClCommentDrafts,
  getEntryValue,
} from "./entry-types";

const emptyCommentDrafts = (): ClCommentDrafts => ({
  meal: "",
  equipment: "",
  weather: "",
  sl: "",
});

const PostHikeForm = () => {
  const { ids, setIds } = useIds();
  const { cl, isLoadingCL, isErrorCL } = useCL();
  const { postHikes, isLoading, isError } = usePostHikes();
  const { entries, setEntries } = useEntriesState(ids.clId, ids.recordId);
  const { data: userRes } = useData<UserRes>("/api/user");
  const [entryType, setEntryType] = useState<EntryType | "">("");
  const [authorName, setAuthorName] = useState("");
  const [draft, setDraft] = useState("");
  const [clCommentDrafts, setClCommentDrafts] =
    useState<ClCommentDrafts>(emptyCommentDrafts);

  const submitForm = useFormSubmit({
    entries,
    setEntries,
    entryType,
    authorName,
    draft,
    setDraft,
    setAuthorName,
    setEntryType,
    clCommentDrafts,
  });

  useEffect(() => {
    if (userRes?.data?.name && !authorName) {
      setAuthorName(userRes.data.name);
    }
  }, [userRes?.data?.name, authorName]);

  useEffect(() => {
    setEntryType("");
    setAuthorName(userRes?.data?.name ?? "");
    setDraft("");
    setClCommentDrafts(emptyCommentDrafts());
  }, [ids.clId, ids.recordId, userRes?.data?.name]);

  useEffect(() => {
    if (!entryType || entryType === "cl") {
      setDraft("");
      return;
    }
    if (!authorName.trim()) {
      setDraft("");
      return;
    }
    const fullText = getEntryValue(entryType, entries);
    if (entryType === "impression") {
      setDraft(getNamedEntryBody(fullText, authorName));
    } else {
      setDraft(getNamedEntryBody(fullText, authorName));
    }
  }, [entryType, entries, authorName]);

  const selectedLabel =
    ENTRY_TYPE_OPTIONS.find((o) => o.value === entryType)?.label ?? "";

  if (isLoading || isLoadingCL) return <Loading />;
  if (isError || isErrorCL) return <ErrorMessage />;

  const showAuthorName = Boolean(entryType);
  const canSubmit =
    entries.clId && entries.recordId && entryType && authorName.trim();

  return (
    <>
      <Box component="form" id="post-hike-form">
        <Stack direction="column" spacing={2}>
          <CLSelect
            clMembers={cl}
            handleChange={(e: ChangeEvent<HTMLInputElement>) => {
              const [clId] = e.target.value.split("|");
              setIds((prevIds) => ({
                ...prevIds,
                clId: clId,
              }));
              setEntries((prevEntries) => ({
                ...prevEntries,
                clId: clId,
              }));
            }}
          />
          <HikeSelect
            records={postHikes}
            value={entries.recordId}
            handleChange={(e: ChangeEvent<HTMLInputElement>) => {
              setIds((prevIds) => ({
                ...prevIds,
                recordId: Number(e.target.value),
              }));

              setEntries((prevEntries) => ({
                ...prevEntries,
                recordId: Number(e.target.value),
              }));
            }}
          />
          <EntryTypeSelect
            value={entryType}
            handleChange={(e: ChangeEvent<HTMLInputElement>) => {
              setEntryType(e.target.value as EntryType);
            }}
          />
          {showAuthorName && (
            <AuthorNameField
              value={authorName}
              handleChange={(e: ChangeEvent<HTMLInputElement>) =>
                setAuthorName(e.target.value)
              }
            />
          )}
          {entryType === "cl" && (
            <ClCommentsForm
              entries={entries}
              authorName={authorName}
              setCommentDrafts={setClCommentDrafts}
            />
          )}
          {entryType && entryType !== "cl" && (
            <EntryTextField
              id="reflection-entry"
              value={draft}
              label={selectedLabel}
              handleChange={(e: ChangeEvent<HTMLInputElement>) =>
                setDraft(e.target.value)
              }
            />
          )}
        </Stack>
        <Grid container justifyContent="end">
          <Button
            variant="contained"
            color="primary"
            sx={{ mt: 2 }}
            disabled={!canSubmit}
            onClick={() => {
              submitForm();
            }}
          >
            提出
          </Button>
        </Grid>
      </Box>
      <Toaster />
    </>
  );
};

export default PostHikeForm;
