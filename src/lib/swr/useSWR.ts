import { fetcher } from "./fetcher";
import useSWR from "swr";

type ApiResponse<T> = {
  data: T;
  succcess: boolean;
};

export default function useData<T>(url: string) {
  const { data, error, isLoading } = useSWR<ApiResponse<T>>(url, fetcher, {
    revalidateOnFocus: true,
    revalidateOnMount: true,
  });

  return {
    data: data,
    isError: error,
    isLoading: isLoading,
  };
}
