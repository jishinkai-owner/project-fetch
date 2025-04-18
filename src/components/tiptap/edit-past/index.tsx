"use client";
import { Stack, TextField } from "@mui/material";
import { useState, useEffect } from "react";
import Grid from "@mui/material/Grid2";
import MainCard from "@/components/main-card";
import { Button } from "@mui/material";
import TipTapEditor from "../editor";
import { useEditorState, usePastRecord, useRecordUpdate } from "../hook";
import { Loading, ErrorMessage } from "@/components/load-status";
import { useRouter } from "next/navigation";
import { useSnackbar } from "@/components/snackbar/hook";
import SubmitSnackbar from "@/components/snackbar";

type EditPastRecordProps = {
  id: number;
};

const EditPastRecord = ({ id }: EditPastRecordProps) => {
  const { pastRecord, isLoadingPastRecord, isErrorPastRecord } =
    usePastRecord(id);
  const { content, setContent } = useEditorState();
  const [title, setTitle] = useState<string | null>("");
  const { open, setOpen, message, setMessage, handleClose, status, setStatus } =
    useSnackbar();

  const router = useRouter();

  const updateRecord = useRecordUpdate({
    id,
    content,
    title,
    setOpen,
    setMessage,
    setStatus,
  });

  useEffect(() => {
    if (pastRecord && !isLoadingPastRecord) {
      setContent(pastRecord.content);
      setTitle(pastRecord.title);
    }
  }, [pastRecord, isLoadingPastRecord, setContent]);

  if (isLoadingPastRecord) return <Loading />;
  if (isErrorPastRecord) return <ErrorMessage />;

  return (
    <>
      <Button
        variant="text"
        onClick={() => router.back()}
        color="primary"
        sx={{
          mb: 0,
        }}
      >
        &lt; 戻る
      </Button>
      <MainCard>
        <Stack direction="column" spacing={2}>
          <TextField
            id="title"
            label="タイトル"
            variant="outlined"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <TipTapEditor content={content} setContent={setContent} />
        </Stack>
        <Grid
          container
          spacing={2}
          sx={{
            justifyContent: "flex-end",
            paddingTop: 2,
          }}
        >
          <Button
            variant="contained"
            color="primary"
            size="large"
            onClick={(e) => {
              e.preventDefault();
              updateRecord();
            }}
            disabled={!content || !title || isLoadingPastRecord}
          >
            保存
          </Button>
        </Grid>
      </MainCard>
      <SubmitSnackbar
        open={open}
        handleClose={handleClose}
        message={message}
        status={status}
      />
    </>
  );
};

export default EditPastRecord;
