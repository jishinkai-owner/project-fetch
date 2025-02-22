"use client";

import React, { useEffect, useState, useMemo, Suspense } from "react";
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
  const [isMenuOpen, setIsMenuOpen] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<keyof typeof categoryMap | null>(null);
  const [recordContents, setRecordContents] = useState<RecordContentDTO[]>([]);
  const [selectedYear, setSelectedYear] = useState<number | null>(null);

  const router = useRouter();

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
    <div className={styles.pageWrapper}>
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

        {/* カテゴリ選択 */}
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

      {/* ハンバーガーボタン */}
      <button className={styles.hamburgerButton} onClick={() => setIsMenuOpen((prev) => !prev)}>
        ☰
      </button>

      {/* メニューコンテナ */}
      <div className={`${styles.paperContainer} ${isMenuOpen ? styles.open : styles.closed}`}>
        <Menu onClick={router.push} />
      </div>
    </div>
  );
};

export default RecordPage;
