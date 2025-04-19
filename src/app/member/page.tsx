"use client";

import React, { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import styles from "./MemberPage.module.scss";
import Link from "next/link";
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

// YearCategoryに殿堂入りを追加
type YearCategory = "2年生" | "3年生" | "4年生" | "殿堂入り";

// SearchParamsWrapper コンポーネント：URL のクエリパラメータからカテゴリを取得して更新
function SearchParamsWrapper({ setCategory }: { setCategory: (category: YearCategory) => void }) {
  const searchParams = useSearchParams();

  useEffect(() => {
    const categoryFromQuery = searchParams.get("case");
    if (categoryFromQuery) {
      if (["2年生", "3年生", "4年生", "殿堂入り"].includes(categoryFromQuery)) {
        setCategory(categoryFromQuery as YearCategory);
      }
    }
  }, [searchParams, setCategory]);

  return null;
}

// アイコンマッピングに殿堂入りを追加
const yearIcons: Record<YearCategory, string> = {
  "2年生": "🌱",
  "3年生": "🌿",
  "4年生": "🌳",
  "殿堂入り": "🏆" // 殿堂入り用のアイコン
};

const MemberPage: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<YearCategory>("2年生");
  const [members, setMembers] = useState<Member[]>([]);
  const [loading, setLoading] = useState(true);

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
  const filterMembersByYear = (years: string[]) => {
    return members.filter((member) => years.includes(member.year));
  };

  // カテゴリごとのデータを表示するレンダリング関数
  const renderContent = () => {
    if (loading) {
      return <div className={styles.loadingContainer}>がんばって読み込み中 。。。</div>;
    }

    // 学年とyearのマッピングを更新（殿堂入りを追加）
    const yearMapping: Record<YearCategory, string[]> = {
      "2年生": ["C3"],
      "3年生": ["C2"],
      "4年生": ["C1"],
      "殿堂入り": ["C0", "B9", "B8", "B7", "B6", "B5", "B4", "B3", "B2", "B1", "B0", "A9", "A8"]
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
                  width={120}
                  height={120}
                  style={{ objectFit: "cover" }}
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
    <>
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
    </>
  );
};

export default MemberPage;
