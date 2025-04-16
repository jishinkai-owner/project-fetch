// src/app/record/page.tsx
"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function RecordPage() {
  const router = useRouter();
  
  useEffect(() => {
    // デフォルトで山行記録ページにリダイレクト
    router.push("/record/yama");
  }, [router]);
  
  return null; // リダイレクト中は何も表示しない
}