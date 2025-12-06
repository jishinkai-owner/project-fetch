import RegisterHikeComp from "@/components/register-hike";
import { Suspense } from "react";
import React from "react";

const RegisterHike = () => {
  return (
    <Suspense>
      <RegisterHikeComp />
    </Suspense>
  );
};

export default RegisterHike;
