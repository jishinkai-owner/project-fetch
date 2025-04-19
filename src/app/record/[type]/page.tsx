"use client";

import React, { useState, useEffect, useMemo } from "react";
import { useParams } from "next/navigation";
import styles from "../RecordPage.module.scss";
import Link from "next/link";
import RecordCard, { RecordContentDTO } from "@/components/RecordCard/RecordCard";


// 活動タイプとそのアイコン・名前のマッピング
const ACTIVITY_TYPES: { [key: string]: { icon: string, name: string } } = {
  yama: { icon: "🏔️", name: "山行" },
  tabi: { icon: "✈️", name: "旅行" },
  tsuri: { icon: "🎣", name: "釣行" }
};

const RecordListPage: React.FC = () => {
  const params = useParams();
  const recordType = params.type as string;

  const [recordContents, setRecordContents] = useState<RecordContentDTO[]>([]);
  const [selectedYear, setSelectedYear] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);

  // 現在の活動タイプ情報
  const currentActivityType = ACTIVITY_TYPES[recordType] || {
    icon: "📝",
    name: "活動"
  };

  // データ取得
  useEffect(() => {
    const fetchRecordContents = async () => {
      setLoading(true);
      try {
        // 新しいAPIエンドポイントを使用
        const res = await fetch(`/api/record/${recordType}`);
        if (!res.ok) throw new Error(`Failed to fetch ${recordType} record`);
        const data: RecordContentDTO[] = await res.json();
        setRecordContents(data);
      } catch (error) {
        console.error(`Error fetching ${recordType} record:`, error);
      } finally {
        setLoading(false);
      }
    };

    fetchRecordContents();
  }, [recordType]);

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
  const recordThisYear = useMemo(() => {
    if (!selectedYear) return [];
    return recordContents.filter((r) => r.year === selectedYear);
  }, [recordContents, selectedYear]);

  // 場所リスト
  const placeList = useMemo(() => {
    const uniquePlaces = new Set<string>();
    recordThisYear.forEach((r) => {
      if (r.place) uniquePlaces.add(r.place);
    });
    return Array.from(uniquePlaces);
  }, [recordThisYear]);

  return (
    <>
      {/* ナビゲーション */}
      <nav className={styles.breadcrumb}>
        <Link href="/">Home</Link> <span> &gt; </span>
        <Link href="/record">活動記録</Link> <span> &gt; </span>
        <span>{currentActivityType.name}記録</span>
      </nav>
      <h1 className={styles.circleTitle}>{currentActivityType.name}記録</h1>

      {/* カテゴリ選択タブ */}
      <div className={styles.tabContainer}>
        {Object.entries(ACTIVITY_TYPES).map(([type, { icon, name }]) => (
          <Link
            key={type}
            href={`/record/${type}`}
            className={`${styles.tab} ${type === recordType ? styles.activeTab : ''}`}
          >
            <span className={styles.placeIcon}>{icon}</span> {name}記録
          </Link>
        ))}
      </div>

      <div className={styles.contentWrapper}>
        {loading ? (
          <div className={styles.noDataMessage}>
            <p>読み込み中...</p>
          </div>
        ) : years.length === 0 ? (
          <div className={styles.noDataMessage}>
            <p>{currentActivityType.name}記録のデータがありません。</p>
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
              <div className={styles.recordWrapper}>
                {placeList.length === 0 ? (
                  <div className={styles.noDataMessage}>
                    <p>{selectedYear}年度の{currentActivityType.name}記録はありません。</p>
                  </div>
                ) : (
                  placeList.map((place) => (
                    <div key={place} className={styles.placeSection}>
                      <h3 className={styles.placeTitle}>
                        <span className={styles.placeIcon}>{currentActivityType.icon}</span>
                        {place}
                      </h3>
                      <div className={styles.recordCardList}>
                        {recordThisYear
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

export default RecordListPage;
