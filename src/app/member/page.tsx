"use client";

import React, { useEffect, useState } from "react";
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

const MemberPage: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [members, setMembers] = useState<Member[]>([]); // メンバー情報の状態管理
  const [loading, setLoading] = useState(true); // ローディング状態

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

  // APIからメンバー情報を取得
  useEffect(() => {
    const fetchMembers = async () => {
      try {
        const response = await fetch("/api/members");
        if (!response.ok) {
          throw new Error("データの取得に失敗しました");
        }
        const data = await response.json();
        setMembers(data);
      } catch (error) {
        console.error("メンバー情報の取得エラー:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchMembers();
  }, []);

  // メニューの開閉
  const toggleMenu = () => {
    setIsMenuOpen((prev) => !prev);
  };

  // 年度ごとのメンバーリストをフィルタ
  const filterMembersByYear = (year: string) => {
    return members.filter((member) => member.year === year);
  };

  // カテゴリごとのデータを表示
  const renderContent = () => {
    if (loading) {
      return <div>読み込み中...</div>;
    }

    let filteredMembers: Member[] = [];
    if (selectedCategory === "2年生") {
      filteredMembers = filterMembersByYear("C3");
    } else if (selectedCategory === "3年生") {
      filteredMembers = filterMembersByYear("C2");
    } else if (selectedCategory === "4年生") {
      filteredMembers = filterMembersByYear("C1");
    }

    if (!filteredMembers.length) {
      return <div>メンバー情報が見つかりません。</div>;
    }

    return (
      <div className={styles.memberList}>
        {filteredMembers.map((member) => (
          <div key={member.id} className={styles.memberCard}>
            <div className={styles.infoContainer}>
              <p>
                <strong>役職:</strong> {member.role}
              </p>
              <p>
                <strong>学部:</strong> {member.major || "不明"}
              </p>
              <p>
                <strong>通称:</strong> {member.nickname}
              </p>
              <p>
                <strong>プロフィール:</strong> {member.profile || "なし"}
              </p>
            </div>
            {/* 左側の画像 */}
            <div className={styles.imageWrapper}>
              <Image 
                src={member.src || "/default-image.png"} // 画像URLを適用
                alt={member.nickname}
                width={1000}
                height={0} 
                style={{ height: "100%", width: "100%", objectFit: "cover" }}
                className={styles.memberImage}
              />
              <div className={styles.triangletop}></div>
              <div className={styles.trianglebuttom}></div>
            </div>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className={styles.pageWrapper}>
      <div className={styles.page}>
        {/* ナビゲーション */}
        <nav className={styles.breadcrumb}>
          <Link href="/">Home</Link> <span> &gt; </span> <span>部員紹介</span>
        </nav>
        <h1 className={styles.circleTitle}>部員紹介</h1>

        {/* Tab選択カテゴリ */}
        <div className={styles.tabContainer}>
          {["2年生", "3年生", "4年生"].map((category) => (
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

export default MemberPage;
