"use client";

import React, { useState, useCallback, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import styles from "./QaPage.module.scss";
import Link from "next/link";
import Menu from "@/components/Menu/Menu";
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
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  // デフォルトで「登山編」を表示
  const [selectedCategory, setSelectedCategory] = useState<QaCategory>("登山編");

  const router = useRouter();
  
  // 画面サイズに応じてモバイルモードを検出するためのメモ化されたコールバック
  const checkScreenSize = useCallback(() => {
    const mobile = window.innerWidth <= 900;
    setIsMobile(mobile);
    
    // モバイルの場合はメニューを閉じた状態、PCの場合は開いた状態に
    setIsMenuOpen(!mobile);
  }, []);
  
  // 初期化とリサイズイベントの設定
  useEffect(() => {
    // ブラウザ環境のみで実行
    if (typeof window !== 'undefined') {
      // 初期チェック
      checkScreenSize();
      
      // リサイズイベントにリスナーを追加
      window.addEventListener('resize', checkScreenSize);
      
      // クリーンアップ関数
      return () => {
        window.removeEventListener('resize', checkScreenSize);
      };
    }
  }, [checkScreenSize]);

  // ナビゲーション処理
  const handleNavigate = useCallback((path: string) => {
    router.push(path);
    // モバイルの場合はナビゲーション後にメニューを閉じる
    if (isMobile) {
      setIsMenuOpen(false);
    }
  }, [isMobile, router]);

  // メニュー開閉のトグル
  const toggleMenu = useCallback(() => {
    setIsMenuOpen((prev) => !prev);
  }, []);

  // キーボードでのメニュー操作対応
  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Escape' && isMenuOpen && isMobile) {
      setIsMenuOpen(false);
    }
  }, [isMenuOpen, isMobile]);

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
    <div className={styles.container} onKeyDown={handleKeyDown}>
      <div className={styles.page}>
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
      </div>

      {/* ハンバーガーメニューボタン - モバイル向け */}
      <button 
        className={styles.hamburgerButton} 
        onClick={toggleMenu}
        aria-expanded={isMenuOpen}
        aria-controls="navigation-menu"
        aria-label={isMenuOpen ? "メニューを閉じる" : "メニューを開く"}
      >
        {isMenuOpen ? "×" : "☰"}
      </button>

      {/* メニューコンテナ */}
      <div
        id="navigation-menu"
        className={`${styles.Sidebar} ${isMenuOpen ? styles.open : styles.closed}`}
        role="navigation"
        aria-hidden={!isMenuOpen}
      >
        <div className={styles.PaperContainer}>
          <div className={styles.Menu}>
            <Menu onClick={handleNavigate} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default QaPage;