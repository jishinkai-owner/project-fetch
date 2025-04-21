// src/app/record/[type]/loading.tsx
import styles from "./RecordPage.module.scss";
import TabBar from "@/components/TabBar/TabBar";
import BreadCrumbs from "@/components/BreadCrumbs/BreadCrumbs";
import Title from "@/components/Title/Title";

// Suspenseのフォールバックとして使用するローディングUI
export default function LoadingPlaceholder({ type }: { type: string }) {
  // タイトルマッピング
  const titles: { [key: string]: string } = {
    yama: "山行記録",
    tabi: "旅行記録",
    tsuri: "釣行記録"
  };
  
  const title = titles[type] || "活動記録";

  return (
    <>
      {/* ナビゲーション */}
      <BreadCrumbs
        breadcrumb={[
          { title: "Home", url: "/" },
          { title: "活動記録", url: "/record" },
          { title }
        ]}
      />

      <Title title={title} />

      {/* カテゴリ選択タブ */}
      <TabBar tabs={[
        { title: "山行記録", icon: "🏔️", url: "/record/yama", isCurrent: type === "yama" },
        { title: "旅行記録", icon: "✈️", url: "/record/tabi", isCurrent: type === "tabi" },
        { title: "釣行記録", icon: "🎣", url: "/record/tsuri", isCurrent: type === "tsuri" }
      ]} />

      <div className={styles.contentWrapper}>
        {/* ローディングUI */}
        <div className={styles.noDataMessage}>
          <div className={styles.loadingSpinner}>
            <p>{title}を読み込み中...</p>
          </div>
        </div>
      </div>
    </>
  );
}