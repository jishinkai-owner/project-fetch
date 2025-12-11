import EditPastEntry from "@/components/register-hike/edit/edit-past";
import { Suspense } from "react";
import React from "react";

const RegisterHikeEditPage = () => {
  return (
    <Suspense>
      <EditPastEntry />
    </Suspense>
  );
};

export default RegisterHikeEditPage;
