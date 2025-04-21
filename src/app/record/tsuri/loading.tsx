// src/app/record/tsuri/loading.tsx
import styles from "../RecordPage.module.scss";
import TabBar from "@/components/TabBar/TabBar";
import BreadCrumbs from "@/components/BreadCrumbs/BreadCrumbs";
import Title from "@/components/Title/Title";

// Suspenseのフォールバックとして使用するローディングUI
export default function LoadingPlaceholder() {
  return (
    <>
      {/* ナビゲーション */}
      <BreadCrumbs
        breadcrumb={[
          { title: "Home", url: "/" },
          { title: "活動記録", url: "/record" },
          { title: "釣行記録" }
        ]}
      />

      <Title title="釣行記録" />

      {/* カテゴリ選択タブ */}
      <TabBar tabs={[
        { title: "山行記録", icon: "🏔️", url: "/record/yama" },
        { title: "旅行記録", icon: "✈️", url: "/record/tabi" },
        { title: "釣行記録", icon: "🎣", url: "/record/tsuri", isCurrent: true }
      ]} />

      <div className={styles.contentWrapper}>
        {/* ローディングUI */}
        <div className={styles.noDataMessage}>
          <div className={styles.loadingSpinner}>
            <p>釣行記録を読み込み中...</p>
            {/* 必要に応じて、CSSアニメーションによるスピナーをここに追加 */}
          </div>
        </div>
      </div>
    </>
  );
}