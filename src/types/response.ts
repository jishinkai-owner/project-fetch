export type APIResponse<T> = {
  status: "success" | "error";
  data: T | null;
  error: string | null;
};
