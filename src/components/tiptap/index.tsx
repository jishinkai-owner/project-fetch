"use client";
import MainCard from "../main-card";
import TipTapEditor from "./editor";
import Grid from "@mui/material/Grid2";
import {
  Button,
  Skeleton,
  Stack,
  TextField,
  Accordion,
  Typography,
  AccordionSummary,
  AccordionDetails,
  AccordionActions,
} from "@mui/material";
import { usePostHikes } from "../post-hike/hook";
import { ErrorMessage } from "../load-status";
import { useEditorState, useAuthorRecord } from "./hook";
import HikeSelect from "../post-hike/entry/hike-select";
import { ExpandMore } from "@mui/icons-material";
import RecordCard from "../shared/record-card";
import { useRecordSubmit, useRecordDelete } from "./hook";
import { useUserContext } from "@/providers/user";
import { Suspense } from "react";

const EditorPage = () => {
  const { contextValue } = useUserContext();
  const userId = contextValue.userId;
  const { postHikes, isLoading, isError } = usePostHikes();
  const { authorRecord, isLoadingAuthor, isErrorAuthor } =
    useAuthorRecord(userId);
  const { content, setContent, recordContent, setRecordContent } =
    useEditorState();

  const submitRecord = useRecordSubmit({
    recordContent,
    userId,
    content,
  });

  const deleteRecord = useRecordDelete();

  if (isError || isErrorAuthor) return <ErrorMessage />;

  return (
    <MainCard>
      <Accordion>
        <AccordionSummary
          expandIcon={<ExpandMore />}
          aria-controls="panel1a-content"
          id="panel1a-header"
        >
          <Typography variant="body2" fontWeight={600}>
            記録を編集する
          </Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Grid
            container
            spacing={{ md: 4, sm: 2, xs: 1 }}
            columns={{ md: 2, sm: 1 }}
            sx={{
              justifyContent: "center",
            }}
          >
            {isLoadingAuthor ? (
              <Skeleton variant="rectangular" height={56} width="100%" />
            ) : (
              authorRecord.map((content) => (
                <RecordCard
                  includeDelete
                  key={content.id}
                  buttonTitle={"記録を編集する"}
                  pushUrl={`/club-members/records/edit/${content.id}`}
                  title={content.title ?? ""}
                  description={content.Record.place ?? ""}
                  onDelete={() => deleteRecord(content.id)}
                />
              ))
            )}
          </Grid>
        </AccordionDetails>
      </Accordion>
      <Accordion defaultExpanded>
        <AccordionSummary
          expandIcon={<ExpandMore />}
          aria-controls="panel2a-content"
          id="panel2a-header"
        >
          <Typography variant="body2" fontWeight={600}>
            新しい記録を記入する
          </Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Stack spacing={2}>
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
              id="title-required"
              label="タイトル"
              required
              variant="outlined"
              onChange={(e) =>
                setRecordContent((prev) => ({
                  ...prev,
                  title: e.target.value,
                }))
              }
            />

            <Suspense>
              <TipTapEditor content={null} setContent={setContent} />
            </Suspense>
            <AccordionActions>
              <Button
                variant="contained"
                color="primary"
                size="large"
                onClick={
                  () => submitRecord()
                  // handleContentSubmit(recordContent, userId, content)
                }
                disabled={
                  !content ||
                  !recordContent.title ||
                  !recordContent.recordId ||
                  !userId ||
                  isLoading
                }
              >
                保存
              </Button>
            </AccordionActions>
          </Stack>
        </AccordionDetails>
      </Accordion>
    </MainCard>
  );
};

export default EditorPage;
