"use client";

import React, { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import styles from "./RecordPage.module.scss";
import Image from "next/image";
import Link from "next/link";
import Menu from "@/components/Menu/Menu";

const RecordPage: React.FC = () => {
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
    switch (selectedCategory) {
      case "山行記録":
        return <div>
          <p>山行記録の内容がここに表示されます。</p>
            {/* 年度セレクター */}
          <div className={styles.yearSelector}>
            <select>
              <option>2024年度</option>
              <option>2023年度</option>
              <option>2022年度</option>
            </select>
          </div>

          {/* 記録ボタン */}
          <div className={styles.recordContainer}>
            <h3>第1回山行 磐梯山</h3>
            <div className={styles.recordButtons}>
              {["TATSUHIRO 編", "SOMA 編", "MORIO 編", "TAKEMINE 編"].map((text, index) => (
                <button key={index} className={styles.recordButton}>
                  {text}
                </button>
              ))}
            </div>
            <h3>第2回山行 男体山</h3>
            <div className={styles.recordButtons}>
              {["TATSUHIRO 編", "SOMA 編", "MORIO 編", "TAKEMINE 編"].map((text, index) => (
                <button key={index} className={styles.recordButton}>
                  {text}
                </button>
              ))}
            </div>
            <h3>第3回山行 岩手山</h3>
            <div className={styles.recordButtons}>
              {["TATSUHIRO 編", "SOMA 編", "MORIO 編", "TAKEMINE 編"].map((text, index) => (
                <button key={index} className={styles.recordButton}>
                  {text}
                </button>
              ))}
            </div>
            <h3>第4回山行 鳥海山</h3>
            <div className={styles.recordButtons}>
              {["TATSUHIRO 編", "SOMA 編", "MORIO 編", "TAKEMINE 編"].map((text, index) => (
                <button key={index} className={styles.recordButton}>
                  {text}
                </button>
              ))}
            </div>
            <h3>第5回山行 燧ヶ岳</h3>
            <div className={styles.recordButtons}>
              {["TATSUHIRO 編", "SOMA 編", "MORIO 編", "TAKEMINE 編"].map((text, index) => (
                <button key={index} className={styles.recordButton}>
                  {text}
                </button>
              ))}
            </div>
            <h3>長期山行 幻の八ヶ岳</h3>
            <div className={styles.recordButtons}>
              {["EISHIN CAR 組","C3 レンタカー組"].map((text, index) => (
                <button key={index} className={styles.recordButton}>
                  {text}
                </button>
              ))}
            </div>
          </div>
        </div>;
      case "旅行記録":
        return <div>旅行記録の内容がここに表示されます。</div>;
      case "釣行記録":
        return <div>釣行記録の内容がここに表示されます。</div>;
      default:
        return <div>どの記録が見たいかな？選択してね！</div>;
    }
  };

  return (
    <div className={styles.pageWrapper}>
      <div className={styles.page}>
        {/* ナビゲーション */}
        <nav className={styles.breadcrumb}>
          <Link href="/">Home</Link> <span> &gt; </span> <span>活動記録</span>
        </nav>
        <h1 className={styles.circleTitle}>活動記録</h1>

        {/* 画像選択カテゴリ */}
        <div className={styles.categoryContainer}>
          {["山行記録", "旅行記録", "釣行記録"].map((category, index) => (
            <div
              key={index}
              className={`${styles.categoryCard} ${
                selectedCategory === category ? styles.activeCard : styles.inactiveCard
              }`}
              onClick={() => setSelectedCategory(category)}
            >
              <Image
                src={`/${category}.webp`}
                alt={category}
                width={300}
                height={200}
                className={styles.categoryImage}
              />
              <div className={styles.categoryText}>{category}</div>
            </div>
          ))}
        </div>

        {/* Tab選択カテゴリ */}
        <div className={styles.tabContainer}>
          {["山行記録", "旅行記録", "釣行記録"].map((category) => (
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

export default RecordPage;
