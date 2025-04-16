"use client";
import { useSearchParams, useRouter } from "next/navigation";
import { useEffect } from "react";
import { useActivity, useHikeInfo, useFormSubmit } from "../../hook";
import { Loading, ErrorMessage } from "@/components/load-status";
import RegisterForm from "../form";
import { useSnackbar } from "@/components/snackbar/hook";
import MainCard from "@/components/main-card";
import { Button } from "@mui/material";

const EditPastEntry = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const id = Number(searchParams.get("id"));
  const { open, setOpen, message, setMessage, handleClose, status, setStatus } =
    useSnackbar();
  const { activity, isLoadingActivity, isErrorActivity } = useActivity(id);
  const { entry, setEntry, handleYearChange } = useHikeInfo();

  const submitForm = useFormSubmit(
    {
      setMessage,
      setOpen,
      setStatus,
    },
    {
      id,
      entry,
      setEntry,
    }
  );

  useEffect(() => {
    if (activity) setEntry({ ...activity });
  }, [activity, setEntry]);

  console.log("activity: ", activity);

  if (isLoadingActivity) return <Loading />;
  if (isErrorActivity) return <ErrorMessage />;

  return (
    <>
      <Button
        variant="text"
        onClick={() => router.back()}
        color="primary"
        sx={{
          mb: 0,
        }}
      >
        &lt; 戻る
      </Button>
      <MainCard>
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
      </MainCard>
    </>
  );
};

export default EditPastEntry;
