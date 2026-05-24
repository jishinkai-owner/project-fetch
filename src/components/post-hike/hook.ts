import useData from "@/lib/swr/useSWR";
import { useMemo, useState, useEffect } from "react";
import axios from "axios";
// import { PostHikeContentProps } from "@/types/hike";
import {
  RecordRes,
  CLRes,
  PostHikeRes,
  PostHikeContentBaseRes,
} from "@/types/apiResponse";
import toast from "react-hot-toast";
import {
  buildClCommentsPayload,
  buildSubmitPayload,
  ClCommentDrafts,
  EntryType,
  getRoleFieldKey,
  PostHikeContentProps,
} from "./entry/entry-types";
import { upsertNamedEntry } from "./role-entries";

export type { PostHikeContentProps } from "./entry/entry-types";

export const usePostHikes = () => {
  const { data, isLoading, isError } = useData<RecordRes[]>("/api/records");

  const postHikes = useMemo(() => {
    if (!data) return [];
    return data.data;
  }, [data]);
  return { postHikes, isLoading, isError };
};

export const useCL = () => {
  const { data, isLoading, isError } = useData<CLRes[]>("/api/cl");
  const cl = useMemo(() => {
    if (!data) return [];
    return data.data;
  }, [data]);
  return { cl, isLoadingCL: isLoading, isErrorCL: isError };
};

export const useTabs = () => {
  const [value, setValue] = useState<number>(0);
  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  return { value, setValue, handleChange };
};

// export const usePastPostHike = (
//   recordId: number | null,
//   clId: string | null,
// ) => {
//   // const { data, isLoading, isError } = useData<PostHikeContentRes[]>(
//   //   `/api/postHike?recordId=${recordId}&clId=${clId}`,
//   // );
//   const { data, isLoading, isError } = useData < PostHikeContentBaseRes;
//
//   const pastPostHike = useMemo(() => {
//     if (!data) return [];
//     return data.data;
//   }, [data]);
//   return {
//     pastPostHike,
//     isLoadingPastPostHike: isLoading,
//     isErrorPastPostHike: isError,
//   };
// };
//
export const usePostPostHikesWithRecordId = (recordId: number) => {
  // const { data, isLoading, isError } = useData<PostHikeContentResWithRecord>(
  //   `/api/postHikes?recordId=${recordId}`,
  // );
  const { data, isLoading, isError } = useData<PostHikeRes>(
    `/api/postHikes?recordId=${recordId}`,
  );

  const postHikes = useMemo(() => {
    if (!data) return null;
    return data.data;
    // return data;
  }, [data]);
  return { postHikes, isLoading, isError };
};

type UserIdProps = {
  clId: string | null;
  recordId: number | null;
};

export const useIds = () => {
  const [ids, setIds] = useState<UserIdProps>({
    clId: null,
    recordId: null,
  });

  return { ids, setIds };
};

export const useEntriesState = (
  clId: string | null,
  recordId: number | null,
) => {
  const { data: postHikeData } = useData<PostHikeContentBaseRes>(
    clId && recordId ? `/api/postHike?recordId=${recordId}&clId=${clId}` : "",
  );
  const postHikeEntry = useMemo(() => {
    if (!postHikeData) return null;
    return postHikeData.data;
  }, [postHikeData]);

  const [entries, setEntries] = useState<PostHikeContentProps>({
    clId: null,
    recordId: null,
    mealPerson: null,
    weatherPerson: null,
    equipmentPerson: null,
    sl: null,
    mealComment: null,
    weatherComment: null,
    equipmentComment: null,
    slComment: null,
    impression: null,
  });

  useEffect(() => {
    if (postHikeEntry) {
      setEntries((prevEntries) => ({
        ...prevEntries,
        clId: postHikeEntry.clId,
        recordId: postHikeEntry.recordId,
        mealPerson: postHikeEntry.roleComments.meal,
        weatherPerson: postHikeEntry.roleComments.weather,
        equipmentPerson: postHikeEntry.roleComments.equipment,
        sl: postHikeEntry.roleComments.sl,
        mealComment: postHikeEntry.clComments.meal,
        weatherComment: postHikeEntry.clComments.weather,
        equipmentComment: postHikeEntry.clComments.equipment,
        slComment: postHikeEntry.clComments.sl,
        impression: Array.isArray(postHikeEntry.impression)
          ? postHikeEntry.impression.join("\n")
          : (postHikeEntry.impression ?? null),
        // clId: postHikeEntry.clId || clId,
        // recordId: postHikeEntry.recordId || recordId,
        // clName: postHikeEntry.clName,
        // mealPerson: postHikeEntry.mealPerson,
        // weatherPerson: postHikeEntry.weatherPerson,
        // equipmentPerson: postHikeEntry.equipmentPerson,
        // sl: postHikeEntry.sl,
        // mealComment: postHikeEntry.mealComment,
        // weatherComment: postHikeEntry.weatherComment,
        // equipmentComment: postHikeEntry.equipmentComment,
        // slComment: postHikeEntry.slComemnt,
      }));
    }
  }, [postHikeEntry, clId, recordId]);

  return { entries, setEntries };
};

const putPostHike = async (data: Record<string, string | number>) => {
  const res = await axios.put("/api/postHike", data, {
    headers: {
      "Conten-Type": "application/json",
    },
  });

  if (res.status === 201) {
    return { success: true as const };
  }

  return { success: false as const, error: "failed to put retrospective data" };
};

export const handleSubmit = async (
  clId: string,
  recordId: number,
  entryType: EntryType,
  authorName: string,
  body: string,
  entries: PostHikeContentProps,
) => {
  const data = buildSubmitPayload(
    clId,
    recordId,
    entryType,
    authorName,
    body,
    entries,
  );

  const hasPayload =
    "reflectionMeal" in data ||
    "reflectionEquipment" in data ||
    "reflectionWeather" in data ||
    "reflectionSL" in data ||
    "impression" in data;

  if (!hasPayload) {
    return { success: false, error: "missing fields" };
  }

  try {
    return await putPostHike(data);
  } catch (error) {
    return { success: false, error: error };
  }
};

export const handleSubmitClComments = async (
  clId: string,
  recordId: number,
  authorName: string,
  entries: PostHikeContentProps,
  drafts: ClCommentDrafts,
) => {
  const data = buildClCommentsPayload(
    clId,
    recordId,
    authorName,
    entries,
    drafts,
  );

  if (
    !("commentMeal" in data) &&
    !("commentEquipment" in data) &&
    !("commentWeather" in data) &&
    !("commentSL" in data)
  ) {
    return { success: false, error: "no comments to submit" };
  }

  try {
    return await putPostHike(data);
  } catch (error) {
    return { success: false, error: error };
  }
};

type UseFormSubmitProps = {
  entries: PostHikeContentProps;
  setEntries: React.Dispatch<React.SetStateAction<PostHikeContentProps>>;
  entryType: EntryType | "";
  authorName: string;
  draft: string;
  setDraft: React.Dispatch<React.SetStateAction<string>>;
  setAuthorName: React.Dispatch<React.SetStateAction<string>>;
  setEntryType: React.Dispatch<React.SetStateAction<EntryType | "">>;
  clCommentDrafts: ClCommentDrafts;
};
export const useFormSubmit = ({
  entries,
  setEntries,
  entryType,
  authorName,
  draft,
  setDraft,
  setAuthorName,
  setEntryType,
  clCommentDrafts,
}: UseFormSubmitProps) => {
  const submitSuccess = () => {
    toast.success("反省を登録しました!", {
      duration: 3000,
      position: "bottom-right",
    });
    if (entryType && entryType !== "cl") {
      const trimmedName = authorName.trim();
      const trimmedBody = draft.trim();
      if (entryType === "impression" && trimmedBody) {
        setEntries((prev) => ({
          ...prev,
          impression: trimmedName
            ? upsertNamedEntry(prev.impression, trimmedName, trimmedBody)
            : trimmedBody,
        }));
      } else {
        const fieldKey = getRoleFieldKey(entryType);
        if (fieldKey && trimmedName && trimmedBody) {
          setEntries((prev) => ({
            ...prev,
            [fieldKey]: upsertNamedEntry(
              prev[fieldKey],
              trimmedName,
              trimmedBody,
            ),
          }));
        }
      }
    }
    if (entryType === "cl" && authorName.trim()) {
      setEntries((prev) => ({
        ...prev,
        mealComment: clCommentDrafts.meal.trim()
          ? upsertNamedEntry(
              prev.mealComment,
              authorName.trim(),
              clCommentDrafts.meal,
            )
          : prev.mealComment,
        equipmentComment: clCommentDrafts.equipment.trim()
          ? upsertNamedEntry(
              prev.equipmentComment,
              authorName.trim(),
              clCommentDrafts.equipment,
            )
          : prev.equipmentComment,
        weatherComment: clCommentDrafts.weather.trim()
          ? upsertNamedEntry(
              prev.weatherComment,
              authorName.trim(),
              clCommentDrafts.weather,
            )
          : prev.weatherComment,
        slComment: clCommentDrafts.sl.trim()
          ? upsertNamedEntry(
              prev.slComment,
              authorName.trim(),
              clCommentDrafts.sl,
            )
          : prev.slComment,
      }));
    }
    setDraft("");
    setAuthorName("");
    setEntryType("");
  };
  const submitError = () => {
    toast.error("反省の登録に失敗しました。", {
      duration: 3000,
      position: "bottom-right",
    });
  };

  const submitForm = async () => {
    if (!entries.clId || !entries.recordId || !entryType) return;

    if (!authorName.trim()) {
      toast.error("名前を入力してください。", {
        duration: 3000,
        position: "bottom-right",
      });
      return;
    }

    try {
      const res =
        entryType === "cl"
          ? await handleSubmitClComments(
              entries.clId,
              entries.recordId,
              authorName,
              entries,
              clCommentDrafts,
            )
          : await handleSubmit(
              entries.clId,
              entries.recordId,
              entryType,
              authorName,
              draft,
              entries,
            );
      if (res.success) {
        submitSuccess();
      } else {
        if (entryType === "cl" && "error" in res && res.error === "no comments to submit") {
          toast.error("コメントを1つ以上入力してください。", {
            duration: 3000,
            position: "bottom-right",
          });
        } else if ("error" in res && res.error === "missing fields") {
          toast.error("本文を入力してください。", {
            duration: 3000,
            position: "bottom-right",
          });
        } else {
          submitError();
        }
      }
    } catch (error) {
      console.error("Error posting hike info: ", error);
      submitError();
    }
  };

  return submitForm;
};
