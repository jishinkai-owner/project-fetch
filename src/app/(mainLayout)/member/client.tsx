"use client";

import React, { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import styles from "./MemberPage.module.scss";
import Image from "next/image";
import TabBar from "@/components/TabBar/TabBar";
import BreadCrumbs from "@/components/BreadCrumbs/BreadCrumbs";
import Title from "@/components/Title/Title";
import { MemberDTO } from "./page";

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

const MemberClient: React.FC<{
  members: MemberDTO[];
}> = ({ members }) => {
  const [selectedCategory, setSelectedCategory] = useState<YearCategory>("2年生");

  // 年度ごとのメンバーリストをフィルタ
  const filterMembersByYear = (years: string[]) => {
    return members.filter((member) => years.includes(member.year));
  };

  // カテゴリごとのデータを表示するレンダリング関数
  const renderContent = () => {
    // 学年とyearのマッピングを更新（殿堂入りを追加）
    const yearMapping: Record<YearCategory, string[]> = {
      "2年生": ["C3"],
      "3年生": ["C2"],
      "4年生": ["C1"],
      "殿堂入り": ["C0", "B9", "B8", "B7", "B6", "B5", "B4", "B3", "B2", "B1", "B0", "A9", "A8"]
    };

    let filteredMembers: MemberDTO[] = [];
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
      <BreadCrumbs
        breadcrumb={[
          { title: "Home", url: "/" },
          { title: "部員紹介" }
        ]}
      />

      <Title title="部員紹介" />

      {/* Suspense でラップして useSearchParams を利用 */}
      <Suspense fallback={<div>読み込み中...</div>}>
        <SearchParamsWrapper setCategory={setSelectedCategory} />
      </Suspense>

      {/* Tab選択カテゴリ */}
      <TabBar
        tabs={(Object.entries(yearIcons) as [YearCategory, string][]).map(([key, icon]) => ({
          title: key,
          icon: icon,
          url: () => setSelectedCategory(key),
          isCurrent: selectedCategory === key
        }))}
      />

      {/* 選択されたカテゴリの内容 */}
      <div className={styles.contentWrapper}>{renderContent()}</div>
    </>
  );
};

export default MemberClient;
