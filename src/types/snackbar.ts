import { Dispatch, SetStateAction } from "react";
export type SnackbarStateProps = {
  setMessage: Dispatch<SetStateAction<string>>;
  setOpen: Dispatch<SetStateAction<boolean>>;
  setStatus: Dispatch<SetStateAction<"success" | "error">>;
};
