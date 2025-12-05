"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter, notFound, useSearchParams } from "next/navigation";
import styles from "../RecordPage.module.scss";
import Image from "next/image";
import BreadCrumbs from "@/components/BreadCrumbs/BreadCrumbs";
import Link from "next/link";
import { RecordContentDTO } from "@/components/RecordCard/RecordCard";
import activityTypes from "../activityTypes";

// APIからのレスポンス型定義
interface ContentDetail {
  id: number;
  recordId: number;
  title: string | null;
  content: string | null;
  images: string[];
  filename?: string | null;
  year?: number | null;
  place?: string | null;
  date?: string | null;
  activityType?: string | null;
}

export default function RecordDetailPage() {
  const router = useRouter();
  const params = useParams();
  const searchParams = useSearchParams();
  const contentId = params.id as string;
  const recordType = params.type as string;

  // タイプのバリデーション
  const activityType = activityTypes.find((e) => e.id == recordType);
  if (activityType === undefined) {
    throw new Error(`Invalid record type: ${recordType}`);
  }

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
        const res = await fetch(`/api/Record/${activityType.id}/${contentId}`);

        if (!res.ok) {
          if (res.status === 404) {
            return notFound();
          }
          throw new Error('Failed to fetch content');
        }

        const data: ContentDetail = await res.json();
        setContent(data);

        // filenameでアクセスされた場合、正しい数値IDにリダイレクト
        const isNumericId = !isNaN(parseInt(contentId));
        if (!isNumericId && data.id) {
          // 年度パラメータを引き継ぐ
          const redirectUrl = yearParam
            ? `/record/${activityType.id}/${data.id}?year=${yearParam}`
            : `/record/${activityType.id}/${data.id}`;
          router.replace(redirectUrl);
          return;
        }

        // 関連コンテンツを取得
        try {
          const relatedRes = await fetch(`/api/Record/${activityType.id}`);
          if (!relatedRes.ok) {
            throw new Error('Failed to fetch related contents');
          }

          const allContents = await relatedRes.json() as RecordContentDTO[];

          // 年度パラメータまたはコンテンツの年度情報を使用してフィルタリング
          const targetYear = yearParam ? parseInt(yearParam) : data.year;
          
          // 同じ年度の記録のみをフィルタリングし、現在の記録を除外
          // contentIdがnullの記録（中止など）は関連記録として表示しない
          const filtered = allContents
            .filter((item) => {
              // contentIdがnullの記録は除外（リンクを作成できないため）
              if (item.contentId === null) return false;
              
              // 現在の記録を除外
              if (item.contentId === data.id) return false;
              
              // 年度が指定されている場合は同じ年度のみ
              if (targetYear !== null && targetYear !== undefined) {
                return item.year === targetYear;
              }
              
              // 年度が指定されていない場合はすべて表示
              return true;
            })
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
  }, [contentId, activityType.id, yearParam, router]);

  // 日付をそのまま表示するだけの関数
  const displayDate = (dateString: string | null | undefined) => {
    if (!dateString) return '日付なし';
    return dateString;
  };

  // コンテンツ内の相対リンクを絶対リンクに変換する関数
  const transformContentLinks = (htmlContent: string, filename: string | null | undefined) => {
    if (!htmlContent || !filename) return htmlContent;
    
    // filenameからディレクトリパスを取得 (例: "2017/b5gj/top" -> "2017/b5gj")
    const lastSlashIndex = filename.lastIndexOf('/');
    if (lastSlashIndex === -1) return htmlContent;
    const basePath = filename.substring(0, lastSlashIndex);
    
    // href属性の相対リンクを変換
    // 外部リンク(http/https)、絶対パス(/)、アンカー(#)は変換しない
    const transformedHtml = htmlContent.replace(
      /href="([^"]+)"/g,
      (match, href) => {
        // 外部リンク、絶対パス、アンカーリンクはそのまま
        if (href.startsWith('http') || href.startsWith('/') || href.startsWith('#') || href.startsWith('mailto:')) {
          return match;
        }
        // 相対リンクをfilenameクエリパラメータ付きのパスに変換
        const fullPath = `${basePath}/${href}`;
        const queryParams = new URLSearchParams();
        queryParams.set('filename', fullPath);
        if (yearParam) queryParams.set('year', yearParam);
        const newHref = `/record/${recordType}/resolve?${queryParams.toString()}`;
        return `href="${newHref}"`;
      }
    );
    
    return transformedHtml;
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

  return (
    <>
      {/* パンくずリスト */}
      <BreadCrumbs breadcrumb={[
        { title: 'Home', url: '/' },
        { title: '活動記録', url: '/record' },
        { title: activityType.title, url: `/record/${activityType.id}` },
        { title: content.title || 'ある日の記憶' }
      ]} />

      <div className={styles.recordDetail}>
        {/* 記事ヘッダー */}
        <div className={styles.detailHeader}>
          <h1 className={styles.detailTitle}>{content.title || 'ある日の記憶'}</h1>
          <div className={styles.detailMeta}>
            {content.place && (
              <span className={styles.detailPlace}>
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
          dangerouslySetInnerHTML={{ __html: transformContentLinks(content.content || '内容がありません', content.filename) }}
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
            <h2 className={styles.relatedTitle}>他の{activityType.title}</h2>
            <div className={styles.relatedList}>
              {relatedContents.map((item) => {
                // contentIdがnullの記録はフィルタ済みなので、ここでは常に存在する
                // 年度パラメータを引き継ぐ
                const linkHref = yearParam
                  ? `/record/${activityType.id}/${item.contentId}?year=${yearParam}`
                  : `/record/${activityType.id}/${item.contentId}`;

                return (
                  <Link
                    href={linkHref}
                    className={styles.relatedItem}
                    key={item.contentId ?? item.recordId}
                  >
                    <div className={styles.relatedItemContent}>
                      <h3 className={styles.relatedItemTitle}>{item.title || 'ある日の記憶'}</h3>
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
            ← {activityType.title}一覧に戻る
          </button>
        </div>
      </div>
    </>
  );
}