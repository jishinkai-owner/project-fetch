import React, { memo } from 'react';
import styles from './RecordCard.module.scss';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';

// RecordContentDTO 定義
export interface RecordContentDTO {
    contentId: number | null;  // Contentがない場合はnull
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
    
    // activityTypeが不正な場合はリンクを生成しない
    if (!record.activityType) {
        return (
            <div className={styles.recordCard + ' ' + styles.disabled} title="リンク情報が不正なため詳細ページに遷移できません">
                <div className={styles.recordCardHeader}>
                    <h4 className={styles.recordTitle}>{record.title || record.place || "記録"}</h4>
                </div>
                <div className={styles.cardFooter}>
                    <span className={styles.readMore} style={{ color: '#aaa' }}>詳細ページに遷移できません</span>
                </div>
            </div>
        );
    }

    // contentIdがない場合（中止になった山行、記録ファイルがない等）
    if (!record.contentId) {
        return (
            <div className={styles.recordCard + ' ' + styles.disabled} title={record.details || "記録ファイルがありません"}>
                <div className={styles.recordCardHeader}>
                    <h4 className={styles.recordTitle}>{record.title || record.place || "記録"}</h4>
                </div>
                <div className={styles.cardFooter}>
                    <span className={styles.readMore} style={{ color: '#aaa' }}>{record.details || "記録なし"}</span>
                </div>
            </div>
        );
    }

    // filenameがlegacy/で始まる場合（記録ファイルが利用不可）
    if (record.filename?.startsWith('legacy/')) {
        return (
            <div className={styles.recordCard + ' ' + styles.disabled} title="記録が登録されていません">
                <div className={styles.recordCardHeader}>
                    <h4 className={styles.recordTitle}>{record.title || record.place || "記録"}</h4>
                </div>
                <div className={styles.cardFooter}>
                    <span className={styles.readMore} style={{ color: '#aaa' }}>記録が登録されていません</span>
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