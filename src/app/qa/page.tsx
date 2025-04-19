"use client";

import React, { useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import styles from "./QaPage.module.scss";
import { qaData, QaCategory } from "./qaData";
import TabBar from "@/components/TabBar/TabBar";
import BreadCrumbs from "@/components/BreadCrumbs/BreadCrumbs";
import Title from "@/components/Title/Title";

// Suspense でラップするコンポーネント
function SearchParamsWrapper({ setSelectedCategory }: { setSelectedCategory: (category: QaCategory) => void }) {
  const searchParams = useSearchParams();
  const selectedCategoryFromQuery = searchParams.get("case") as QaCategory | null;

  React.useEffect(() => {
    if (selectedCategoryFromQuery) {
      setSelectedCategory(selectedCategoryFromQuery);
    }
  }, [selectedCategoryFromQuery, setSelectedCategory]);

  return null;
}

// カテゴリとアイコンのマッピング
const categoryIcons: Record<QaCategory, string> = {
  "登山編": "⛰️",
  "釣り編": "🎣",
  "旅行編": "✈️",
  "その他編": "❓"
};

const QaPage: React.FC = () => {
  // デフォルトで「登山編」を表示
  const [selectedCategory, setSelectedCategory] = useState<QaCategory>("登山編");

  const renderContent = () => {
    if (!selectedCategory) return <div className={styles.noDataMessage}>カテゴリを選択してください。</div>;

    const categoryData = qaData[selectedCategory];
    if (!categoryData) return <div className={styles.noDataMessage}>該当するQ&Aがありません。</div>;

    return (
      <div className={styles.qaList}>
        {categoryData.map((qa, index) => (
          <div key={index} className={styles.qaCard}>
            <div className={styles.questionSection}>
              <span className={styles.questionIcon}>Q</span>
              <h3 className={styles.questionText}>{qa.question}</h3>
            </div>
            <div className={styles.answerSection}>
              <span className={styles.answerIcon}>A</span>
              <div className={styles.answerText}>
                {qa.answer.split("\n").map((line, i) =>
                  line ? <p key={i}>{line}</p> : <br key={i} />
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  };

  return (
    <>
      {/* ナビゲーション */}
      <BreadCrumbs
        breadcrumb={[
          { title: "Home", url: "/" },
          { title: "よくある質問" }
        ]}
      />

      <Title title="よくある質問" />

      {/* Suspense でラップして useSearchParams を利用 */}
      <Suspense fallback={<div>読み込み中...</div>}>
        <SearchParamsWrapper setSelectedCategory={setSelectedCategory} />
      </Suspense>

      {/* Tab選択カテゴリ */}
      <TabBar
        tabs={(Object.entries(categoryIcons) as [QaCategory, string][]).map(([key, icon]) => ({
          title: key,
          icon: icon,
          url: () => setSelectedCategory(key),
          isCurrent: selectedCategory === key
        }))}
      />

      {/* Q&Aリスト表示エリア */}
      <div className={styles.contentWrapper}>{renderContent()}</div>
    </>
  );
};

export default QaPage;