import { RecordContentProps } from "@/types/record";
import axios from "axios";
import { useState, useMemo } from "react";
import useData from "@/lib/swr/useSWR";
import { Dispatch, SetStateAction } from "react";
import { RecordsAuthorRes, ContentRes } from "@/types/apiResponse";
// import { useUserContext } from "@/providers/user";

export const useEditorState = () => {
  // const { userId } = useUserContext();
  const [content, setContent] = useState<string | null>("");
  const [recordContent, setRecordContent] = useState<RecordContentProps>({
    title: null,
    filename: null,
    recordId: null,
  });

  // return { userId, content, setContent, recordContent, setRecordContent };
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

export const useAuthorRecord = (userId?: string | null) => {
  // const { userId } = useUserContext();
  const { data, isLoading, isError } = useData<RecordsAuthorRes[]>(
    userId ? `/api/recordsAuthor?authorId=${userId}` : ""
  );

  const authorRecord = useMemo(() => {
    if (!data) return [];
    return data.data;
  }, [data]);
  return { authorRecord, isLoadingAuthor: isLoading, isErrorAuthor: isError };
};

export const usePastRecord = (recordId: number) => {
  const { data, isLoading, isError } = useData<ContentRes>(
    `/api/content?id=${recordId}`
  );
  const pastRecord = useMemo(() => {
    if (!data) return null;
    return data.data;
  }, [data]);
  return {
    pastRecord,
    isLoadingPastRecord: isLoading,
    isErrorPastRecord: isError,
  };
};

export const useRecordContent = (id: number) => {
  const { data, isLoading, isError } = useData<ContentRes>(
    `/api/content?id=${id}`
  );

  const recordContent = useMemo(() => {
    if (!data) return null;
    return data.data;
  }, [data]);
  return {
    recordContent,
    isLoadingRecordContent: isLoading,
    isErrorRecordContent: isError,
  };
};

export const handleContentUpdate = async (
  id: number,
  content: string | null,
  title: string | null
) => {
  const data = {
    id: id,
    content: content,
    title: title,
  };

  try {
    const res = await axios.put("/api/recordAuthor", data, {
      headers: {
        "Content-Type": "application/json",
      },
    });
    if (res.status === 200) {
      return { success: true, data: res.data };
    }
    return { success: false, error: "Failed to update content" };
  } catch (error) {
    console.error("Error while updating content data: ", error);
  }
};

const handleContentSubmit = async (
  recordContent: RecordContentProps,
  userId: string | null | undefined,
  content: string | null
) => {
  const data = {
    authorId: userId,
    title: recordContent.title,
    content: content,
    filename: null,
    recordId: recordContent.recordId,
  };

  try {
    const res = await axios.post("/api/recordAuthor", data, {
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (res.status === 201) {
      console.log("content submitted successfully");
      return { success: true };
    }
    return { success: false, error: "Failed to update content" };
  } catch (error) {
    console.error("Error while updating content data: ", error);
    return {
      success: false,
      error: "Failed to update content",
    };
  }
};

type RecordUpdateProps = {
  id: number;
  title: string | null;
  content: string | null;
  setMessage: Dispatch<SetStateAction<string>>;
  setOpen: Dispatch<SetStateAction<boolean>>;
  setStatus: Dispatch<SetStateAction<"success" | "error">>;
};

type RecordSubmitProps = {
  recordContent: RecordContentProps;
  userId: string | null | undefined;
  content: string | null;
  setMessage: Dispatch<SetStateAction<string>>;
  setOpen: Dispatch<SetStateAction<boolean>>;
  setStatus: Dispatch<SetStateAction<"success" | "error">>;
};

export const useRecordSubmit = ({
  recordContent,
  userId,
  content,
  setMessage,
  setOpen,
  setStatus,
}: RecordSubmitProps) => {
  const submitRecord = async () => {
    const submitSuccess = () => {
      setMessage("記録を登録しました！");
      setOpen(true);
      setStatus("success");
    };
    const submitError = () => {
      setMessage("記録の登録に失敗しました。");
      setOpen(true);
      setStatus("error");
    };
    try {
      const res = await handleContentSubmit(recordContent, userId, content);
      if (res.success) {
        submitSuccess();
      } else {
        submitError();
      }
    } catch (error) {
      console.error("Error while submitting record: ", error);
      submitError();
    }
  };

  return submitRecord;
};

export const useRecordUpdate = ({
  id,
  title,
  content,
  setMessage,
  setOpen,
  setStatus,
}: RecordUpdateProps) => {
  const updateRecord = async () => {
    try {
      await handleContentUpdate(id, content, title);
      setMessage("記録が更新されました！");
      setOpen(true);
      setStatus("success");
    } catch (error) {
      console.error("Error while updating record: ", error);
      setMessage("記録の更新に失敗しました。");
      setOpen(true);
      setStatus("error");
    }
  };

  return updateRecord;
};

export default handleContentSubmit;
