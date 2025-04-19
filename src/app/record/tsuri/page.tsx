"use client";

import React, { useState, useEffect, useMemo } from "react";
import styles from "../RecordPage.module.scss";
import Link from "next/link";
import RecordCard, { RecordContentDTO } from "@/components/RecordCard/RecordCard";
import MainHeader from "@/components/MainHeader/MainHeader";
import TabBar from "@/components/TabBar/TabBar";

const TsuriRecordPage: React.FC = () => {
  const [recordContents, setRecordContents] = useState<RecordContentDTO[]>([]);
  const [selectedYear, setSelectedYear] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);

  // データ取得
  useEffect(() => {
    const fetchRecordContents = async () => {
      setLoading(true);
      try {
        const res = await fetch("/api/recordContents");
        if (!res.ok) throw new Error("Failed to fetch recordContents");
        const data: RecordContentDTO[] = await res.json();
        // 釣行記録のみをフィルタリング
        const tsuriRecords = data.filter(r => r.activityType === "tsuri");
        setRecordContents(tsuriRecords);
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
    <>
      {/* ナビゲーション */}
      <MainHeader breadcrumb={[
        { title: "Home", url: "/" },
        { title: "活動記録", url: "/record" },
        { title: "釣行記録" }
      ]} title="釣行記録" />

      {/* カテゴリ選択タブ */}
      <TabBar tabs={[
        { title: "山行記録", icon: "🏔️", url: "/record/yama" },
        { title: "旅行記録", icon: "✈️", url: "/record/tabi" },
        { title: "釣行記録", icon: "🎣", url: "/record/tsuri", isCurrent: true }
      ]} />

      <div className={styles.contentWrapper}>
        {loading ? (
          <div className={styles.noDataMessage}>
            <p>読み込み中...</p>
          </div>
        ) : years.length === 0 ? (
          <div className={styles.noDataMessage}>
            <p>釣行記録のデータがありません。</p>
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
                    <p>{selectedYear}年度の釣行記録はありません。</p>
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
    </>
  );
};

export default TsuriRecordPage;
