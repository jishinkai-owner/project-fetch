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

const RecordCard = memo(({
    record,
}: {
    record: RecordContentDTO;
}) => {

    return (
        record.filename ?
            <Link
                href={`/record/${record.activityType}/${record.filename}`}
                className={styles.recordCard}
            >
                <div className={styles.recordCardHeader}>
                    <h4 className={styles.recordTitle}>{record.title || "記録"}</h4>
                </div>
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
                </div>
                <div className={styles.cardFooter}>
                    <span className={styles.readMore}>詳細を見る</span>
                </div>
            </div>
    );
});

RecordCard.displayName = "RecordCard";

export default RecordCard;