"use client";

import React, { useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import styles from "./QaPage.module.scss";
import Link from "next/link";
import { qaData, QaCategory } from "./qaData";

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
      <nav className={styles.breadcrumb}>
        <Link href="/">Home</Link> <span> &gt; </span> <span>よくある質問</span>
      </nav>
      <h1 className={styles.circleTitle}>よくある質問</h1>

      {/* Suspense で useSearchParams をラップ */}
      <Suspense fallback={<div>読み込み中...</div>}>
        <SearchParamsWrapper setSelectedCategory={setSelectedCategory} />
      </Suspense>

      {/* タブ選択カテゴリ */}
      <div className={styles.tabContainer}>
        {Object.keys(qaData).map((category) => (
          <button
            key={category}
            className={`${styles.tab} ${selectedCategory === category ? styles.activeTab : ""}`}
            onClick={() => setSelectedCategory(category as QaCategory)}
          >
            <span className={styles.tabIcon}>{categoryIcons[category as QaCategory]}</span>
            {category}
          </button>
        ))}
      </div>

      {/* Q&Aリスト表示エリア */}
      <div className={styles.contentWrapper}>{renderContent()}</div>
    </>
  );
};

export default QaPage;