import useData from "@/lib/swr/useSWR";
import { useMemo, useState } from "react";
import axios from "axios";
import { PostHikeContentProps } from "@/types/hike";
import {
  RecordRes,
  CLRes,
  PostHikeContentRes,
  PostHikeContentResWithRecord,
} from "@/types/apiResponse";

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
    // return data;
  }, [data]);
  return { cl, isLoadingCL: isLoading, isErrorCL: isError };
};

export const usePastPostHike = (
  recordId: number | null,
  clId: string | null
) => {
  const { data, isLoading, isError } = useData<PostHikeContentRes[]>(
    `/api/postHike?recordId=${recordId}&clId=${clId}`
  );

  const pastPostHike = useMemo(() => {
    if (!data) return [];
    return data.data;
  }, [data]);
  return {
    pastPostHike,
    isLoadingPastPostHike: isLoading,
    isErrorPastPostHike: isError,
  };
};

export const usePostPostHikesWithRecordId = (recordId: number) => {
  const { data, isLoading, isError } = useData<PostHikeContentResWithRecord>(
    `/api/postHikes?recordId=${recordId}`
  );

  const postHikes = useMemo(() => {
    if (!data) return null;
    return data.data;
    // return data;
  }, [data]);
  return { postHikes, isLoading, isError };
};

export const useEntriesState = () => {
  const [entries, setEntries] = useState<PostHikeContentProps>({
    clId: null,
    clName: null,
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

  return { entries, setEntries };
};

export const handleSubmit = async (entries: PostHikeContentProps) => {
  const data = {
    clId: entries.clId,
    clName: entries.clName?.split(" ")[0],
    recordId: entries.recordId,
    reflectionMeal: entries.mealPerson,
    reflectionWeather: entries.weatherPerson,
    reflectionEquipment: entries.equipmentPerson,
    reflectionSL: entries.sl,
    commentMeal: entries.mealComment,
    commentWeather: entries.weatherComment,
    commentEquipment: entries.equipmentComment,
    commentSL: entries.slComment,
    impression: entries.impression,
  };

  try {
    const res = await axios.put("/api/postHike", data, {
      headers: {
        "Conten-Type": "application/json",
      },
    });

    if (res.status === 201) {
      return { success: true };
    }

    return { success: false, error: "failed to put retrospective data" };
  } catch (error) {
    return { success: false, error: error };
  }
};

type UseFormSubmitProps = {
  entries: PostHikeContentProps;
  setEntries: React.Dispatch<React.SetStateAction<PostHikeContentProps>>;
  setMessage: React.Dispatch<React.SetStateAction<string>>;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setStatus: React.Dispatch<React.SetStateAction<"success" | "error">>;
};
export const useFormSubmit = ({
  entries,
  setEntries,
  setMessage,
  setOpen,
  setStatus,
}: UseFormSubmitProps) => {
  const submitSuccess = () => {
    setMessage("反省を登録しました!");
    setOpen(true);
    setStatus("success");
    setEntries({
      clId: null,
      clName: null,
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
  };
  const submitError = () => {
    setMessage("反省の登録に失敗しました。");
    setOpen(true);
    setStatus("error");
  };

  const submitForm = async () => {
    try {
      const res = await handleSubmit(entries);
      if (res.success) {
        submitSuccess();
      } else {
        submitError();
      }
    } catch (error) {
      console.error("Error posting hike info: ", error);
      submitError();
    }
  };

  return submitForm;
};
