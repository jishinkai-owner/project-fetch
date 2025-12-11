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
export type PostHikeContentProps = {
  clId: string | null;
  recordId: number | null;
  equipmentPerson: string | null;
  weatherPerson: string | null;
  mealPerson: string | null;
  sl: string | null;
  equipmentComment: string | null;
  weatherComment: string | null;
  mealComment: string | null;
  slComment: string | null;
  impression: string | null;
};

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

export const handleSubmit = async (entries: PostHikeContentProps) => {
  const data = {
    clId: entries.clId,
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
};
export const useFormSubmit = ({ entries, setEntries }: UseFormSubmitProps) => {
  const submitSuccess = () => {
    toast.success("反省を登録しました!", {
      duration: 3000,
      position: "bottom-right",
    });
    setEntries({
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
  };
  const submitError = () => {
    toast.error("反省の登録に失敗しました。", {
      duration: 3000,
      position: "bottom-right",
    });
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
