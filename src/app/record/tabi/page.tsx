"use client";

import React, { useState, useEffect, useMemo, useCallback } from "react";
import styles from "../RecordPage.module.scss";
import Link from "next/link";
import Menu from "@/components/Menu/Menu";
import RecordCard, { RecordContentDTO } from "@/components/RecordCard/RecordCard";

const TabiRecordPage: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [recordContents, setRecordContents] = useState<RecordContentDTO[]>([]);
  const [selectedYear, setSelectedYear] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);

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

  // データ取得
  useEffect(() => {
    const fetchRecordContents = async () => {
      setLoading(true);
      try {
        const res = await fetch("/api/recordContents");
        if (!res.ok) throw new Error("Failed to fetch recordContents");
        const data: RecordContentDTO[] = await res.json();
        // 旅行記録のみをフィルタリング
        const TabiRecords = data.filter(r => r.activityType === "tabi" || r.activityType === "other");
        setRecordContents(TabiRecords);
      } catch (error) {
        console.error("Error fetching recordContents:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchRecordContents();
  }, []);

  // 年度リスト取得（降順）
  const years = useMemo(() => {
    const uniqueYears = new Set<number>();
    recordContents.forEach((r) => {
      if (r.year !== null) {
        uniqueYears.add(r.year);
      }
    });
    return Array.from(uniqueYears).sort((a, b) => b - a); // 降順
  }, [recordContents]);

  // 初期表示で最新年度を選択
  useEffect(() => {
    if (years.length > 0 && selectedYear === null) {
      setSelectedYear(years[0]);
    }
  }, [years, selectedYear]);

  // 選択された年度のレコードを取得
  const recordsThisYear = useMemo(() => {
    if (!selectedYear) return [];
    return recordContents.filter((r) => r.year === selectedYear);
  }, [recordContents, selectedYear]);

  // 場所リスト
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
          <Link href="/">Home</Link> <span> &gt; </span>
          <Link href="/record">活動記録</Link> <span> &gt; </span>
          <span>旅行記録</span>
        </nav>
        <h1 className={styles.circleTitle}>旅行記録</h1>

        {/* カテゴリ選択タブ */}
        <div className={styles.tabContainer}>
          <Link href="/record/yama" className={styles.tab}>
            <span className={styles.placeIcon}>🏔️</span> 山行記録
          </Link>
          <Link href="/record/tabi" className={`${styles.tab} ${styles.activeTab}`}>
            <span className={styles.placeIcon}>✈️</span> 旅行記録
          </Link>
          <Link href="/record/tsuri" className={styles.tab}>
            <span className={styles.placeIcon}>🎣</span> 釣行記録
          </Link>
        </div>

        <div className={styles.contentWrapper}>
          {loading ? (
            <div className={styles.noDataMessage}>
              <p>読み込み中...</p>
            </div>
          ) : years.length === 0 ? (
            <div className={styles.noDataMessage}>
              <p>旅行記録のデータがありません。</p>
            </div>
          ) : (
            <>
              {/* 年度セレクタ */}
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

              {/* 記録一覧表示部分 */}
              {selectedYear && (
                <div className={styles.recordsWrapper}>
                  {placeList.length === 0 ? (
                    <div className={styles.noDataMessage}>
                      <p>{selectedYear}年度の旅行記録はありません。</p>
                    </div>
                  ) : (
                    placeList.map((place) => (
                      <div key={place} className={styles.placeSection}>
                        <h3 className={styles.placeTitle}>
                          <span className={styles.placeIcon}>🎣</span>
                          {place}
                        </h3>
                        <div className={styles.recordCardList}>
                          {recordsThisYear
                            .filter((r) => r.place === place)
                            .map((record) => (
                              <RecordCard record={record} key={record.contentId} />
                            ))}
                        </div>
                      </div>
                    ))
                  )}
                </div>
              )}
            </>
          )}
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
            <Menu />
          </div>
        </div>
      </div>
    </div>
  );
};

export default TabiRecordPage;
