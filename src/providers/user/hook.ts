import useData from "@/lib/swr/useSWR";
import { useMemo } from "react";
import { UserRes } from "@/types/apiResponse";
export const useUser = () => {
  const { data, isLoading, isError } = useData<UserRes>("/api/user");
  const userInfo = useMemo(() => {
    if (!data) return null;
    // return data;
    return data.data;
  }, [data]);

  return {
    userInfo,
    isLoading,
    isError,
  };
};
