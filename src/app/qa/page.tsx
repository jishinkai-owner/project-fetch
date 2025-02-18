"use client";

import React, { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import styles from "./QaPage.module.scss";
import Link from "next/link";
import Menu from "@/components/Menu/Menu";
import { qaData, QaCategory } from "./qaData"; // 型も一緒にインポート

const QaPage: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(true);
  const searchParams = useSearchParams();
  const selectedCategoryFromQuery = searchParams.get("case") as QaCategory | null;
  const [selectedCategory, setSelectedCategory] = useState<QaCategory>(selectedCategoryFromQuery || "登山編"); // 型を指定

  const router = useRouter();
  const handleNavigate = (path: string) => {
    router.push(path);
  };

  const toggleMenu = () => {
    setIsMenuOpen((prev) => !prev);
  };

  const renderContent = () => {
    if (!selectedCategory) return <div>カテゴリを選択してください。</div>;

    const categoryData = qaData[selectedCategory]; // 型エラーがなくなる！
    if (!categoryData) return <div>該当するQ&Aがありません。</div>;

    return (
      <div className={styles.qaList}>
        {categoryData.map((qa, index) => (
          <div key={index} className={styles.qaItem}>
            <p className={styles.question}><strong>Q: {qa.question}</strong></p>
            <p className={styles.answer}>
              {qa.answer.split("\n").map((line, i) => <span key={i}>{line}<br/></span>)}
            </p>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className={styles.pageWrapper}>
      <div className={styles.page}>
        <nav className={styles.breadcrumb}>
          <Link href="/">Home</Link> <span> &gt; </span> <span>よくある質問</span>
        </nav>
        <h1 className={styles.circleTitle}>よくある質問</h1>

        <div className={styles.tabContainer}>
          {Object.keys(qaData).map((category) => (
            <button
              key={category}
              className={`${styles.tab} ${selectedCategory === category ? styles.activeTab : ""}`}
              onClick={() => setSelectedCategory(category as QaCategory)} // 型をキャスト
            >
              {category}
            </button>
          ))}
        </div>

        <div className={styles.contentContainer}>{renderContent()}</div>
      </div>

      <button className={styles.hamburgerButton} onClick={toggleMenu}>☰</button>
      <div className={`${styles.paperContainer} ${isMenuOpen ? styles.open : styles.closed}`}>
        <Menu onClick={handleNavigate} />
      </div>
    </div>
  );
};

export default QaPage;
