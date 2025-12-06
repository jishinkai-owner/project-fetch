import { RecordContentProps } from "@/types/record";
import axios from "axios";
import { useState, useMemo } from "react";
import useData from "@/lib/swr/useSWR";
import { AuthoredRecordRes, ContentRes } from "@/types/apiResponse";
import toast from "react-hot-toast";

export const useEditorState = () => {
  const [content, setContent] = useState<string | null>("");
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

export const useAuthorRecord = (userId?: string | null) => {
  const { data, isLoading, isError } = useData<AuthoredRecordRes[]>(
    userId ? `/api/recordsAuthor?authorId=${userId}` : "",
  );

  const authorRecord = useMemo(() => {
    if (!data) return [];
    return data.data;
  }, [data]);
  return { authorRecord, isLoadingAuthor: isLoading, isErrorAuthor: isError };
};

export const usePastRecord = (recordId: number) => {
  const { data, isLoading, isError } = useData<ContentRes>(
    `/api/content?id=${recordId}`,
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
    `/api/content?id=${id}`,
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
  title: string | null,
  recordId: number | null,
) => {
  const data = {
    id: id,
    content: content,
    title: title,
    recordId: recordId,
  };

  try {
    // const res = await axios.put("/api/recordAuthor", data, {
    //   headers: {
    //     "Content-Type": "application/json",
    //   },
    // });
    const res = await axios.put("/api/content", data, {
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
  content: string | null,
) => {
  const data = {
    authorId: userId,
    title: recordContent.title,
    content: content,
    recordId: recordContent.recordId,
  };

  try {
    // const res = await axios.post("/api/recordAuthor", data, {
    //   headers: {
    //     "Content-Type": "application/json",
    //   },
    // });
    const res = await axios.post("/api/content", data, {
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
  recordId: number | null;
};

type RecordSubmitProps = {
  recordContent: RecordContentProps;
  userId: string | null | undefined;
  content: string | null;
};

export const useRecordSubmit = ({
  recordContent,
  userId,
  content,
}: RecordSubmitProps) => {
  const submitRecord = async () => {
    const submitSuccess = () => {
      toast.success("記録を登録しました!", {
        duration: 3000,
        position: "bottom-right",
      });
    };
    const submitError = () => {
      toast.error("記録の登録に失敗しました。", {
        duration: 2000,
        position: "bottom-right",
      });
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
  recordId,
}: RecordUpdateProps) => {
  const updateRecord = async () => {
    try {
      await handleContentUpdate(id, content, title, recordId);
      toast.success("記録が更新されました!", {
        duration: 3000,
        position: "bottom-right",
      });
    } catch (error) {
      console.error("Error while updating record: ", error);
      toast.error("記録の更新に失敗しました。", {
        duration: 2000,
        position: "bottom-right",
      });
    }
  };

  return updateRecord;
};

export const useRecordDelete = () => {
  const deleteRecord = async (id: number) => {
    try {
      const res = await axios.delete(`/api/content?id=${id}`);
      if (res.status === 200) {
        toast.success("記録が削除されました!", {
          duration: 3000,
          position: "bottom-right",
        });
        return { success: true };
      }
      return { success: false, error: "Failed to delete record" };
    } catch (error) {
      console.error("Error while deleting record: ", error);
      toast.error("記録の削除に失敗しました。", {
        duration: 2000,
        position: "bottom-right",
      });
      return { success: false, error: "Failed to delete record" };
    }
  };
  return deleteRecord;
};

export default handleContentSubmit;
