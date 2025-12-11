import styles from "./page.module.scss";
import { Suspense } from "react";
import ErrorComp from "@/components/error";
import React from "react";

const ErrorPage = () => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <div className={styles.errorPage}>
        <ErrorComp />
      </div>
    </Suspense>
  );
};

export default ErrorPage;
