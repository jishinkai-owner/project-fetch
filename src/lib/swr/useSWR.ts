import { fetcher } from "./fetcher";
import useSWR from "swr";

export default function useData(url: string) {
  const { data, error, isLoading } = useSWR(url, fetcher, {
    revalidateOnFocus: true,
    revalidateOnMount: true,
  });

  return {
    data: data,
    isError: error,
    isLoading: isLoading,
  };
}
