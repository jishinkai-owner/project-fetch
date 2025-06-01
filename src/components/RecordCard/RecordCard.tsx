import React, { memo } from 'react';
import styles from './RecordCard.module.scss';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';

// RecordContentDTO 定義
export interface RecordContentDTO {
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

const RecordCard = memo(({
    record,
}: {
    record: RecordContentDTO;
}) => {
    // 現在の検索パラメータを取得
    const searchParams = useSearchParams();
    const currentYear = searchParams.get('year');
    
    // activityType/contentIdが不正な場合はリンクを生成しない
    if (!record.activityType || !record.contentId) {
        return (
            <div className={styles.recordCard + ' ' + styles.disabled} title="リンク情報が不正なため詳細ページに遷移できません">
                <div className={styles.recordCardHeader}>
                    <h4 className={styles.recordTitle}>{record.title || "記録"}</h4>
                </div>
                <div className={styles.cardFooter}>
                    <span className={styles.readMore} style={{ color: '#aaa' }}>詳細ページに遷移できません</span>
                </div>
            </div>
        );
    }
    // 年度パラメータを含む詳細ページへのリンクを生成
    let linkHref = `/record/${record.activityType}/${record.contentId}`;
    if (currentYear) {
        linkHref += `?year=${currentYear}`;
    }

    return (
        <Link
            href={linkHref}
            className={styles.recordCard}
        >
            <div className={styles.recordCardHeader}>
                <h4 className={styles.recordTitle}>{record.title || "記録"}</h4>
            </div>
            <div className={styles.cardFooter}>
                <span className={styles.readMore}>詳細を見る</span>
            </div>
        </Link>
    );
});

RecordCard.displayName = "RecordCard";

export default RecordCard;