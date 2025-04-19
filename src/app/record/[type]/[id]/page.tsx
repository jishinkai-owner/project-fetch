"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter, notFound } from "next/navigation";
import styles from "../../RecordPage.module.scss";
import Image from "next/image";
import BreadCrumbs from "@/components/BreadCrumbs/BreadCrumbs";

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
      <div className={styles.loadingContainer}>
        <p className={styles.loadingText}>読み込み中...</p>
      </div>
    );
  }

  // データが見つからない場合
  if (!content) {
    return notFound();
  }

  const activityName = activityTypeNames[recordType] || recordType;

  return (
    <>
      {/* パンくずリスト */}
      <BreadCrumbs breadcrumb={[
        { title: 'Home', url: '/' },
        { title: '活動記録', url: '/record' },
        { title: `${activityName}記録`, url: `/record/${recordType}` },
        { title: content.title || '無題' }
      ]} />

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
    </>
  );
}
