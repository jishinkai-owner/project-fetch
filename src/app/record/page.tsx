// src/app/record/page.tsx

"use client";

import React, { useEffect, useState, useMemo, Suspense, useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import styles from "./RecordPage.module.scss";
import Image from "next/image";
import Link from "next/link";
import Menu from "@/components/Menu/Menu";

// RecordContentDTO 定義
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

// カテゴリと DB の activityType を紐づけるマッピング
const categoryMap = {
  "山行記録": "yama",
  "旅行記録": "tabi",
  "釣行記録": "tsuri",
} as const;

// カテゴリごとのアイコン
const categoryIcons = {
  "山行記録": "🏔️",
  "旅行記録": "✈️",
  "釣行記録": "🎣",
};

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

// 日付をフォーマットする関数
const formatDate = (dateString: string | null): string => {
  if (!dateString) return "-";
  const date = new Date(dateString);
  return `${date.getMonth() + 1}月${date.getDate()}日`;
};

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

  // DB から全 RecordContentDTO を取得
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
  // 年度のソートと初期選択を設定する部分
const years = useMemo(() => {
  const uniqueYears = new Set<number>();
  filteredRecords.forEach((r) => {
    if (r.year !== null) {
      uniqueYears.add(r.year);
    }
  });
  // 降順ソート（新しい年が上）
  return Array.from(uniqueYears).sort((a, b) => b - a);
}, [filteredRecords]);

// カテゴリ選択時に最新年度を自動選択する
useEffect(() => {
  if (selectedCategory && years.length > 0) {
    // 最新年度（配列の先頭）を自動選択
    setSelectedYear(years[0]);
  } else {
    setSelectedYear(null);
  }
}, [selectedCategory, years]);



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

  // 記録をクリックしたときの処理
  const handleRecordClick = useCallback((filename: string | null) => {
    if (filename) {
      router.push(`/record/${encodeURIComponent(filename)}`);
    }
  }, [router]);

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
          <div className={styles.contentWrapper}>
            {/* 年度ドロップダウン */}
            {years.length === 0 ? (
              <div className={styles.noDataMessage}>
                <p>まだ {selectedCategory} のデータがありません。</p>
              </div>
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

            {/* 選択された年度があれば、場所ごとにグループ化して表示 */}
            {selectedYear && (
              <div className={styles.recordsWrapper}>
                {placeList.map((place) => (
                  <div key={place} className={styles.placeSection}>
                    <h3 className={styles.placeTitle}>
                      <span className={styles.placeIcon}>{categoryIcons[selectedCategory]}</span>
                      {place}
                    </h3>
                    <div className={styles.recordCardList}>
                      {recordsThisYear
                        .filter((r) => r.place === place)
                        .map((record) => (
                          <div 
                            key={record.contentId}
                            className={styles.recordCard}
                            onClick={() => handleRecordClick(record.filename)}
                          >
                            <div className={styles.recordCardHeader}>
                              <h4 className={styles.recordTitle}>{record.title || "記録"}</h4>
                              <span className={styles.recordDate}>{formatDate(record.date)}</span>
                            </div>
                            {record.details && (
                              <p className={styles.recordPreview}>
                                {record.details.length > 60 
                                  ? `${record.details.substring(0, 60)}...` 
                                  : record.details}
                              </p>
                            )}
                            <div className={styles.cardFooter}>
                              <span className={styles.readMore}>詳細を見る</span>
                            </div>
                          </div>
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