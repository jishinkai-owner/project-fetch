"use client";

import React, { useState, useEffect, useMemo, useCallback, useTransition, memo, lazy, Suspense } from "react";
import styles from "../RecordPage.module.scss";
import Link from "next/link";
import RecordCard, { RecordContentDTO } from "@/components/RecordCard/RecordCard";

// メニューコンポーネントを遅延ロード
const Menu = lazy(() => import("@/components/Menu/Menu"));

interface YamaRecordClientProps {
  initialRecords: RecordContentDTO[];
  allRecords: RecordContentDTO[];
  years: number[];
  initialYear: number | null;
}

// プレースセクションをメモ化されたコンポーネントとして分離
const PlaceSection = memo(({
  place,
  records,
}: {
  place: string;
  records: RecordContentDTO[];
}) => {
  // このプレースに対応するレコードをメモ化
  const placeRecords = useMemo(() => {
    return records.filter(r => r.place === place);
  }, [records, place]);

  return (
    <div className={styles.placeSection}>
      <h3 className={styles.placeTitle}>
        <span className={styles.placeIcon}>🏔️</span>
        {place}
      </h3>
      <div className={styles.recordCardList}>
        {placeRecords.map((record) => (
          <RecordCard
            record={record}
            key={record.contentId}
          />
        ))}
      </div>
    </div>
  );
});

PlaceSection.displayName = "PlaceSection";

// メインのコンポーネント
const YamaRecordClient: React.FC<YamaRecordClientProps> = ({
  initialRecords,
  allRecords,
  years,
  initialYear
}) => {
  // React Transitionを使用してUIのブロックを防止
  const [isPending, startTransition] = useTransition();

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [selectedYear, setSelectedYear] = useState<number | null>(initialYear);
  const [recordsToShow, setRecordsToShow] = useState<RecordContentDTO[]>(initialRecords);
  const [loading, setLoading] = useState(false);

  // 画面サイズに応じてモバイルモードを検出するためのメモ化されたコールバック
  const checkScreenSize = useCallback(() => {
    if (typeof window === 'undefined') return;

    const mobile = window.innerWidth <= 900;
    setIsMobile(mobile);

    // モバイルの場合はメニューを閉じた状態、PCの場合は開いた状態に
    setIsMenuOpen(!mobile);
  }, []);

  // 初期化とリサイズイベントの設定（デバウンス対応）
  useEffect(() => {
    // ブラウザ環境のみで実行
    if (typeof window !== 'undefined') {
      // 初期チェック
      checkScreenSize();

      // デバウンス処理（パフォーマンス向上）
      let timeoutId: NodeJS.Timeout;
      const handleResize = () => {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(checkScreenSize, 100);
      };

      // リサイズイベントにリスナーを追加
      window.addEventListener('resize', handleResize);

      // クリーンアップ関数
      return () => {
        clearTimeout(timeoutId);
        window.removeEventListener('resize', handleResize);
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

  // 年度変更時の処理
  const handleYearChange = useCallback((e: React.ChangeEvent<HTMLSelectElement>) => {
    const yearValue = Number(e.target.value) || null;

    // 選択した年度を設定
    startTransition(() => {
      setSelectedYear(yearValue);
    });
  }, []);

  // 年度変更時のデータフィルタリング
  useEffect(() => {
    if (selectedYear === initialYear && initialRecords.length > 0) {
      // 初期表示の年度の場合はサーバーから取得したデータを使用
      setRecordsToShow(initialRecords);
    } else if (selectedYear !== null) {
      // 違う年度を選んだ場合、フィルタリング
      setLoading(true);

      // 非同期処理で UI ブロッキングを防止
      const timeoutId = setTimeout(() => {
        startTransition(() => {
          // すでに全データを持っているのでフィルタリングするだけ
          const filtered = allRecords.filter(r => r.year === selectedYear);
          setRecordsToShow(filtered);
          setLoading(false);
        });
      }, 0);

      return () => clearTimeout(timeoutId);
    } else {
      setRecordsToShow([]);
    }
  }, [selectedYear, initialRecords, allRecords, initialYear]);

  // 場所リスト（データが変わった時のみ再計算）
  const placeList = useMemo(() => {
    const uniquePlaces = new Set<string>();
    recordsToShow.forEach((r) => {
      if (r.place) uniquePlaces.add(r.place);
    });
    return Array.from(uniquePlaces);
  }, [recordsToShow]);

  // 遅延ロードするメニューコンポーネント用のフォールバック
  const menuFallback = useMemo(() => (
    <div className={styles.Menu}>
      <div style={{ padding: "20px", textAlign: "center" }}>
        読み込み中...
      </div>
    </div>
  ), []);

  return (
    <>
      {/* ナビゲーション */}
      <nav className={styles.breadcrumb}>
        <Link href="/">Home</Link> <span> &gt; </span>
        <Link href="/record">活動記録</Link> <span> &gt; </span>
        <span>山行記録</span>
      </nav>
      <h1 className={styles.circleTitle}>山行記録</h1>

      {/* カテゴリ選択タブ */}
      <div className={styles.tabContainer}>
        <Link href="/record/yama" className={`${styles.tab} ${styles.activeTab}`}>
          <span className={styles.placeIcon}>🏔️</span> 山行記録
        </Link>
        <Link href="/record/tabi" className={styles.tab}>
          <span className={styles.placeIcon}>✈️</span> 旅行記録
        </Link>
        <Link href="/record/tsuri" className={styles.tab}>
          <span className={styles.placeIcon}>🎣</span> 釣行記録
        </Link>
      </div>

      <div className={styles.contentWrapper}>
        {isPending || loading ? (
          <div className={styles.noDataMessage}>
            <p>読み込み中...</p>
          </div>
        ) : years.length === 0 ? (
          <div className={styles.noDataMessage}>
            <p>山行記録のデータがありません。</p>
          </div>
        ) : (
          <>
            {/* 年度セレクタ */}
            <div className={styles.yearSelector}>
              <select
                onChange={handleYearChange}
                value={selectedYear ?? ""}
                disabled={isPending}
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
                    <p>{selectedYear}年度の山行記録はありません。</p>
                  </div>
                ) : (
                  placeList.map((place) => (
                    <PlaceSection
                      key={place}
                      place={place}
                      records={recordsToShow}
                    />
                  ))
                )}
              </div>
            )}
          </>
        )}
      </div>
    </>
  );
};

export default YamaRecordClient;
