"use client";

import React, { useState, useEffect, useMemo, useCallback, useTransition, memo } from "react";
import styles from "./RecordPage.module.scss";
import RecordCard, { RecordContentDTO } from "@/components/RecordCard/RecordCard";
import { useSearchParams, useRouter } from "next/navigation";
import activityTypes, { ActivityType } from "./activityTypes";
import BreadCrumbs from "@/components/BreadCrumbs/BreadCrumbs";
import TabBar from "@/components/TabBar/TabBar";
import Title from "@/components/Title/Title";

interface RecordClientProps {
  initialRecords: RecordContentDTO[];
  allRecords: RecordContentDTO[];
  years: number[];
  initialYear: number | null;
  activityType: ActivityType;
}

// 日付順に並び替える関数
const sortByDate = (records: RecordContentDTO[]): RecordContentDTO[] => {
  return [...records].sort((a, b) => {
    // 日付がない場合は後ろに配置
    if (!a.date) return 1;
    if (!b.date) return -1;

    // 同じ日付の場合、タイトルで「○日目」「前編」「中編」「後編」の順序をソート
    if (a.date === b.date) {
      // タイトルから順序を抽出してソート
      const extractOrder = (title: string | null): number => {
        if (!title) return 999; // タイトルがない場合は最後に
        
        // 漢数字を数字に変換する関数
        const kanjiToNumber = (kanji: string): number => {
          const kanjiMap: { [key: string]: number } = {
            '一': 1, '二': 2, '三': 3, '四': 4, '五': 5,
            '六': 6, '七': 7, '八': 8, '九': 9, '十': 10
          };
          return kanjiMap[kanji] || 0;
        };
        
        // 「○日目」パターンをチェック（1日目、2日目、3日目...の順）
        const dayMatch = title.match(/(\d+)日目/);
        if (dayMatch) {
          return parseInt(dayMatch[1], 10);
        }
        
        // 「一日目」「二日目」「三日目」などの漢数字パターンをチェック
        const kanjiDayMatch = title.match(/([一二三四五六七八九十])日目/);
        if (kanjiDayMatch) {
          return kanjiToNumber(kanjiDayMatch[1]);
        }
        
        // 「前編」「中編」「後編」パターンをチェック
        if (title.includes('前編')) return 1;
        if (title.includes('中編')) return 2;
        if (title.includes('後編')) return 3;
        
        // 「その1」「その2」「その3」パターンをチェック
        const sonoMatch = title.match(/その(\d+)/);
        if (sonoMatch) {
          return parseInt(sonoMatch[1], 10);
        }
        
        // 「第1話」「第2話」「第3話」パターンをチェック
        const daiMatch = title.match(/第(\d+)話/);
        if (daiMatch) {
          return parseInt(daiMatch[1], 10);
        }
        
        // 「PART1」「PART2」「PART3」パターンをチェック（大文字小文字問わず）
        const partMatch = title.match(/part\s*(\d+)/i);
        if (partMatch) {
          return parseInt(partMatch[1], 10);
        }
        
        return 999; // どのパターンにも当てはまらない場合は最後に
      };

      const orderA = extractOrder(a.title);
      const orderB = extractOrder(b.title);
      
      if (orderA !== 999 && orderB !== 999) {
        return orderA - orderB; // 順序通りにソート
      }
      
      // 順序が抽出できない場合はタイトルの文字列比較
      return (a.title || '').localeCompare(b.title || '');
    }

    // 日付を比較（降順 - 新しい日付が上に）
    return new Date(b.date).getTime() - new Date(a.date).getTime();
  });
};

// プレースセクションをメモ化されたコンポーネントとして分離
const PlaceSection = memo(({
  place,
  records,
  activityType,
}: {
  place: string;
  records: RecordContentDTO[];
  activityType: ActivityType;
}) => {
  // このプレースに対応するレコードをメモ化し、日付順に並び替え
  const placeRecords = useMemo(() => {
    // "Contentの中身がない" 記録（details, title, filenameすべて空/未設定）は除外
    const filteredRecords = records.filter(r =>
      r.place === place && (
        (r.details && r.details.trim() !== "") ||
        (r.title && r.title.trim() !== "") ||
        (r.filename && r.filename.trim() !== "")
      )
    );
    return sortByDate(filteredRecords);
  }, [records, place]);

  // ユニークな日付と対応するレコードを取得
  const dateGroups = useMemo(() => {
    const dates = new Map<string, RecordContentDTO[]>();

    placeRecords.forEach(record => {
      const dateKey = record.date || 'no-date';
      if (!dates.has(dateKey)) {
        dates.set(dateKey, []);
      }
      dates.get(dateKey)?.push(record);
    });

    // 日付でソートして返す（降順 - 新しい日付が上に）
    return Array.from(dates.entries()).sort((a, b) => {
      if (a[0] === 'no-date') return 1;
      if (b[0] === 'no-date') return -1;
      return new Date(b[0]).getTime() - new Date(a[0]).getTime();
    });
  }, [placeRecords]);

  return (
    <div className={styles.placeSection}>
      <h3 className={styles.placeTitle}>
        <span className={styles.placeIcon}>{activityType.icon}</span>
        {place}
      </h3>

      <div className={styles.recordCardList}>
        {dateGroups.map(([date, dateRecords]) => (
          <div key={date} className={styles.dateGroup}>
            {date !== 'no-date' && (
              <div className={styles.dateHeader}>
                <time dateTime={date}>{date}</time>
              </div>
            )}
            <div className={styles.dateRecords}>
              {dateRecords.map((record) => (
                <RecordCard
                  record={{ ...record, date: null }} // 日付を非表示にするためnullで上書き
                  key={record.contentId}
                />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
});

PlaceSection.displayName = "PlaceSection";

// メインのコンポーネント
const RecordClient: React.FC<RecordClientProps> = ({
  initialRecords,
  allRecords,
  years,
  initialYear,
  activityType
}) => {
  const router = useRouter();
  const searchParams = useSearchParams();

  // URLから年度パラメータを取得
  const yearParam = searchParams.get('year');
  const yearFromUrl = yearParam ? parseInt(yearParam, 10) : null;

  // React Transitionを使用してUIのブロックを防止
  const [isPending, startTransition] = useTransition();

  const [selectedYear, setSelectedYear] = useState<number | null>(
    yearFromUrl && years.includes(yearFromUrl) ? yearFromUrl : initialYear
  );

  const [recordsToShow, setRecordsToShow] = useState<RecordContentDTO[]>(
    yearFromUrl && years.includes(yearFromUrl)
      ? allRecords.filter(r => r.year === yearFromUrl)
      : initialRecords
  );

  const [loading, setLoading] = useState(false);

  // 年度変更時の処理
  const handleYearChange = useCallback((e: React.ChangeEvent<HTMLSelectElement>) => {
    const yearValue = Number(e.target.value) || null;

    // 選択した年度を設定
    startTransition(() => {
      setSelectedYear(yearValue);

      // URLに年度を反映
      if (yearValue) {
        router.push(`/record/${activityType.id}?year=${yearValue}`, { scroll: false });
      } else {
        router.push(`/record/${activityType.id}`, { scroll: false });
      }
    });
  }, [activityType.id, router]);

  // 年度変更時のデータフィルタリング
  useEffect(() => {
    if (!selectedYear) {
      setRecordsToShow([]);
      return;
    }

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
  }, [selectedYear, allRecords]);

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
      <BreadCrumbs
        breadcrumb={[
          { title: "Home", url: "/" },
          { title: "活動記録", url: "/record" },
          { title: activityType.title },
        ]}
      />

      <Title title={activityType.title} />

      {/* カテゴリ選択タブ */}
      <TabBar
        tabs={activityTypes.map((e) => ({
          title: e.title,
          icon: e.icon,
          url: `/record/${e.id}`,
          isCurrent: e.id == activityType.id,
        }))}
      />
      <div className={styles.contentWrapper}>
        {isPending || loading ? (
          <div className={styles.noDataMessage}>
            <div className={styles.loadingSpinner}>
              <p>読み込み中...</p>
            </div>
          </div>
        ) : years.length === 0 ? (
          <div className={styles.noDataMessage}>
            <p>{activityType.title}のデータがありません。</p>
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
                    <p>{selectedYear}年度の{activityType.title}はありません。</p>
                  </div>
                ) : (
                  placeList.map((place) => (
                    <PlaceSection
                      key={place}
                      place={place}
                      records={recordsToShow}
                      activityType={activityType}
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

export default RecordClient;