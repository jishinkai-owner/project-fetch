// src/app/record/yama/loading.tsx
import styles from "../RecordPage.module.scss";
import Link from "next/link";

// Suspenseのフォールバックとして使用するローディングUI
export default function LoadingPlaceholder() {
  return (
    <div className={styles.container}>
      <div className={styles.page}>
        {/* ナビゲーション */}
        <nav className={styles.breadcrumb}>
          <Link href="/">Home</Link> <span> &gt; </span> 
          <Link href="/record">活動記録</Link> <span> &gt; </span> 
          <span>山行記録</span>
        </nav>
        <h1 className={styles.circleTitle}>山行記録</h1>
        
        {/* カテゴリ選択タブ */}
        <div className={styles.tabContainer}>
          <Link href="/record/yama" className={`${styles.tab} ${styles.activeTab}`}>
            <span className={styles.placeIcon}>🏔️</span> 山行記録
          </Link>
          <Link href="/record/tabi" className={styles.tab}>
            <span className={styles.placeIcon}>✈️</span> 旅行記録
          </Link>
          <Link href="/record/tsuri" className={styles.tab}>
            <span className={styles.placeIcon}>🎣</span> 釣行記録
          </Link>
        </div>
        
        <div className={styles.contentWrapper}>
          {/* ローディングUI */}
          <div className={styles.noDataMessage}>
            <div className={styles.loadingSpinner}>
              <p>山行記録を読み込み中...</p>
              {/* 必要に応じて、CSSアニメーションによるスピナーをここに追加 */}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}