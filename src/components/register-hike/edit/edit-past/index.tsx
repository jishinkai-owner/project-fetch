"use client";
import { useSearchParams, useRouter } from "next/navigation";
import { useEffect } from "react";
import { useActivity, useHikeInfo, useFormSubmit } from "../../hook";
import { Loading, ErrorMessage } from "@/components/load-status";
import RegisterForm from "../form";
import MainCard from "@/components/main-card";
import { Button } from "@mui/material";
import { Toaster } from "react-hot-toast";

const EditPastEntry = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const id = Number(searchParams.get("id"));
  const { activity, isLoadingActivity, isErrorActivity } = useActivity(id);
  const { entry, setEntry, handleYearChange } = useHikeInfo();

  const submitForm = useFormSubmit({
    id,
    entry,
    setEntry,
  });

  useEffect(() => {
    if (activity) setEntry({ ...activity });
  }, [activity, setEntry]);

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
          entry={entry}
          setEntry={setEntry}
          submitForm={submitForm}
          handleYearChange={handleYearChange}
        />
      </MainCard>
      <Toaster />
    </>
  );
};

export default EditPastEntry;
