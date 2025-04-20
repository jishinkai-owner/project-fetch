"use client";
import { useSnackbar } from "@/components/snackbar/hook";
import { useFormSubmit, useHikeInfo } from "../hook";
import RegisterForm from "../edit/form";
import { Toaster } from "react-hot-toast";

const HikeInfoEntry = () => {
  // const searchParams = useSearchParams();
  // const id = Number(searchParams.get("id"));

  // const { activity, isLoadingActivity, isErrorActivity } = useActivity(id);

  // if (isLoadingActivity) return <div>Loading...</div>;
  // if (isErrorActivity) return <div>Error...</div>;

  const { open, setOpen, message, setMessage, handleClose, status, setStatus } =
    useSnackbar();
  const { entry, setEntry, handleYearChange } = useHikeInfo();

  // useEffect(() => {
  //   if (activity) {
  //     setEntry({ ...activity });
  //   }
  // }, [activity, setEntry]);

  const submitForm = useFormSubmit(
    { setMessage, setOpen, setStatus },
    { entry, setEntry }
  );

  return (
    <>
      <RegisterForm
        open={open}
        message={message}
        status={status}
        entry={entry}
        handleClose={handleClose}
        setEntry={setEntry}
        submitForm={submitForm}
        handleYearChange={handleYearChange}
      />
      <Toaster />
    </>
  );
};

export default HikeInfoEntry;
