"use client";

import React, { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import styles from "./MemberPage.module.scss";
import { members } from "./MemberDate";
import Link from "next/link";
import Menu from "@/components/Menu/Menu";
import Image from "next/image";

const MemberPage: React.FC = () => {
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
    if (selectedCategory === "2年生") {
      return (
        <div className={styles.memberList}>
          {members.map((member) => (
            <div key={member.id} className={styles.memberCard}>
              <div className={styles.infoContainer}>
                <p>
                  <strong>役職:</strong> {member.title}
                </p>
                <p>
                  <strong>学部:</strong> {member.name}
                </p>
                <p>
                  <strong>通称:</strong> {member.hobbies}
                </p>
                <p>
                  <strong>プロフィール:</strong> {member.profile}
                </p>
              </div>
              {/* 左側の画像 */}
              <div className={styles.imageWrapper}>
                <Image 
                  src={member.image}
                  alt={member.name}
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
    } else if (selectedCategory === "3年生") {
      return <div>3年生のメンバー紹介</div>;
    } else if (selectedCategory === "4年生") {
      return <div>4年生のメンバー紹介</div>;
    } else if (selectedCategory === "殿堂入り") {
        return <div>殿堂入りのメンバー紹介</div>;
    } else {
      return <div>カテゴリを選択してください</div>;
    }
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
          {["2年生", "3年生", "4年生","殿堂入り"].map((category) => (
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
