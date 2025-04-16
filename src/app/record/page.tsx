// src/app/record/page.tsx の修正

"use client";

import React, { useEffect, useState, useMemo, Suspense, useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import styles from "./RecordPage.module.scss";
import Image from "next/image";
import Link from "next/link";
import Menu from "@/components/Menu/Menu";

// ★ ActivityRecord → RecordContentDTO にリネーム
interface RecordContentDTO {
  contentId: number;
  recordId: number;
  year: number | null;
  place: string | null;
  activityType: string | null;
  date: string | null;
  details: string | null;
  title: string | null;
  filename: string | null;
}

// ★ カテゴリと DB の activityType を紐づけるマッピング
const categoryMap = {
  "山行記録": "yama",
  "旅行記録": "travel",
  "釣行記録": "fishing",
} as const;

// SearchParamsWrapper コンポーネント: URL のクエリパラメータからカテゴリを取得して更新
function SearchParamsWrapper({ setCategory }: { setCategory: (category: keyof typeof categoryMap) => void }) {
  const searchParams = useSearchParams();

  useEffect(() => {
    const categoryFromQuery = searchParams.get("case") as keyof typeof categoryMap | null;
    if (categoryFromQuery && categoryMap[categoryFromQuery]) {
      setCategory(categoryFromQuery);
    }
  }, [searchParams, setCategory]);

  return null;
}

const RecordPage: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<keyof typeof categoryMap | null>(null);
  const [recordContents, setRecordContents] = useState<RecordContentDTO[]>([]);
  const [selectedYear, setSelectedYear] = useState<number | null>(null);

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

  // ★ DB から全 RecordContentDTO を取得
  useEffect(() => {
    const fetchRecordContents = async () => {
      try {
        const res = await fetch("/api/recordContents");
        if (!res.ok) throw new Error("Failed to fetch recordContents");
        const data: RecordContentDTO[] = await res.json();
        setRecordContents(data);
      } catch (error) {
        console.error("Error fetching recordContents:", error);
      }
    };
    fetchRecordContents();
  }, []);

  // カテゴリ変更時は年度をリセット
  useEffect(() => {
    setSelectedYear(null);
  }, [selectedCategory]);

  // 選択されたカテゴリに対応するレコードのみ抽出
  const filteredRecords = useMemo(() => {
    if (!selectedCategory) return [];
    return recordContents.filter((r) => r.activityType === categoryMap[selectedCategory]);
  }, [recordContents, selectedCategory]);

  // filteredRecords から有効な年度 (number) の一覧を生成
  const years = useMemo(() => {
    const uniqueYears = new Set<number>();
    filteredRecords.forEach((r) => {
      if (r.year !== null) {
        uniqueYears.add(r.year);
      }
    });
    return Array.from(uniqueYears).sort((a, b) => a - b);
  }, [filteredRecords]);

  // 選択された年度のレコードのみ抽出
  const recordsThisYear = useMemo(() => {
    if (!selectedYear) return [];
    return filteredRecords.filter((r) => r.year === selectedYear);
  }, [filteredRecords, selectedYear]);

  // place ごとにまとめるため、ユニークな place を抽出
  const placeList = useMemo(() => {
    const uniquePlaces = new Set<string>();
    recordsThisYear.forEach((r) => {
      if (r.place) uniquePlaces.add(r.place);
    });
    return Array.from(uniquePlaces);
  }, [recordsThisYear]);

  return (
    <div className={styles.container} onKeyDown={handleKeyDown}>
      <div className={styles.page}>
        {/* ナビゲーション */}
        <nav className={styles.breadcrumb}>
          <Link href="/">Home</Link> <span> &gt; </span> <span>活動記録</span>
        </nav>
        <h1 className={styles.circleTitle}>活動記録</h1>

        {/* Suspense でラップして useSearchParams を利用 */}
        <Suspense fallback={<div>読み込み中...</div>}>
          <SearchParamsWrapper setCategory={setSelectedCategory} />
        </Suspense>

        {/* カテゴリ選択 - PCサイズ向け */}
        <div className={styles.categoryContainer}>
          {Object.keys(categoryMap).map((category) => (
            <div
              key={category}
              className={`${styles.categoryCard} ${
                selectedCategory === category ? styles.activeCard : styles.inactiveCard
              }`}
              onClick={() => setSelectedCategory(category as keyof typeof categoryMap)}
            >
              <Image
                src={`/${category}.webp`}
                alt={category}
                width={300}
                height={200}
                className={styles.categoryImage}
              />
              <div className={styles.categoryText}>{category}</div>
            </div>
          ))}
        </div>

        {/* タブ選択 - モバイルサイズ向け */}
        <div className={styles.tabContainer}>
          {Object.keys(categoryMap).map((category) => (
            <button
              key={category}
              className={`${styles.tab} ${selectedCategory === category ? styles.activeTab : ""}`}
              onClick={() => setSelectedCategory(category as keyof typeof categoryMap)}
            >
              {category}
            </button>
          ))}
        </div>

        {/* カテゴリが選択されている場合 */}
        {selectedCategory && (
          <div>
            {/* 年度ドロップダウン */}
            {years.length === 0 ? (
              <p>まだ {selectedCategory} のデータがありません。</p>
            ) : (
              <div className={styles.yearSelector}>
                <select
                  onChange={(e) => setSelectedYear(Number(e.target.value) || null)}
                  value={selectedYear ?? ""}
                >
                  <option value="">年度を選択</option>
                  {years.map((year) => (
                    <option key={year} value={year}>
                      {year}年度
                    </option>
                  ))}
                </select>
              </div>
            )}

            {/* 選択された年度があれば、場所ごとにボタンを並べる */}
            {selectedYear && (
              <div className={styles.recordContainer}>
                {placeList.map((place) => (
                  <div key={place}>
                    <h3>{place}</h3>
                    <div className={styles.recordButtons}>
                      {recordsThisYear
                        .filter((r) => r.place === place)
                        .map((record) => (
                          <button
                            key={record.contentId}
                            className={styles.recordButton}
                            onClick={() => {
                              if (record.filename) {
                                router.push(`/record/${encodeURIComponent(record.filename)}`);
                              }
                            }}
                          >
                            {record.title || "No Title"}
                          </button>
                        ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
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

export default RecordPage;