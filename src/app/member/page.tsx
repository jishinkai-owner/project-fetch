// src/app/member/page.tsx の改善部分

"use client";

import React, { useEffect, useState, Suspense, useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import styles from "./MemberPage.module.scss";
import Link from "next/link";
import Menu from "@/components/Menu/Menu";
import Image from "next/image";

// メンバーの型定義
type Member = {
  id: string;
  year: string;
  role: string;
  major?: string;
  nickname: string;
  profile?: string;
  src?: string; // 画像URL
};

// SearchParamsWrapper コンポーネント：URL のクエリパラメータからカテゴリを取得して更新
function SearchParamsWrapper({ setCategory }: { setCategory: (category: YearCategory) => void }) {
  const searchParams = useSearchParams();

  useEffect(() => {
    const categoryFromQuery = searchParams.get("case");
    if (categoryFromQuery) {
      if (["2年生", "3年生", "4年生"].includes(categoryFromQuery)) {
        setCategory(categoryFromQuery as YearCategory);
      }
    }
  }, [searchParams, setCategory]);

  return null;
}

type YearCategory = "2年生" | "3年生" | "4年生";

const yearIcons: Record<YearCategory, string> = {
  "2年生": "🌱",
  "3年生": "🌿",
  "4年生": "🌳",
};

const MemberPage: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<YearCategory>("2年生");
  const [members, setMembers] = useState<Member[]>([]);
  const [loading, setLoading] = useState(true);

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

  const handleNavigate = useCallback((path: string) => {
    router.push(path);
    // モバイルの場合はナビゲーション後にメニューを閉じる
    if (isMobile) {
      setIsMenuOpen(false);
    }
  }, [isMobile, router]);

  // APIからメンバー情報を取得
  useEffect(() => {
    const fetchMembers = async () => {
      try {
        const response = await fetch("/api/Member");
        if (!response.ok) {
          throw new Error("データの取得に失敗しました");
        }
        const data: Member[] = await response.json();
        setMembers(data);
      } catch (error) {
        console.error("メンバー情報の取得エラー:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchMembers();
  }, []);

  // 年度ごとのメンバーリストをフィルタ
  const filterMembersByYear = (year: string) => {
    return members.filter((member) => member.year === year);
  };

  // カテゴリごとのデータを表示するレンダリング関数
  const renderContent = () => {
    if (loading) {
      return <div className={styles.loadingContainer}>がんばって読み込み中 。。。</div>;
    }

    const yearMapping = {
      "2年生": "C3",
      "3年生": "C2",
      "4年生": "C1"
    };

    let filteredMembers: Member[] = [];
    if (selectedCategory && yearMapping[selectedCategory]) {
      filteredMembers = filterMembersByYear(yearMapping[selectedCategory]);
    }

    if (!filteredMembers.length) {
      return <div className={styles.noDataMessage}>メンバー情報が見つかりません。</div>;
    }

    return (
      <div className={styles.membersWrapper}>
        <div className={styles.memberCardList}>
          {filteredMembers.map((member) => (
            <div key={member.id} className={styles.memberCoutainer}>
              <div className={styles.imageWrapper}>
                <Image 
                  src={member.src || "/default-image.png"}
                  alt={member.nickname}
                  width={1000}
                  height={0}
                  style={{ height: "100%", width: "100%", objectFit: "cover" }}
                  className={styles.memberImage}
                />
                <div className={styles.triangletop}></div>
                <div className={styles.trianglebuttom}></div>
              </div>
              <div className={styles.memberCard}>
                <div className={styles.memberCardHeader}>
                  <h3 className={styles.memberName}>{member.nickname}</h3>
                  <span className={styles.memberMajor}>{member.major || "未設定"}</span>
                </div>

                <div className={styles.memberDetails}>
                  <div className={styles.memberDetail}>
                    <span className={styles.detailLabel}>役職</span>
                    <span className={styles.detailValue}>{member.role}</span>
                  </div>
                  <div className={styles.memberDetail}>
                    <span className={styles.detailLabel}>プロフィール</span>
                    <p className={styles.profileText}>{member.profile || "未設定"}</p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className={styles.container} onKeyDown={handleKeyDown}>
      <div className={styles.page}>
        {/* ナビゲーション */}
        <nav className={styles.breadcrumb}>
          <Link href="/">Home</Link> <span> &gt; </span> <span>部員紹介</span>
        </nav>
        <h1 className={styles.circleTitle}>部員紹介</h1>

        {/* Suspense でラップして useSearchParams を利用 */}
        <Suspense fallback={<div>読み込み中...</div>}>
          <SearchParamsWrapper setCategory={(cat) => setSelectedCategory(cat)} />
        </Suspense>

        {/* Tab選択カテゴリ */}
      <div className={styles.tabContainer}>
        {(Object.keys(yearIcons) as Array<keyof typeof yearIcons>).map((category) => (
          <button
            key={category}
            className={`${styles.tab} ${selectedCategory === category ? styles.activeTab : ""}`}
            onClick={() => setSelectedCategory(category)}
          >
            <span className={styles.tabIcon}>{yearIcons[category]}</span> {category}
          </button>
        ))}
      </div>

        {/* 選択されたカテゴリの内容 */}
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

export default MemberPage;