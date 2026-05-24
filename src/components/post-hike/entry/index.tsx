import React, { useEffect, useState } from "react";
import { Button, Stack, Box } from "@mui/material";
import Grid from "@mui/material/Grid2";
import { ChangeEvent } from "react";
import { useEntriesState, useCL } from "../hook";
import EntryTextField from "./entry-textfield";
import { Loading, ErrorMessage } from "@/components/load-status";
import CLSelect from "./cl-select";
import HikeSelect from "./hike-select";
import EntryTypeSelect from "./entry-type-select";
import { usePostHikes } from "../hook";
import { Toaster } from "react-hot-toast";
import { useFormSubmit } from "../hook";
import { useIds } from "../hook";
import {
  EntryType,
  ENTRY_TYPE_OPTIONS,
  getEntryValue,
  setEntryValue,
} from "./entry-types";

const PostHikeForm = () => {
  const { ids, setIds } = useIds();
  const { cl, isLoadingCL, isErrorCL } = useCL();
  const { postHikes, isLoading, isError } = usePostHikes();
  const { entries, setEntries } = useEntriesState(ids.clId, ids.recordId);
  const [entryType, setEntryType] = useState<EntryType | "">("");
  const [draft, setDraft] = useState("");

  const submitForm = useFormSubmit({
    entries,
    setEntries,
    entryType,
    draft,
    setDraft,
    setEntryType,
  });

  useEffect(() => {
    setEntryType("");
  }, [ids.clId, ids.recordId]);

  useEffect(() => {
    if (!entryType) {
      setDraft("");
      return;
    }
    setDraft(getEntryValue(entryType, entries));
  }, [entryType, entries]);

  const selectedLabel =
    ENTRY_TYPE_OPTIONS.find((o) => o.value === entryType)?.label ?? "";

  if (isLoading || isLoadingCL) return <Loading />;
  if (isError || isErrorCL) return <ErrorMessage />;

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
          {entryType && (
            <EntryTextField
              id="reflection-entry"
              value={draft}
              label={selectedLabel}
              handleChange={(e: ChangeEvent<HTMLInputElement>) => {
                const value = e.target.value;
                setDraft(value);
                setEntries((prev) => setEntryValue(entryType, value, prev));
              }}
            />
          )}
        </Stack>
        <Grid container justifyContent="end">
          <Button
            variant="contained"
            color="primary"
            sx={{ mt: 2 }}
            disabled={!entries.clId || !entries.recordId || !entryType}
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
