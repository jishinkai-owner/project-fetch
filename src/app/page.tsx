"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import styles from "./page.module.scss";
import Image from "next/image";
import Climbing from "@/components/Climbing/Climbing";
import Fishing from "@/components/Fishing/Fishing";
import Traveling from "@/components/Traveling/Traveling";
import Menu from "@/components/Menu/Menu";

const Page: React.FC = () => {
  // デスクトップとモバイルでの挙動を区別するためのstate
  const [isMenuOpen, setIsMenuOpen] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const router = useRouter();

  // 画面サイズに応じてモバイルモードを検出
  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth <= 768);
      // モバイルの場合はメニューを閉じた状態、PCの場合は開いた状態に
      setIsMenuOpen(window.innerWidth > 768);
    };
    
    // 初期チェック
    checkScreenSize();
    
    // リサイズイベントにリスナーを追加
    window.addEventListener('resize', checkScreenSize);
    
    // クリーンアップ関数
    return () => {
      window.removeEventListener('resize', checkScreenSize);
    };
  }, []);

  const handleNavigate = (path: string) => {
    router.push(path);
    // モバイルの場合はナビゲーション後にメニューを閉じる
    if (isMobile) {
      setIsMenuOpen(false);
    }
  };

  const toggleMenu = () => {
    setIsMenuOpen((prev) => !prev);
  };

  return (
    <div className={styles.container}>
      <div className={styles.page}>
        {/* ヘッダーエリア全体をグレーの背景に */}
        <div className={styles.headerArea}>
          <div className={styles.boardContainer}>
            <Image 
              src="/jishinkaiboard.svg" 
              alt="自親会の看板" 
              className={styles.board}
              width={500} 
              height={160} 
              priority 
            />
          </div>
        </div>

        <div className={styles.recordcontainer}>
          <div className={styles.Climbing}><Climbing/></div>
          <div className={styles.Traveling}><Traveling/></div>
          <div className={styles.Fishing}><Fishing/></div>
        </div>
      </div>

      <button 
        className={styles.hamburgerButton} 
        onClick={toggleMenu}
        aria-expanded={isMenuOpen}
        aria-controls="navigation-menu"
        aria-label={isMenuOpen ? "メニューを閉じる" : "メニューを開く"}
      >
        {isMenuOpen ? "×" : "☰"}
      </button>

      <div 
        id="navigation-menu"
        className={`${styles.paperContainer} ${styles.darkWood} ${isMenuOpen ? styles.open : styles.closed}`}
      >
        <Menu onClick={handleNavigate} />
      </div>
    </div>
  );
};

export default Page;