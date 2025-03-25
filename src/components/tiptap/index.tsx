"use client";
import MainCard from "../main-card";
import TipTapEditor from "./editor";
import { useMemo } from "react";
import Grid from "@mui/material/Grid2";
import {
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Stack,
  TextField,
} from "@mui/material";
import usePostHikes from "../post-hike/hook";
import handleContentSubmit from "./hook";
import { RecordProps } from "@/types/record";
import { Loading, ErrorMessage } from "../load-status";
import { useEditorState } from "./hook";

const EditorPage = () => {
  const { postHikes, isLoading, isError } = usePostHikes();
  const { content, setContent, recordContent, setRecordContent } =
    useEditorState();

  const menuItems = useMemo(() => {
    return postHikes.map((e: RecordProps) => (
      <MenuItem key={e.id} value={e.id}>
        {e.place} - {e.date}, {e.year}
      </MenuItem>
    ));
  }, [postHikes]);

  if (isError) return <ErrorMessage />;

  return (
    <MainCard>
      <Stack spacing={2}>
        <FormControl fullWidth variant="standard">
          <InputLabel id="select-mountain-label">山行を選択</InputLabel>
          {isLoading ? (
            <Loading />
          ) : (
            <Select
              labelId="select-mountain-label"
              id="select-mountain-required"
              value={recordContent.recordId ?? ""}
              onChange={(e) =>
                setRecordContent({
                  ...recordContent,
                  recordId: Number(e.target.value),
                })
              }
            >
              {menuItems}
            </Select>
          )}
        </FormControl>
        <TextField
          id="title-required"
          label="タイトル"
          required
          variant="standard"
          onChange={(e) =>
            setRecordContent({ ...recordContent, title: e.target.value })
          }
        />
        <TipTapEditor setContent={setContent} />
        <Grid container direction="row" justifyContent="flex-end">
          <Button
            variant="contained"
            color="primary"
            size="large"
            onClick={() => handleContentSubmit(recordContent, content)}
            disabled={
              !content ||
              !recordContent.title ||
              !recordContent.recordId ||
              isLoading
            }
          >
            保存
          </Button>
        </Grid>
      </Stack>
    </MainCard>
  );
};

export default EditorPage;
