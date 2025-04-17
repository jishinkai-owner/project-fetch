"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import styles from "./page.module.scss";
import Image from "next/image";
import Climbing from "@/components/Climbing/Climbing";
import Fishing from "@/components/Fishing/Fishing";
import Traveling from "@/components/Traveling/Traveling";
import Menu from "@/components/Menu/Menu";
import SNSHolder from "@/components/SNSHolder/SNSHolder"; 

const Page: React.FC = () => {
  // デスクトップとモバイルでの挙動を区別するためのstate
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const router = useRouter();

  // 画面サイズに応じてモバイルモードを検出するためのメモ化されたコールバック
  const checkScreenSize = useCallback(() => {
    const mobile = window.innerWidth <= 768;
    setIsMobile(mobile);
    
    // モバイルの場合はメニューを閉じた状態、PCの場合は開いた状態に
    setIsMenuOpen(!mobile);
  }, []);

  // page.tsxのuseEffectに追加するコード

const calculateSidebarWidth = () => {
  // ビューポートの高さと幅を取得
  const viewportHeight = window.innerHeight;
  const viewportWidth = window.innerWidth;
  
  // サイドバーの要素を取得 - 型アサーションを使用
  const sidebar = document.querySelector(`.${styles.Sidebar}`) as HTMLElement | null;
  const page = document.querySelector(`.${styles.page}`) as HTMLElement | null;
  
  // PCサイズでのみ計算する（900px以上）
  if (viewportWidth >= 900) {
    let sidebarWidth = 350; // デフォルト値
    
    // 高さに応じてアスペクト比からサイドバー幅を計算
    if (viewportHeight <= 700 && viewportHeight > 600) {
      // アスペクト比 7.5/16 で計算
      sidebarWidth = Math.max(200, Math.min(350, Math.floor(viewportHeight * (7.5/16))));
    } else if (viewportHeight <= 600 && viewportHeight > 500) {
      // さらに小さい画面用の計算
      sidebarWidth = Math.max(180, Math.min(250, Math.floor(viewportHeight * (7/16))));
    } else if (viewportHeight <= 500) {
      // 極端に小さい画面用の計算
      sidebarWidth = Math.max(150, Math.min(200, Math.floor(viewportHeight * (6.5/16))));
    }
    
    // サイドバーにスタイルを適用
    if (sidebar) {
      sidebar.style.width = `${sidebarWidth}px`;
    }
    
    // メインページの幅も調整
    if (page) {
      page.style.maxWidth = `calc(100% - ${sidebarWidth}px)`;
    }
  } else {
    // モバイルサイズの場合はリセット
    if (sidebar) {
      sidebar.style.width = '';
    }
    if (page) {
      page.style.maxWidth = '';
    }
  }
};

// setViewHeightメソッドを定義
const setViewHeight = () => {
  const vh = window.innerHeight * 0.01;
  document.documentElement.style.setProperty('--vh', `${vh}px`);
};

useEffect(() => {
  // 初期化
  setViewHeight();
  calculateSidebarWidth();
  
  // イベントリスナーを追加
  window.addEventListener('resize', setViewHeight);
  window.addEventListener('resize', calculateSidebarWidth);
  window.addEventListener('orientationchange', setViewHeight);
  window.addEventListener('orientationchange', calculateSidebarWidth);
  
  // クリーンアップ関数
  return () => {
    window.removeEventListener('resize', setViewHeight);
    window.removeEventListener('resize', calculateSidebarWidth);
    window.removeEventListener('orientationchange', setViewHeight);
    window.removeEventListener('orientationchange', calculateSidebarWidth);
  };
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

  return (
    <div className={styles.container} onKeyDown={handleKeyDown}>
      <div className={styles.page}>
        <div className={styles.header}>
          <Image 
            src="/jishinkaiboard.svg" 
            alt="自親会の看板" 
            className={styles.board}
            width={500} 
            height={160} 
            priority 
          ></Image>
        </div>

        <div className={styles.recordcontainer}>
          <div className={styles.Climbing}><Climbing /></div>
          <div className={styles.Traveling}><Traveling /></div>
          <div className={styles.Fishing}><Fishing /></div>
          <div className={styles.SNSHolder}>
            <SNSHolder 
              twitterUrl = "https://x.com/jishinkai" 
              instagramUrl = "https://www.instagram.com/jishinkai_tohoku" 
            />
          </div>
        </div>
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

export default Page;