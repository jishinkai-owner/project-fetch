import axios from "axios";
import { useMemo, Dispatch, SetStateAction, useState } from "react";
import { HikeInfoEntryProps } from "@/types/hike";
import { Dayjs } from "dayjs";
import { SnackbarStateProps } from "@/types/snackbar";
import useData from "@/lib/swr/useSWR";
import { ActivitiesRes, ActivityWithIdRes } from "@/types/apiResponse";
import toast from "react-hot-toast";

export const useHikeInfo = () => {
  const [entry, setEntry] = useState<HikeInfoEntryProps>({
    year: null,
    date: null,
    place: null,
    activityType: "yama",
  });

  const handleYearChange = (e: Dayjs | null) => {
    if (e) {
      setEntry({ ...entry, year: e.year() });
    } else {
      setEntry({ ...entry, year: null });
    }
  };

  return { entry, setEntry, handleYearChange };
};

type UseFormSubmitProps = {
  id?: number;
  entry: HikeInfoEntryProps;
  setEntry: Dispatch<SetStateAction<HikeInfoEntryProps>>;
};

export const useFormSubmit = (
  { setMessage, setOpen, setStatus }: SnackbarStateProps,
  { id, entry, setEntry }: UseFormSubmitProps
) => {
  const handleSubmit = async (e: HikeInfoEntryProps) => {
    console.log("posting hike info...", e.year, e.date, e.place);

    const data = {
      year: e.year,
      date: e.date,
      place: e.place,
      activityType: e.activityType,
    };

    try {
      const res = id
        ? await axios.put("/api/activity", { id, ...data })
        : await axios.post("/api/activity", data);
      console.log("response from server: ", res);
      if (res.status === 201 || res.status === 200) {
        console.log("hike info posted successfully");
        return { success: true, data: res.data };
      }
      return { success: false, error: "Failed to post hike info" };
    } catch (error) {
      console.error("API Error while posting hike info data: ", error);
      return { success: false, error: "Failed to post hike info" };
    }
  };

  const submitSuccess = () => {
    setMessage("活動情報を登録しsdました!");
    setOpen(true);
    setStatus("success");
    setEntry({ year: null, date: null, place: null, activityType: "yama" });
  };
  const updateSuccess = () => {
    toast.success("活動情報を更新しました!");
    // setMessage("活動情報を登録しました!");
    // setOpen(true);
    // setStatus("success");
  };
  const submitError = () => {
    // handleError("活動情報の登録に失敗しました。");
    setMessage("活動情報の登録に失敗しました。");
    setOpen(true);
    setStatus("error");
  };

  const submitForm = async () => {
    try {
      const res = await handleSubmit(entry);

      if (res.success) {
        if (id) {
          updateSuccess();
          toast.success("活動情報を更新しました!");
        } else {
          submitSuccess();
          toast.success("活動情報を登録しました!", {
            duration: 3000,
            position: "bottom-right",
          });
        }
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

export const useFormDelete = ({
  setMessage,
  setOpen,
  setStatus,
}: SnackbarStateProps) => {
  const handleDelete = async (id: number) => {
    try {
      const res = await axios.delete(`/api/activity?id=${id}`);
      console.log("response from server: ", res);
      if (res.status === 200) {
        console.log("activity data deleted successfully");
        return { success: true };
      }
      return { success: false, error: "Failed to delete activity data" };
    } catch (error) {
      console.error("API Error while deleting activity data: ", error);
      return { success: false, error: "Failed to delete activity data" };
    }
  };

  const submitSuccess = () => {
    setMessage("活動情報を削除しました!");
    setOpen(true);
    setStatus("success");
  };
  const submitError = () => {
    setMessage("活動情報の削除に失敗しました。");
    setOpen(true);
    setStatus("error");
  };

  const deleteForm = async (id: number) => {
    try {
      const res = await handleDelete(id);
      if (res.success) {
        submitSuccess();
      } else {
        submitError();
      }
    } catch (error) {
      console.error("Error deleting hike info: ", error);
      submitError();
    }
  };

  return deleteForm;
};

type UseFormUpdateProps = {
  id: number;
  entry: HikeInfoEntryProps;
  // setMessage: Dispatch<SetStateAction<string>>;
  // setOpen: Dispatch<SetStateAction<boolean>>;
  // setStatus: Dispatch<SetStateAction<"success" | "error">>;
};

export const useFormUpdate = (
  { id, entry }: UseFormUpdateProps,
  { setMessage, setOpen, setStatus }: SnackbarStateProps
) => {
  const handleUpdate = async (e: HikeInfoEntryProps) => {
    console.log(
      "updating hike info...",
      e.year,
      e.date,
      e.place,
      e.activityType
    );

    const data = {
      id,
      year: e.year,
      date: e.date,
      place: e.place,
      activityType: e.activityType,
    };

    try {
      const res = await axios.put("/api/activity", data);
      console.log("response from server: ", res);
      if (res.status === 200) {
        console.log("hike info updated successfully");
        return { success: true, data: res.data };
      }

      return { success: false, error: "Failed to update hike info" };
    } catch (error) {
      console.error("API Error while updating hike info data: ", error);
      return { success: false, error: "Failed to update hike info" };
    }
  };

  const submitSuccess = () => {
    setMessage("活動情報を更新しました!");
    setOpen(true);
    setStatus("success");
  };
  const submitError = () => {
    setMessage("活動情報の更新に失敗しました。");
    setOpen(true);
    setStatus("error");
  };

  const updateForm = async () => {
    try {
      const res = await handleUpdate(entry);

      if (res.success) {
        submitSuccess();
      } else {
        submitError();
      }
    } catch (error) {
      console.error("Error updating hike info: ", error);
      submitError();
    }
  };

  return updateForm;
};

export const useActivities = () => {
  const { data, isLoading, isError } =
    useData<ActivitiesRes[]>("/api/activities");
  // useData<ActivitiesRes>("/api/activities");
  // useData("api/activities");

  const activities = useMemo(() => {
    if (!data) return [];
    return data.data;
  }, [data]);

  return {
    activities,
    isLoadingActivities: isLoading,
    isErrorActivities: isError,
  };
};

export const useActivity = (id: number | null) => {
  // const { data, isLoading, isError } = useData<ActivityRes>(
  //   `/api/activity?id=${id}`
  // );
  const { data, isLoading, isError } = useData<ActivityWithIdRes>(
    `/api/activity?id=${id}`
  );

  const activity = useMemo(() => {
    if (!data) return null;
    return data.data;
  }, [data]);

  return {
    activity,
    isLoadingActivity: isLoading,
    isErrorActivity: isError,
  };
};
