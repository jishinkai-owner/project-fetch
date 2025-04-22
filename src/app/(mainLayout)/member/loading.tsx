"use client";

import React, { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import styles from "./MemberPage.module.scss";
import TabBar from "@/components/TabBar/TabBar";
import BreadCrumbs from "@/components/BreadCrumbs/BreadCrumbs";
import Title from "@/components/Title/Title";

// YearCategoryに殿堂入りを追加
type YearCategory = "2年生" | "3年生" | "4年生" | "殿堂入り";

// SearchParamsWrapper コンポーネント：URL のクエリパラメータからカテゴリを取得して更新
function SearchParamsWrapper({ setCategory }: { setCategory: (category: YearCategory) => void }) {
  const searchParams = useSearchParams();

  useEffect(() => {
    const categoryFromQuery = searchParams.get("case");
    if (categoryFromQuery) {
      if (["2年生", "3年生", "4年生", "殿堂入り"].includes(categoryFromQuery)) {
        setCategory(categoryFromQuery as YearCategory);
      }
    }
  }, [searchParams, setCategory]);

  return null;
}

// アイコンマッピングに殿堂入りを追加
const yearIcons: Record<YearCategory, string> = {
  "2年生": "🌱",
  "3年生": "🌿",
  "4年生": "🌳",
  "殿堂入り": "🏆" // 殿堂入り用のアイコン
};

const LoadingMemberPlaceholder: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<YearCategory>("2年生");

  return (
    <>
      {/* ナビゲーション */}
      <BreadCrumbs
        breadcrumb={[
          { title: "Home", url: "/" },
          { title: "部員紹介" }
        ]}
      />

      <Title title="部員紹介" />

      {/* Suspense でラップして useSearchParams を利用 */}
      <Suspense fallback={<div>読み込み中...</div>}>
        <SearchParamsWrapper setCategory={setSelectedCategory} />
      </Suspense>

      {/* Tab選択カテゴリ */}
      <TabBar
        tabs={(Object.entries(yearIcons) as [YearCategory, string][]).map(([key, icon]) => ({
          title: key,
          icon: icon,
          url: () => setSelectedCategory(key),
          isCurrent: selectedCategory === key
        }))}
      />

      {/* 選択されたカテゴリの内容 */}
      <div className={styles.contentWrapper}>
        <div className={styles.loadingContainer}>がんばって読み込み中 。。。</div>
      </div>
    </>
  );
};

export default LoadingMemberPlaceholder;
