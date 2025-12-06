import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// 活動タイプのマッピング
const ACTIVITY_TYPE_MAP: { [key: string]: string[] } = {
  yama: ["yama"],
  tabi: ["tabi", "other"], // tabiページでは「other」も含める
  tsuri: ["tsuri"],
};

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ Type: string }> }
) {
  try {
    const resolvedParams = await params;
    const type = resolvedParams.Type;
    const activityTypes = ACTIVITY_TYPE_MAP[type];

    if (!activityTypes) {
      return NextResponse.json(
        { error: "Invalid record type" },
        { status: 400 }
      );
    }

    // RecordとContentを結合して取得
    const records = await prisma.record.findMany({
      where: {
        activityType: {
          in: activityTypes,
        },
      },
      select: {
        id: true,
        year: true,
        place: true,
        date: true,
        activityType: true,
        details: true,
        Content: {
          select: {
            id: true,
            title: true,
            content: true,
            filename: true,
          },
        },
      },
      orderBy: {
        date: "desc",
      },
    });

    // レスポンスの型定義
    type FormattedRecord = {
      contentId: number | null;
      recordId: number;
      year: number | null;
      place: string | null;
      activityType: string | null;
      date: string | null;
      details: string | null;
      title: string | null;
      filename: string | null;
    };

    // クライアント用にデータを整形
    const formattedRecords: FormattedRecord[] = records.flatMap((record) => {
      // Contentがある場合は各Contentごとにレコードを作成
      if (record.Content.length > 0) {
        return record.Content.map((content): FormattedRecord => ({
          contentId: content.id,
          recordId: record.id,
          year: record.year,
          place: record.place,
          activityType: record.activityType,
          date: record.date,
          details: record.details,
          title: content.title,
          filename: content.filename,
        }));
      }
      // Contentがない場合はRecordのみの情報を返す（中止になった山行など）
      return [{
        contentId: null,
        recordId: record.id,
        year: record.year,
        place: record.place,
        activityType: record.activityType,
        date: record.date,
        details: record.details,
        title: null,
        filename: null,
      } as FormattedRecord];
    });

    return NextResponse.json(formattedRecords);
  } catch (error) {
    console.error("API error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
