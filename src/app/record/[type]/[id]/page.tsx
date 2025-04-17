"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter, notFound } from "next/navigation";
import Link from "next/link";
import styles from "../../RecordPage.module.scss";
import Menu from "@/components/Menu/Menu";
import Image from "next/image"; 

// APIからのレスポンス型定義
interface ContentDetail {
  id: number;
  recordId: number;
  title: string | null;
  content: string | null;
  images: string[];
  year?: number | null;
  place?: string | null;
  date?: string | null;
  activityType?: string | null;
}

// 活動タイプの日本語名マッピング
const activityTypeNames: { [key: string]: string } = {
  yama: "山行",
  travel: "旅行",
  fishing: "釣り"
};

export default function RecordDetailPage() {
  const router = useRouter();
  const params = useParams();
  const contentId = params.id as string;
  const recordType = params.type as string;

  const [isLoading, setIsLoading] = useState(true);
  const [content, setContent] = useState<ContentDetail | null>(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // レスポンシブ対応
  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth <= 900);
    };

    // 初期チェック
    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);
    
    return () => {
      window.removeEventListener('resize', checkScreenSize);
    };
  }, []);

  // メニュー操作
  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape' && isMenuOpen && isMobile) {
      setIsMenuOpen(false);
    }
  };

  // ナビゲーション処理
  const handleNavigation = (path: string) => {
    router.push(path);
    if (isMobile) {
      setIsMenuOpen(false);
    }
  };

  // データ取得
  useEffect(() => {
    const fetchContent = async () => {
      if (!contentId) return;
      
      try {
        setIsLoading(true);
        // APIエンドポイントはプロジェクトに合わせて調整してください
        const res = await fetch(`/api/record/${recordType}/${contentId}`);
        
        if (!res.ok) {
          if (res.status === 404) {
            return notFound();
          }
          throw new Error('Failed to fetch content');
        }
        
        const data: ContentDetail = await res.json();
        setContent(data);
      } catch (error) {
        console.error('Error fetching content:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchContent();
  }, [contentId, recordType]);

  // 日付フォーマット
  const formatDate = (dateString: string | null | undefined) => {
    if (!dateString) return '-';
    const date = new Date(dateString);
    return `${date.getFullYear()}年${date.getMonth() + 1}月${date.getDate()}日`;
  };

  // ローディング表示
  if (isLoading) {
    return (
      <div className={styles.container} onKeyDown={handleKeyDown}>
        <div className={styles.page}>
          <div className={styles.loadingContainer}>
            <p className={styles.loadingText}>読み込み中...</p>
          </div>
        </div>
        
        {/* モバイルメニューボタン */}
        <button 
          className={styles.hamburgerButton}
          onClick={toggleMenu}
          aria-expanded={isMenuOpen}
          aria-label={isMenuOpen ? "メニューを閉じる" : "メニューを開く"}
        >
          {isMenuOpen ? "×" : "☰"}
        </button>

        {/* サイドバーメニュー */}
        <div 
          id="navigation-menu"
          className={`${styles.Sidebar} ${isMenuOpen ? styles.open : ''}`} 
          aria-hidden={!isMenuOpen}
        >
          <div className={styles.PaperContainer}>
            <div className={styles.Menu}>
              <Menu onClick={handleNavigation} />
            </div>
          </div>
        </div>
      </div>
    );
  }

  // データが見つからない場合
  if (!content) {
    return notFound();
  }

  const activityName = activityTypeNames[recordType] || recordType;

  return (
    <div className={styles.container} onKeyDown={handleKeyDown}>
      <div className={styles.page}>
        {/* パンくずリスト */}
        <nav className={styles.breadcrumb}>
          <Link href="/">Home</Link> {' > '} 
          <Link href="/record">活動記録</Link> {' > '} 
          <Link href={`/record/${recordType}`}>{activityName}記録</Link> {' > '} 
          <span>{content.title || '無題'}</span>
        </nav>

        <div className={styles.recordDetail}>
          {/* 記事ヘッダー */}
          <div className={styles.detailHeader}>
            <h1 className={styles.detailTitle}>{content.title || '無題'}</h1>
            <div className={styles.detailMeta}>
              {content.place && (
                <span className={styles.detailPlace}>
                  <span className={styles.placeIcon}>📍</span>
                  {content.place}
                </span>
              )}
              {content.date && (
                <span className={styles.detailDate}>
                  {formatDate(content.date)}
                </span>
              )}
            </div>
          </div>

          {/* 記事本文 */}
          <div 
            className={styles.detailContent}
            dangerouslySetInnerHTML={{ __html: content.content || '内容がありません' }}
          />

          {/* 画像ギャラリー */}
          {content.images && content.images.length > 0 && (
            <div className={styles.imageGallery}>
              <h2 className={styles.galleryTitle}>写真</h2>
              <div className={styles.imageGrid}>
                {content.images.map((src, index) => (
                  <div key={index} className={styles.imageWrapper}>
                    <Image
                      src={src}
                      alt={`${content.title || '記録'} - 画像 ${index + 1}`}
                      className={styles.contentImage}
                      width={800}
                      height={600}
                      loading="lazy"
                    />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 戻るボタン */}
          <div className={styles.detailFooter}>
            <button 
              className={styles.backButton}
              onClick={() => router.push(`/record/${recordType}`)}
            >
              ← {activityName}記録一覧に戻る
            </button>
          </div>
        </div>
      </div>

      {/* モバイルメニューボタン */}
      <button 
        className={styles.hamburgerButton}
        onClick={toggleMenu}
        aria-expanded={isMenuOpen}
        aria-label={isMenuOpen ? "メニューを閉じる" : "メニューを開く"}
      >
        {isMenuOpen ? "×" : "☰"}
      </button>

      {/* サイドバーメニュー */}
      <div 
        id="navigation-menu"
        className={`${styles.Sidebar} ${isMenuOpen ? styles.open : ''}`} 
        aria-hidden={!isMenuOpen}
      >
        <div className={styles.PaperContainer}>
          <div className={styles.Menu}>
            <Menu onClick={handleNavigation} />
          </div>
        </div>
      </div>
    </div>
  );
}