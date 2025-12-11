"use client";
import { useSearchParams } from "next/navigation";
import styles from "./error.module.scss";
import React from "react";

const ErrorComp = () => {
  const searchParams = useSearchParams();
  const code = Number(searchParams.get("code") ?? 500);
  let message = "An unpected error occurred";
  switch (code) {
    case 404:
      message = "ページが見つからないよ！URLを確認してね！";
      break;
    case 500:
      message =
        "サーバーでエラーが発生したよ！時間をおいてからもう一度試してね！";
      break;
    case 403:
      message =
        "あなたはこのページにアクセス権限がないよ！DCMailのアカウントでログインしてね！";
      break;
    case 401:
      message = "認証に失敗したよ！ももう一ログインしてね！";
      break;
    default:
      message = `エラーコード: ${code}`;
      break;
  }

  return (
    <div className={styles.errorComp}>
      <h1>{code}</h1>
      <p>{message}</p>
    </div>
  );
};

export default ErrorComp;
