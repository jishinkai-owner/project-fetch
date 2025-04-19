"use client";

import React, { useState, useEffect, useMemo, useCallback, useTransition, memo } from "react";
import styles from "../RecordPage.module.scss";
import Link from "next/link";
import RecordCard, { RecordContentDTO } from "@/components/RecordCard/RecordCard";
import MainHeader from "@/components/MainHeader/MainHeader";
import TabBar from "@/components/TabBar/TabBar";

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

  const [selectedYear, setSelectedYear] = useState<number | null>(initialYear);
  const [recordsToShow, setRecordsToShow] = useState<RecordContentDTO[]>(initialRecords);
  const [loading, setLoading] = useState(false);

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

  return (
    <>
      {/* ナビゲーション */}
      <MainHeader breadcrumb={[
        { title: "Home", url: "/" },
        { title: "活動記録", url: "/record" },
        { title: "山行記録" }
      ]} title="山行記録" />

      {/* カテゴリ選択タブ */}
      <TabBar tabs={[
        { title: "山行記録", icon: "🏔️", url: "/record/yama", isCurrent: true },
        { title: "旅行記録", icon: "✈️", url: "/record/tabi" },
        { title: "釣行記録", icon: "🎣", url: "/record/tsuri" }
      ]} />

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
