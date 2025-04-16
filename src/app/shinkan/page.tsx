"use client";

import React, { useState, useCallback, useEffect } from "react";
import { useRouter } from "next/navigation";
import styles from "./ShinkanPage.module.scss";
import Link from "next/link";
import Image from "next/image";
import Menu from "@/components/Menu/Menu";

// SNSボタンのプロパティ
interface SnsButtonProps {
  icon: string;
  label: string;
  url: string;
  color: string;
}

// SNSボタンコンポーネント
const SnsButton: React.FC<SnsButtonProps> = ({ icon, label, url, color }) => {
  return (
    <a 
      href={url} 
      target="_blank" 
      rel="noopener noreferrer"
      className={styles.snsButton}
      style={{ backgroundColor: color }}
    >
      <span className={styles.snsIcon}>{icon}</span>
      <span className={styles.snsLabel}>{label}</span>
    </a>
  );
};

const NewcomerPage: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  
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

  return (
    <div className={styles.container} onKeyDown={handleKeyDown}>
      <div className={styles.page}>
        {/* ナビゲーション */}
        <nav className={styles.breadcrumb}>
          <Link href="/">Home</Link> <span> &gt; </span> <span>新歓情報</span>
        </nav>
        
        {/* メインコンテンツ */}
        <div className={styles.newcomerContent}>
          <div className={styles.titleSection}>
            <h1 className={styles.mainTitle}>～新歓情報2025～</h1>
            <div className={styles.titleDecoration}></div>
          </div>
          
          <p className={styles.introText}>
            詳しい活動情報は<br/>
            新歓用各種SNSまたは<br/>
            多分いるであろう下記部室の部員に直接お尋(訪)ねください！
          </p>
          
          {/* SNSセクション */}
          <div className={styles.snsSection}>
            <h2 className={styles.sectionTitle}>公式SNS</h2>
            
            <div className={styles.snsButtons}>
              <SnsButton 
                icon="𝕏" 
                label="Twitter" 
                url="https://x.com/jishinkai" 
                color="#1DA1F2" 
              />
              <SnsButton 
                icon="📷" 
                label="Instagram" 
                url="https://www.instagram.com/jishinkai_tohoku" 
                color="#E1306C" 
              />
            </div>
            
            <div className={styles.snsDescription}>
              <p><strong>・公式Twitter</strong><br/>いままでの山行の記録やQ&Aを投稿しています。</p>
              <p><strong>・新歓用Instagram</strong><br/>新歓の情報やお役立ち情報などを載せています！</p>
            </div>
          </div>
          
          {/* LINEオープンチャットセクション */}
          <div className={styles.lineSection}>
            <h2 className={styles.sectionTitle}>LINEオープンチャット</h2>
            
            <div className={styles.qrCodeWrapper}>
              <Image 
                src="/qr.jpg" 
                alt="LINEオープンチャットのQRコード" 
                width={200} 
                height={200} 
                className={styles.qrCode}
              />
              <div className={styles.qrDescription}>
                <p>QRコードを読み込むと<br/>匿名で参加できます。</p>
                <p className={styles.emphasis}>入部希望の方もこちらから！</p>
              </div>
            </div>
          </div>
          
          {/* 連絡先セクション */}
          <div className={styles.contactSection}>
            <h2 className={styles.sectionTitle}>連絡先</h2>
            <p className={styles.email}>
              jishinkaisk2024☆gmail.com<br/>
              <span className={styles.emailNote}>☆をアットマークに変えてください。</span>
            </p>
          </div>
          
          {/* 部室の場所セクション */}
          <div className={styles.locationSection}>
            <h2 className={styles.sectionTitle}>部室の場所</h2>
            <div className={styles.mapWrapper}>
              <Image 
                src="/map.jpg" 
                alt="部室の場所の地図" 
                width={400} 
                height={300} 
                className={styles.mapImage}
              />
              <p className={styles.locationText}>
                東北大学川内キャンパス仮サークル棟G-3
              </p>
            </div>
          </div>
          
          {/* 締めのメッセージ */}
          <div className={styles.closingSection}>
            <p className={styles.closingMessage}>
              <span className={styles.highlightMessage}>登山未経験者も大歓迎です！</span><br/>
              ご不明な点などありましたら，お気軽にご連絡，ご相談ください。<br/>
              Twitter・Instagram・オープンチャットでDMなど受け付けています！
            </p>
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

export default NewcomerPage;