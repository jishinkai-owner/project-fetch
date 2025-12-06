"use client";
import { useFormSubmit, useHikeInfo } from "../hook";
import RegisterForm from "../edit/form";
import { Toaster } from "react-hot-toast";
import React from "react";

const HikeInfoEntry = () => {
  const { entry, setEntry, handleYearChange } = useHikeInfo();

  const submitForm = useFormSubmit({ entry, setEntry });

  return (
    <>
      <RegisterForm
        entry={entry}
        setEntry={setEntry}
        submitForm={submitForm}
        handleYearChange={handleYearChange}
      />
      <Toaster />
    </>
  );
};

export default HikeInfoEntry;
