import styles from "./page.module.scss";
import { Suspense } from "react";
import ErrorComp from "@/components/error";

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
