// src/app/record/[type]/loading.tsx
import styles from "./RecordPage.module.scss";
import TabBar from "@/components/TabBar/TabBar";
import BreadCrumbs from "@/components/BreadCrumbs/BreadCrumbs";
import Title from "@/components/Title/Title";
import activityTypes from "./activityTypes";

// Suspenseのフォールバックとして使用するローディングUI
export default function LoadingPlaceholder({ activityTitle }: { activityTitle: string }) {
  return (
    <>
      {/* ナビゲーション */}
      <BreadCrumbs
        breadcrumb={[
          { title: "Home", url: "/" },
          { title: "活動記録", url: "/record" },
          { title: activityTitle }
        ]}
      />
      <Title title={activityTitle} />

      {/* カテゴリ選択タブ */}
      <TabBar
        tabs={activityTypes.map((e) => ({
          title: e.title,
          icon: e.icon,
          url: `/record/${e.id}`,
          isCurrent: e.title == activityTitle,
        }))}
      />

      <div className={styles.contentWrapper}>
        {/* ローディングUI */}
        <div className={styles.noDataMessage}>
          <div className={styles.loadingSpinner}>
            <p>{activityTitle}を読み込み中...</p>
          </div>
        </div>
      </div>
    </>
  );
}