import useData from "@/lib/swr/useSWR";
import { useMemo } from "react";
export const useUser = () => {
  const { data, isLoading, isError } = useData("/api/user");
  const userInfo = useMemo(() => {
    if (!data) return null;
    return data.data;
  }, [data]);

  return {
    userInfo,
    isLoading,
    isError,
  };
};
