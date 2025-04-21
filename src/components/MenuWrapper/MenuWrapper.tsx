"use client";

import React, { useEffect, useState } from "react";
import styles from "./MenuWrapper.module.scss";
import Menu from "@/components/Menu/Menu";

interface MenuWrapperProps {
  children: React.ReactNode;
}

const MenuWrapper: React.FC<MenuWrapperProps> = ({ children }) => {
  // 状態管理
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  
  // メニュー開閉を切り替える関数
  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };
  
  // メニューを閉じる関数
  const closeMenu = () => {
    // モバイルの場合のみメニューを閉じる
    if (isMobile) {
      setIsMenuOpen(false);
    }
    // PCの場合は何もしない（メニューを開いたままにする）
  };
  
  // 画面サイズのチェック
  useEffect(() => {
    const checkScreenSize = () => {
      if (typeof window !== 'undefined') {
        const mobile = window.innerWidth <= 900;
        setIsMobile(mobile);
        
        // PCの場合は自動的にメニューを開く
        if (!mobile) {
          setIsMenuOpen(true);
        }
      }
    };
    
    // 初期チェック
    checkScreenSize();
    
    // リサイズイベント
    window.addEventListener('resize', checkScreenSize);
    
    return () => {
      window.removeEventListener('resize', checkScreenSize);
    };
  }, []);
  
  return (
    <div className={styles.container}>
      <div className={styles.page}>
        {children}
      </div>
      
      {/* オーバーレイ（背景タップでメニューを閉じる） - モバイルのみ表示 */}
      {isMenuOpen && isMobile && (
        <div 
          className={styles.overlay} 
          onClick={closeMenu}
          aria-hidden="true"
        />
      )}
      
      {/* ハンバーガーメニューボタン - モバイル向け */}
      <button
        onClick={toggleMenu}
        className={styles.hamburgerButton}
        aria-expanded={isMenuOpen}
        aria-controls="navigation-menu"
        aria-label={isMenuOpen ? "メニューを閉じる" : "メニューを開く"}
      >
        <span className={`${styles.hamburgerIcon} ${isMenuOpen ? styles.open : ''}`} />
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
            <Menu onClick={closeMenu} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default MenuWrapper;