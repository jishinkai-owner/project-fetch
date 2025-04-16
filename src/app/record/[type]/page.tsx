"use client";

import React, { useState, useEffect, useMemo, useCallback } from "react";
import { useRouter, useParams } from "next/navigation";
import styles from "../RecordPage.module.scss";
import Link from "next/link";
import Menu from "@/components/Menu/Menu";

// APIレスポンス型定義
interface RecordContentDTO {
  contentId: number;
  recordId: number;
  year: number | null;
  place: string | null;
  activityType: string | null;
  date: string | null;
  details: string | null;
  title: string | null;
}

// 日付をフォーマットする関数
const formatDate = (dateString: string | null): string => {
  if (!dateString) return "-";
  const date = new Date(dateString);
  return `${date.getMonth() + 1}月${date.getDate()}日`;
};

// 活動タイプとそのアイコン・名前のマッピング
const ACTIVITY_TYPES: { [key: string]: { icon: string, name: string } } = {
  yama: { icon: "🏔️", name: "山行" },
  tabi: { icon: "✈️", name: "旅行" },
  tsuri: { icon: "🎣", name: "釣行" }
};

const RecordListPage: React.FC = () => {
  const params = useParams();
  const recordType = params.type as string;
  
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [recordContents, setRecordContents] = useState<RecordContentDTO[]>([]);
  const [selectedYear, setSelectedYear] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  
  const router = useRouter();
  
  // 現在の活動タイプ情報
  const currentActivityType = ACTIVITY_TYPES[recordType] || {
    icon: "📝", 
    name: "活動"
  };
  
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

  // データ取得
  useEffect(() => {
    const fetchRecordContents = async () => {
      setLoading(true);
      try {
        // 新しいAPIエンドポイントを使用
        const res = await fetch(`/api/records/${recordType}`);
        if (!res.ok) throw new Error(`Failed to fetch ${recordType} records`);
        const data: RecordContentDTO[] = await res.json();
        setRecordContents(data);
      } catch (error) {
        console.error(`Error fetching ${recordType} records:`, error);
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
  
  // 記録クリック処理 - contentIdを使って遷移
  const handleRecordClick = useCallback((contentId: number) => {
    router.push(`/record/${recordType}/${contentId}`);
  }, [router, recordType]);
  
  return (
    <div className={styles.container} onKeyDown={handleKeyDown}>
      <div className={styles.page}>
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
                <div className={styles.recordsWrapper}>
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
                          {recordsThisYear
                            .filter((r) => r.place === place)
                            .map((record) => (
                              <div 
                                key={record.contentId}
                                className={styles.recordCard}
                                onClick={() => handleRecordClick(record.contentId)}
                              >
                                <div className={styles.recordCardHeader}>
                                  <h4 className={styles.recordTitle}>{record.title || "無題の記録"}</h4>
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
            <Menu onClick={handleNavigate} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default RecordListPage;