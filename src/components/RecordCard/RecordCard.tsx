import React, { memo, useMemo } from 'react';
import styles from './RecordCard.module.scss';
import Link from 'next/link';

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

// 日付をフォーマットする関数
const formatDate = (dateString: string | null): string => {
    if (!dateString) return "-";
    const date = new Date(dateString);
    return `${date.getMonth() + 1}月${date.getDate()}日`;
};

const RecordCard = memo(({
    record,
}: {
    record: RecordContentDTO;
}) => {
    // 日付のメモ化
    const formattedDate = useMemo(() => formatDate(record.date), [record.date]);

    // 詳細テキストのメモ化
    const previewText = useMemo(() => {
        if (!record.details) return null;
        return record.details.length > 60
            ? `${record.details.substring(0, 60)}...`
            : record.details;
    }, [record.details]);

    return (
        record.filename ?
            <Link
                href={`/record/tabi/${record.filename}`}
                className={styles.recordCard}
            >
                <div className={styles.recordCardHeader}>
                    <h4 className={styles.recordTitle}>{record.title || "記録"}</h4>
                    <span className={styles.recordDate}>{formattedDate}</span>
                </div>
                {previewText && (
                    <p className={styles.recordPreview}>{previewText}</p>
                )}
                <div className={styles.cardFooter}>
                    <span className={styles.readMore}>詳細を見る</span>
                </div>
            </Link>
            :
            <div
                className={styles.recordCard}
            >
                <div className={styles.recordCardHeader}>
                    <h4 className={styles.recordTitle}>{record.title || "記録"}</h4>
                    <span className={styles.recordDate}>{formattedDate}</span>
                </div>
                {previewText && (
                    <p className={styles.recordPreview}>{previewText}</p>
                )}
                <div className={styles.cardFooter}>
                    <span className={styles.readMore}>詳細を見る</span>
                </div>
            </div>
    );
});

RecordCard.displayName = "RecordCard";

export default RecordCard;
