"use client";

import React, {
  useState,
  useEffect,
  useMemo,
  useCallback,
  useTransition,
  memo,
} from "react";
import styles from "./RecordPage.module.scss";
import RecordCard, {
  RecordContentDTO,
} from "@/components/RecordCard/RecordCard";
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

// 日付文字列を数値（YYYYMMDD形式）に変換する関数
const dateStringToNumber = (dateStr: string, year: number): number => {
  if (!dateStr) return 0;

  // "06/23～24" や "11/10～11" のような形式から最初の日付を抽出
  // より広範な区切り文字に対応（～、〜、~、-、ー、−など）
  const rangeMatch = dateStr.match(/^(\d{2})\/(\d{2})[\s]*[～〜~\-ー−]/);
  if (rangeMatch) {
    const month = parseInt(rangeMatch[1], 10);
    const day = parseInt(rangeMatch[2], 10);
    return year * 10000 + month * 100 + day;
  }

  // "05/??" のような不明な日付を含む形式
  const unknownMatch = dateStr.match(/^(\d{2})\/\?\?/);
  if (unknownMatch) {
    const month = parseInt(unknownMatch[1], 10);
    // 不明な日付は月の最初（0日）として扱う
    return year * 10000 + month * 100 + 0;
  }

  // "06/23" のような単一日付
  const singleMatch = dateStr.match(/^(\d{2})\/(\d{2})$/);
  if (singleMatch) {
    const month = parseInt(singleMatch[1], 10);
    const day = parseInt(singleMatch[2], 10);
    return year * 10000 + month * 100 + day;
  }

  // "2007-06-23" のようなISO形式
  const isoMatch = dateStr.match(/^(\d{4})-(\d{2})-(\d{2})/);
  if (isoMatch) {
    const isoYear = parseInt(isoMatch[1], 10);
    const month = parseInt(isoMatch[2], 10);
    const day = parseInt(isoMatch[3], 10);
    return isoYear * 10000 + month * 100 + day;
  }

  return 0;
};

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
            一: 1,
            二: 2,
            三: 3,
            四: 4,
            五: 5,
            六: 6,
            七: 7,
            八: 8,
            九: 9,
            十: 10,
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
        if (title.includes("前編")) return 1;
        if (title.includes("中編")) return 2;
        if (title.includes("後編")) return 3;

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
      return (a.title || "").localeCompare(b.title || "");
    }

    // 日付を比較（降順 - 新しい日付が上に）
    // 日付を数値に変換して比較
    const dateNumA = dateStringToNumber(a.date, a.year || 0);
    const dateNumB = dateStringToNumber(b.date, b.year || 0);
    
    // 解析できない日付の場合は後ろに配置
    if (dateNumA === 0 && dateNumB === 0) return 0;
    if (dateNumA === 0) return 1;
    if (dateNumB === 0) return -1;

    // 数値で降順比較（新しい日付が上に）
    return dateNumB - dateNumA;
  });
};

// プレースセクションをメモ化されたコンポーネントとして分離
const PlaceSection = memo(
  ({
    place,
    records,
    activityType,
    isFishingRecords = false,
  }: {
    place: string;
    records: RecordContentDTO[];
    activityType: ActivityType;
    isFishingRecords?: boolean;
  }) => {
    // このプレースに対応するレコードをメモ化し、日付順に並び替え
    const placeRecords = useMemo(() => {
      const allPlaceRecords = records.filter((r) => r.place === place);
      
      // "Contentの中身がある" 記録をフィルタリング
      const filteredRecords = allPlaceRecords.filter(
        (r) =>
          (r.title && r.title.trim() !== "") ||
          (r.filename && r.filename.trim() !== "")
      );
      
      return sortByDate(filteredRecords);
    }, [records, place]);

    // Contentはないが日付情報がある記録を取得（??を含む日付など）
    const dateOnlyRecords = useMemo(() => {
      const allPlaceRecords = records.filter((r) => r.place === place);
      
      return allPlaceRecords.filter(
        (r) =>
          (!r.title || r.title.trim() === "") &&
          (!r.filename || r.filename.trim() === "") &&
          (!r.details || r.details.trim() === "") && // detailsがある場合は中止記録として扱う
          r.date &&
          r.date.trim() !== ""
      );
    }, [records, place]);

    // ユニークな日付と対応するレコードを取得
    const dateGroups = useMemo(() => {
      const dates = new Map<string, RecordContentDTO[]>();

      placeRecords.forEach((record) => {
        const dateKey = record.date || "no-date";
        if (!dates.has(dateKey)) {
          dates.set(dateKey, []);
        }
        dates.get(dateKey)?.push(record);
      });

      // 日付でソートして返す（降順 - 新しい日付が上に）
      return Array.from(dates.entries()).sort((a, b) => {
        if (a[0] === "no-date") return 1;
        if (b[0] === "no-date") return -1;

        // 年度を取得（レコードのyearフィールドから）
        const yearA = a[1][0]?.year || 0;
        const yearB = b[1][0]?.year || 0;

        // 日付を数値に変換して比較
        const dateNumA = dateStringToNumber(a[0], yearA);
        const dateNumB = dateStringToNumber(b[0], yearB);
        
        // 解析できない日付の場合は後ろに配置
        if (dateNumA === 0 && dateNumB === 0) {
          // 両方解析できない場合は文字列比較
          return b[0].localeCompare(a[0]);
        }
        if (dateNumA === 0) return 1;
        if (dateNumB === 0) return -1;

        // 数値で降順比較（新しい日付が上に）
        return dateNumB - dateNumA;
      });
    }, [placeRecords, isFishingRecords]);

    // placeに対応する記録で、Contentが存在しないもの（中止などの理由がdetailsに記載されている）を取得
    const noContentInfo = useMemo(() => {
      const allPlaceRecords = records.filter((r) => r.place === place);
      
      // Contentが存在しないレコードを探す
      const noContentRecord = allPlaceRecords.find(
        (r) =>
          (!r.title || r.title.trim() === "") &&
          (!r.filename || r.filename.trim() === "") &&
          r.details &&
          r.details.trim() !== ""
      );
      
      return noContentRecord 
        ? { details: noContentRecord.details, date: noContentRecord.date }
        : null;
    }, [records, place]);

    return (
      <div className={styles.placeSection}>
        <h3 className={styles.placeTitle}>
          <span className={styles.placeIcon}>{activityType.icon}</span>
          {noContentInfo ? (
            <>
              <span style={{ textDecoration: 'line-through' }}>{place}</span>
              <span style={{ marginLeft: '1rem', fontSize: '0.9em', color: '#666' }}>
                {noContentInfo.details}
              </span>
            </>
          ) : (
            place
          )}
        </h3>

        {/* Contentが存在しない記録の日付を表示 */}
        {noContentInfo && noContentInfo.date && (
          <div className={styles.dateHeader} style={{ marginTop: '0.5rem' }}>
            <time dateTime={noContentInfo.date}>{noContentInfo.date}</time>
          </div>
        )}

        {/* 日付情報のみの記録を表示（??を含む日付など） */}
        {dateOnlyRecords.length > 0 && (
          <div style={{ marginTop: '0.5rem'}}>
            {dateOnlyRecords.map((record) => (
              <div key={record.contentId} className={styles.dateHeader}>
                <time dateTime={record.date || undefined}>{record.date}</time>
              </div>
            ))}
          </div>
        )}

        {/* Contentが存在する場合のみRecordCardを表示 */}
        {placeRecords.length > 0 && (
          <div className={styles.recordCardList}>
            {dateGroups.map(([date, dateRecords]) => (
              <div key={date} className={styles.dateGroup}>
                {date !== "no-date" && (
                  <div className={styles.dateHeader}>
                    <time dateTime={date}>{date}</time>
                    {isFishingRecords &&
                      dateRecords.length > 0 &&
                      dateRecords[0].year && (
                        <span className={styles.yearBadge}>
                          {dateRecords[0].year}年
                        </span>
                      )}
                  </div>
                )}
                <div className={styles.dateRecords}>
                  {dateRecords.map((record) => (
                    <RecordCard
                      record={{
                        ...record,
                        date: null, // 日付ヘッダーで表示しているのでカード内では非表示
                      }}
                      key={record.contentId}
                    />
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  }
);

PlaceSection.displayName = "PlaceSection";

// メインのコンポーネント
const RecordClient: React.FC<RecordClientProps> = ({
  initialRecords,
  allRecords,
  years,
  initialYear,
  activityType,
}) => {
  const router = useRouter();
  const searchParams = useSearchParams();

  // 釣果記録の場合は年度フィルタリングなしで全記録を表示
  const isFishingRecords = activityType.id === "tsuri";

  // URLから年度パラメータを取得
  const yearParam = searchParams.get("year");
  const yearFromUrl = yearParam ? parseInt(yearParam, 10) : null;

  // React Transitionを使用してUIのブロックを防止
  const [isPending, startTransition] = useTransition();

  const [selectedYear, setSelectedYear] = useState<number | null>(
    isFishingRecords
      ? null
      : yearFromUrl && years.includes(yearFromUrl)
      ? yearFromUrl
      : initialYear
  );

  const [recordsToShow, setRecordsToShow] = useState<RecordContentDTO[]>(
    isFishingRecords
      ? allRecords // 釣果記録は全記録を表示
      : yearFromUrl && years.includes(yearFromUrl)
      ? allRecords.filter((r) => r.year === yearFromUrl)
      : initialRecords
  );

  const [loading, setLoading] = useState(false);

  // 年度変更時の処理
  const handleYearChange = useCallback(
    (e: React.ChangeEvent<HTMLSelectElement>) => {
      const yearValue = Number(e.target.value) || null;

      // 選択した年度を設定
      startTransition(() => {
        setSelectedYear(yearValue);

        // URLに年度を反映
        if (yearValue) {
          router.push(`/record/${activityType.id}?year=${yearValue}`, {
            scroll: false,
          });
        } else {
          router.push(`/record/${activityType.id}`, { scroll: false });
        }
      });
    },
    [activityType.id, router]
  );

  // 年度変更時のデータフィルタリング
  useEffect(() => {
    // 釣果記録の場合は年度フィルタリングをスキップ
    if (isFishingRecords) {
      setRecordsToShow(allRecords);
      return;
    }

    if (!selectedYear) {
      setRecordsToShow([]);
      return;
    }

    setLoading(true);

    // 非同期処理で UI ブロッキングを防止
    const timeoutId = setTimeout(() => {
      startTransition(() => {
        // すでに全データを持っているのでフィルタリングするだけ
        const filtered = allRecords.filter((r) => r.year === selectedYear);
        setRecordsToShow(filtered);
        setLoading(false);
      });
    }, 0);

    return () => clearTimeout(timeoutId);
  }, [selectedYear, allRecords, isFishingRecords]);

  // 場所リスト（データが変わった時のみ再計算）
  const placeList = useMemo(() => {
    const uniquePlaces = new Set<string>();
    recordsToShow.forEach((r) => {
      if (r.place) uniquePlaces.add(r.place);
    });

    const placeArray = Array.from(uniquePlaces);

    // 釣果記録の場合は場所を最新年度順に並び替える
    if (isFishingRecords) {
      return placeArray.sort((placeA, placeB) => {
        // 各場所の最新年度を取得
        const recordsA = recordsToShow.filter((r) => r.place === placeA);
        const recordsB = recordsToShow.filter((r) => r.place === placeB);

        const maxYearA = Math.max(...recordsA.map((r) => r.year || 0));
        const maxYearB = Math.max(...recordsB.map((r) => r.year || 0));

        // 最新年度が新しい順に並び替え（降順）
        return maxYearB - maxYearA;
      });
    }

    // 釣果記録以外は、各場所の最新の日付で並び替え（降順）
    return placeArray.sort((placeA, placeB) => {
      const recordsA = recordsToShow.filter((r) => r.place === placeA);
      const recordsB = recordsToShow.filter((r) => r.place === placeB);

      // 各場所の最新の日付（最大の数値）を取得
      const maxDateNumA = Math.max(
        ...recordsA.map((r) => dateStringToNumber(r.date || '', r.year || 0))
      );
      const maxDateNumB = Math.max(
        ...recordsB.map((r) => dateStringToNumber(r.date || '', r.year || 0))
      );

      // 降順でソート（新しい日付が上に）
      return maxDateNumB - maxDateNumA;
    });
  }, [recordsToShow, isFishingRecords]);

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
            {/* 釣果記録以外は年度セレクタを表示 */}
            {!isFishingRecords && (
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
            )}

            {/* 記録一覧表示部分 */}
            {(isFishingRecords || selectedYear) && (
              <div className={styles.recordsWrapper}>
                {placeList.length === 0 ? (
                  <div className={styles.noDataMessage}>
                    <p>
                      {isFishingRecords
                        ? `${activityType.title}はありません。`
                        : `${selectedYear}年度の${activityType.title}はありません。`}
                    </p>
                  </div>
                ) : (
                  placeList.map((place) => (
                    <PlaceSection
                      key={place}
                      place={place}
                      records={recordsToShow}
                      activityType={activityType}
                      isFishingRecords={isFishingRecords}
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
