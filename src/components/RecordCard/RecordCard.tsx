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
    // 現在選択されている年度を検知
    const searchParams = useSearchParams();
    const currentYear = searchParams.get('year');

    // 年度パラメータを含んだリンクを生成
    const detailLink = `/record/${record.activityType}/${record.contentId}${currentYear ? `?year=${currentYear}` : ''}`;

    return (
        <Link
            href={detailLink}
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