"use client";

import React, { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import styles from "./QaPage.module.scss";
import Link from "next/link";
import Menu from "@/components/Menu/Menu";

const QaPage: React.FC = () => {

  const [isMenuOpen, setIsMenuOpen] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const searchParams = useSearchParams();
  const selectedCategoryFromQuery = searchParams.get("case");

  const router = useRouter();
  const handleNavigate = (path: string) => {
    router.push(path);
  };

  // 初期値としてクエリパラメータを利用
  useEffect(() => {
    if (selectedCategoryFromQuery) {
      setSelectedCategory(selectedCategoryFromQuery);
    }
  }, [selectedCategoryFromQuery]);

  const toggleMenu = () => {
    setIsMenuOpen((prev) => !prev); // トグルで開閉を切り替え
  };

  const renderContent = () => {
    if (selectedCategory === "登山編") {
      return <div>山の質問</div>;
    } else if (selectedCategory === "釣り編") {
      return <div>釣りの質問</div>;
    } else if (selectedCategory === "旅行編") {
      return <div>旅行の質問</div>;
    } else if (selectedCategory === "その他編") {
        return <div>他の質問</div>;
    } else {
      return <div>カテゴリを選択してください</div>;
    }
  };

  return (
    <div className={styles.pageWrapper}>
      <div className={styles.page}>
        {/* ナビゲーション */}
        <nav className={styles.breadcrumb}>
          <Link href="/">Home</Link> <span> &gt; </span> <span>よくある質問</span>
        </nav>
        <h1 className={styles.circleTitle}>よくある質問</h1>

        {/* Tab選択カテゴリ */}
        <div className={styles.tabContainer}>
          {["登山編", "釣り編", "旅行編","その他編"].map((category) => (
            <button
              key={category}
              className={`${styles.tab} ${
                selectedCategory === category ? styles.activeTab : ""
              }`}
              onClick={() => setSelectedCategory(category)}
            >
              {category}
            </button>
          ))}
        </div>

        {/* 選択されたカテゴリの内容 */}
        <div className={styles.contentContainer}>{renderContent()}</div>

      </div>

      {/* ハンバーガーボタン */}
      <button className={styles.hamburgerButton} onClick={toggleMenu}>
        ☰
      </button>

      {/* メニューコンテナ */}
      <div 
        className={`${styles.paperContainer} ${
          isMenuOpen ? styles.open : styles.closed
        }`}>
        <Menu onClick={handleNavigate} />
      </div>
    </div>
  );
};

export default QaPage;
