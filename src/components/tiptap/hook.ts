import { RecordContentProps } from "@/types/record";
import axios from "axios";
import { useState } from "react";

export const useEditorState = () => {
  const [content, setContent] = useState("");
  const [recordContent, setRecordContent] = useState<RecordContentProps>({
    title: null,
    filename: null,
    recordId: null,
  });

  return { content, setContent, recordContent, setRecordContent };
};

export const useImage = () => {
  const [url, setUrl] = useState("");
  const [open, setOpen] = useState(false);

  const handleOpen = () => {
    setOpen(!open);
  };

  return { url, setUrl, open, handleOpen };
};

const handleContentSubmit = (
  recordContent: RecordContentProps,
  content: string
) => {
  console.log(
    "submitting content...",
    recordContent.title,
    content,
    recordContent.recordId
  );

  const data = {
    title: recordContent.title,
    content: content,
    filename: null,
    recordId: recordContent.recordId,
  };

  axios
    .post("/api/recordContents", data, {
      headers: {
        "Content-Type": "application/json",
      },
    })
    .then((res) => {
      console.log("response from server: ", res);
      if (res.status === 201) {
        console.log("content posted successfully");
      }
    })
    .catch((error) => {
      console.error("API Error while posting content data: ", error);
    });
};

export default handleContentSubmit;
