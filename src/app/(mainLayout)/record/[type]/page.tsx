// src/app/record/[type]/page.tsx
import { PrismaClient } from "@prisma/client";
import { Suspense } from "react";
import RecordClient from "./client";
import LoadingPlaceholder from "./loading";
import TabBar from "@/components/TabBar/TabBar";
import { RecordContentDTO } from "@/components/RecordCard/RecordCard";
import Title from "@/components/Title/Title";
import BreadCrumbs from "@/components/BreadCrumbs/BreadCrumbs";
import activityTypes from "./activityTypes";
import { Metadata } from "next";

// ISR設定（30分ごとに再生成、秒数で指定）
export const revalidate = 1800;

// [type]に入る値を列挙して事前生成
export async function generateStaticParams() {
  return activityTypes.map((type) => ({
    type: type.id,
  }));
}

// 列挙されたもの以外は404
export const dynamicParams = false;

export async function generateMetadata({
  params,
}: {
  params: Promise<{
    type: string;
  }>;
}): Promise<Metadata> {
  const recordType = (await params).type;

  const activityType = activityTypes.find((e) => e.id == recordType);
  if (activityType === undefined) {
    throw new Error(`Invalid record type: ${recordType}`);
  }

  return {
    title: activityType.title,
    description: `自然に親しむ会の${activityType.title}の一覧です。`,
  };
}

export default async function RecordTypePage({
  params,
}: {
  params: Promise<{
    type: string;
  }>;
}) {
  const recordType = (await params).type;

  // タイプのバリデーション
  const activityType = activityTypes.find((e) => e.id == recordType);
  if (activityType === undefined) {
    throw new Error(`Invalid record type: ${recordType}`);
  }

  console.log("RecordTypePage", activityType);

  // データ取得を待ちつつ、Suspenseでラップして表示を最適化
  const recordData = await getRecordData(activityType.id);

  return (
    <>
      {/* ナビゲーション */}
      <BreadCrumbs
        breadcrumb={[
          { title: "Home", url: "/" },
          { title: "活動記録", url: "/record" },
          { title: activityType.title },
        ]}
      />

      <Title title={activityType.title} />

      {/* カテゴリ選択タブ */}
      <TabBar
        tabs={activityTypes.map((e) => ({
          title: e.title,
          icon: e.icon,
          url: `/record/${e.id}`,
          isCurrent: e == activityType,
        }))}
      />

      <Suspense fallback={<LoadingPlaceholder activityTitle={activityType.title} />}>
        <RecordClient
          initialRecords={recordData.initialRecords}
          allRecords={recordData.allRecords}
          years={recordData.years}
          initialYear={recordData.initialYear}
          activityType={activityType}
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
    log: ["error"],
    datasources: {
      db: {
        url: process.env.DATABASE_URL,
      },
    },
  });

  try {
    // 記録データを取得
    const records = await prisma.record.findMany({
      where:
        recordType === "tabi"
          ? {
            OR: [
              { activityType: "tabi" },
              { activityType: "other" }, // tabiページでは「other」もフィルタリング
            ],
          }
          : { activityType: recordType },
      include: {
        Content: true, // 関連するContentを取得
      },
    });

    // 取得したデータをRecordContentDTO形式に変換
    const recordContents: RecordContentDTO[] = [];

    records.forEach((record) => {
      // 関連コンテンツがない場合は、レコード自体の情報だけで1レコード作成
      if (record.Content.length === 0) {
        recordContents.push({
          contentId: record.id,
          recordId: record.id,
          year: record.year,
          place: record.place,
          activityType: record.activityType,
          date: record.date || null,
          details: record.details,
          title: null, // Contentから取得するフィールドなのでnull
          filename: null, // Contentから取得するフィールドなのでnull
        });
      } else {
        // 各コンテンツごとに変換
        record.Content.forEach((content) => {
          recordContents.push({
            contentId: content.id,
            recordId: record.id,
            year: record.year,
            place: record.place,
            activityType: record.activityType,
            date: record.date || null,
            details: content.content || record.details,
            title: content.title || null,
            filename: content.filename || null,
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
      ? recordContents.filter((r) => r.year === latestYear)
      : [];

    return {
      initialRecords,
      // 全データは必要最小限のみをクライアントに渡す（最適化）
      allRecords: recordContents.map(
        ({
          contentId,
          recordId,
          year,
          place,
          activityType,
          date,
          title,
          filename,
        }) => ({
          contentId,
          recordId,
          year,
          place,
          activityType,
          date,
          title,
          filename,
          // detailsは一覧表示に必要な分だけ切り出す（データ量削減）
          details:
            recordContents
              .find((r) => r.contentId === contentId)
              ?.details?.substring(0, 100) || null,
        })
      ),
      years,
      initialYear: latestYear,
    };
  } catch (error) {
    console.error("Error fetching data:", error);
    // エラー時のフォールバック
    return {
      initialRecords: [],
      allRecords: [],
      years: [],
      initialYear: null,
    };
  } finally {
    await prisma.$disconnect();
  }
}
