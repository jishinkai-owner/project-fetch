import useData from "@/lib/swr/useSWR";
import { useMemo } from "react";

const usePostHikes = () => {
  const { data, isLoading, isError } = useData("/api/record");

  //   const postHikes = data;
  const postHikes = useMemo(() => {
    if (!data) return [];
    return data.data;
  }, [data]);
  return { postHikes, isLoading, isError };
};

export default usePostHikes;
