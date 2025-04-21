// src/app/record/[type]/page.tsx
import { PrismaClient } from "@prisma/client";
import { Suspense } from "react";
import RecordClient from "../RecordClient"; // 共通コンポーネントに変更
import LoadingPlaceholder from "./loading";
import TabBar from "@/components/TabBar/TabBar";
import { RecordContentDTO } from "@/components/RecordCard/RecordCard";
import Title from "@/components/Title/Title";
import BreadCrumbs from "@/components/BreadCrumbs/BreadCrumbs";

// ISR設定（30分ごとに再生成、秒数で指定）
export const revalidate = 1800;

// サーバーサイドでデータを取得
export default async function RecordTypePage({ params }: { params: { type: string } }) {
  const recordType = params.type;
  
  // タイプのバリデーション
  if (!["yama", "tabi", "tsuri"].includes(recordType)) {
    throw new Error(`Invalid record type: ${recordType}`);
  }
  
  // タイトル設定
  const titles = {
    yama: "山行記録",
    tabi: "旅行記録",
    tsuri: "釣行記録"
  };
  
  // アイコン設定
  const icons = {
    yama: "🏔️",
    tabi: "✈️",
    tsuri: "🎣"
  };
  
  // データ取得を待ちつつ、Suspenseでラップして表示を最適化
  const recordData = await getRecordData(recordType);

  return (
    <>
      {/* ナビゲーション */}
      <BreadCrumbs
        breadcrumb={[
          { title: "Home", url: "/" },
          { title: "活動記録", url: "/record" },
          { title: titles[recordType as keyof typeof titles] }
        ]}
      />

      <Title title={titles[recordType as keyof typeof titles]} />

      {/* カテゴリ選択タブ */}
      <TabBar tabs={[
        { title: "山行記録", icon: "🏔️", url: "/record/yama", isCurrent: recordType === "yama" },
        { title: "旅行記録", icon: "✈️", url: "/record/tabi", isCurrent: recordType === "tabi" },
        { title: "釣行記録", icon: "🎣", url: "/record/tsuri", isCurrent: recordType === "tsuri" }
      ]} />

      <Suspense fallback={<LoadingPlaceholder type={recordType} />}>
        <RecordClient
          initialRecords={recordData.initialRecords}
          allRecords={recordData.allRecords}
          years={recordData.years}
          initialYear={recordData.initialYear}
          activityType={recordType as "yama" | "tabi" | "tsuri"}
        />
      </Suspense>
    </>
  );
}

// 年度リスト取得（降順）
function getUniqueYears(recordContents: RecordContentDTO[]): number[] {
  const uniqueYears = new Set<number>();
  recordContents.forEach((r) => {
    if (r.year !== null) {
      uniqueYears.add(r.year);
    }
  });
  return Array.from(uniqueYears).sort((a, b) => b - a); // 降順
}

// プリロードを行うための非同期関数
async function getRecordData(recordType: string) {
  // シングルトンインスタンスを使用（パフォーマンス向上）
  const prisma = new PrismaClient({
    // コネクションプールの最適化
    log: ['error'],
    datasources: {
      db: {
        url: process.env.DATABASE_URL,
      },
    },
  });

  try {
    // 活動タイプに応じたクエリを構築
    let whereClause: any = {};
    
    if (recordType === "tabi") {
      whereClause = {
        OR: [
          { activityType: "tabi" },
          { activityType: "other" } // tabiページでは「other」もフィルタリング
        ]
      };
    } else {
      whereClause = {
        activityType: recordType
      };
    }
    
    // 記録データを取得
    const records = await prisma.record.findMany({
      where: whereClause,
      include: {
        contents: true // 関連するContentを取得
      }
    });

    // 取得したデータをRecordContentDTO形式に変換
    const recordContents: RecordContentDTO[] = [];

    records.forEach(record => {
      // 関連コンテンツがない場合は、レコード自体の情報だけで1レコード作成
      if (record.contents.length === 0) {
        recordContents.push({
          contentId: record.id,
          recordId: record.id,
          year: record.year,
          place: record.place,
          activityType: record.activityType,
          date: record.date || null,
          details: record.details,
          title: null, // Contentから取得するフィールドなのでnull
          filename: null // Contentから取得するフィールドなのでnull
        });
      } else {
        // 各コンテンツごとに変換
        record.contents.forEach(content => {
          recordContents.push({
            contentId: content.id,
            recordId: record.id,
            year: record.year,
            place: record.place,
            activityType: record.activityType,
            date: record.date || null,
            details: content.content || record.details,
            title: content.title || null,
            filename: content.filename || null
          });
        });
      }
    });

    // 年度リストを取得
    const years = getUniqueYears(recordContents);

    // 最新年度を取得
    const latestYear = years.length > 0 ? years[0] : null;

    // 最新年度のレコードを取得
    const initialRecords = latestYear
      ? recordContents.filter(r => r.year === latestYear)
      : [];

    return {
      initialRecords,
      // 全データは必要最小限のみをクライアントに渡す（最適化）
      allRecords: recordContents.map(({ contentId, recordId, year, place, activityType, date, title, filename }) => ({
        contentId,
        recordId,
        year,
        place,
        activityType,
        date,
        title,
        filename,
        // detailsは一覧表示に必要な分だけ切り出す（データ量削減）
        details: recordContents.find(r => r.contentId === contentId)?.details?.substring(0, 100) || null
      })),
      years,
      initialYear: latestYear
    };
  } catch (error) {
    console.error("Error fetching data:", error);
    // エラー時のフォールバック
    return {
      initialRecords: [],
      allRecords: [],
      years: [],
      initialYear: null
    };
  } finally {
    await prisma.$disconnect();
  }
}