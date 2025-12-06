"use client";
import { Stack, TextField } from "@mui/material";
import { useEffect } from "react";
import Grid from "@mui/material/Grid2";
import MainCard from "@/components/main-card";
import { Button, Skeleton } from "@mui/material";
import TipTapEditor from "../editor";
import { useEditorState, usePastRecord, useRecordUpdate } from "../hook";
import { Loading, ErrorMessage } from "@/components/load-status";
import { useRouter } from "next/navigation";
import { usePostHikes } from "@/components/post-hike/hook";
import HikeSelect from "@/components/post-hike/entry/hike-select";
import React from "react";

type EditPastRecordProps = {
  id: number;
};

const EditPastRecord = ({ id }: EditPastRecordProps) => {
  const { pastRecord, isLoadingPastRecord, isErrorPastRecord } =
    usePastRecord(id);
  const { content, setContent, recordContent, setRecordContent } =
    useEditorState();
  const { postHikes, isLoading, isError } = usePostHikes();

  const router = useRouter();

  const updateRecord = useRecordUpdate({
    id,
    content,
    title: recordContent.title,
    recordId: recordContent.recordId,
  });

  useEffect(() => {
    if (pastRecord && !isLoadingPastRecord) {
      setContent(pastRecord.content);
      setRecordContent((prev) => ({
        ...prev,
        title: pastRecord.title,
        recordId: pastRecord.recordId,
      }));
    }
  }, [pastRecord, isLoadingPastRecord, setContent, setRecordContent]);

  if (isLoadingPastRecord) return <Loading />;
  if (isErrorPastRecord | isError) return <ErrorMessage />;

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
          {isLoading ? (
            <Skeleton variant="rectangular" height={56} width="100%" />
          ) : (
            <HikeSelect
              records={postHikes}
              value={recordContent.recordId}
              handleChange={(e) =>
                setRecordContent((prev) => ({
                  ...prev,
                  recordId: Number(e.target.value),
                }))
              }
            />
          )}
          <TextField
            id="title"
            label="タイトル"
            variant="outlined"
            value={recordContent.title || ""}
            onChange={(e) =>
              setRecordContent((prev) => ({ ...prev, title: e.target.value }))
            }
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
            disabled={
              !content ||
              !recordContent.title ||
              !recordContent.recordId ||
              isLoadingPastRecord
            }
          >
            保存
          </Button>
        </Grid>
      </MainCard>
    </>
  );
};

export default EditPastRecord;
