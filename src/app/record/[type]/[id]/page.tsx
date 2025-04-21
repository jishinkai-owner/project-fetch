"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter, notFound, useSearchParams } from "next/navigation";
import styles from "../RecordPage.module.scss";
import Image from "next/image";
import BreadCrumbs from "@/components/BreadCrumbs/BreadCrumbs";
import Link from "next/link";
import { RecordContentDTO } from "@/components/RecordCard/RecordCard";

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
  tabi: "旅行",
  tsuri: "釣り"
};

export default function RecordDetailPage() {
  const router = useRouter();
  const params = useParams();
  const searchParams = useSearchParams();
  const contentId = params.id as string;
  const recordType = params.type as string;
  
  // URLから年度パラメータを取得
  const yearParam = searchParams.get('year');

  const [isLoading, setIsLoading] = useState(true);
  const [content, setContent] = useState<ContentDetail | null>(null);
  const [relatedContents, setRelatedContents] = useState<RecordContentDTO[]>([]);

  // データ取得
  useEffect(() => {
    const fetchContent = async () => {
      if (!contentId) return;

      try {
        setIsLoading(true);
        // 大文字小文字に注意
        const res = await fetch(`/api/record/${recordType}/${contentId}`);

        if (!res.ok) {
          if (res.status === 404) {
            return notFound();
          }
          throw new Error('Failed to fetch content');
        }

        const data: ContentDetail = await res.json();
        setContent(data);

        // 関連コンテンツを取得
        try {
          const relatedRes = await fetch(`/api/record/${recordType}`);
          if (!relatedRes.ok) {
            throw new Error('Failed to fetch related contents');
          }

          const allContents = await relatedRes.json() as RecordContentDTO[];
          
          // 現在の記録を除外し、最大5件までの関連記録を取得
          const filtered = allContents
            .filter((item) => item.contentId !== parseInt(contentId))
            .slice(0, 10);
          
          setRelatedContents(filtered);
        } catch (error) {
          console.error('Error fetching related contents:', error);
        }
      } catch (error) {
        console.error('Error fetching content:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchContent();
  }, [contentId, recordType]);

  // 日付をそのまま表示するだけの関数
  const displayDate = (dateString: string | null | undefined) => {
    if (!dateString) return '日付なし';
    return dateString;
  };

  // 戻るボタンのハンドラー
  const handleBackClick = () => {
    // 年度パラメータがある場合はその年度のページに戻る
    if (yearParam) {
      router.push(`/record/${recordType}?year=${yearParam}`);
    } 
    // コンテンツ自身の年度情報があればそれを使用
    else if (content?.year) {
      router.push(`/record/${recordType}?year=${content.year}`);
    } 
    // それ以外はトップページへ
    else {
      router.push(`/record/${recordType}`);
    }
  };

  // ローディング表示
  if (isLoading) {
    return (
      <div className={styles.loadingSpinner}>
        <p>読み込み中...</p>
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
                {displayDate(content.date)}
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

        {/* 関連記録 */}
        {relatedContents.length > 0 && (
          <div className={styles.relatedContents}>
            <h2 className={styles.relatedTitle}>他の{activityName}記録</h2>
            <div className={styles.relatedList}>
              {relatedContents.map((item) => {
                // 年度パラメータを引き継ぐ
                const linkHref = yearParam 
                  ? `/record/${recordType}/${item.contentId}?year=${yearParam}`
                  : `/record/${recordType}/${item.contentId}`;

                return (
                  <Link 
                    href={linkHref}
                    className={styles.relatedItem}
                    key={item.contentId}
                  >
                    <div className={styles.relatedItemContent}>
                      <h3 className={styles.relatedItemTitle}>{item.title || '無題'}</h3>
                      <div className={styles.relatedItemMeta}>
                        {item.place && <span className={styles.relatedItemPlace}>{item.place}</span>}
                        {item.date && <span className={styles.relatedItemDate}>{displayDate(item.date)}</span>}
                      </div>
                    </div>
                    <div className={styles.relatedItemArrow}>→</div>
                  </Link>
                );
              })}
            </div>
          </div>
        )}

        {/* 戻るボタン */}
        <div className={styles.detailFooter}>
          <button
            className={styles.backButton}
            onClick={handleBackClick}
          >
            ← {activityName}記録一覧に戻る
          </button>
        </div>
      </div>
    </>
  );
}