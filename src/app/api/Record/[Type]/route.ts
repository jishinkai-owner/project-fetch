import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// 活動タイプのマッピング
const ACTIVITY_TYPE_MAP: { [key: string]: string } = {
  yama: "yama",
  tabi: "tabi",
  tsuri: "tsuri",
};

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ type: string }> }
) {
  try {
    const resolvedParams = await params;
    const type = resolvedParams.type;
    const activityType = ACTIVITY_TYPE_MAP[type];

    if (!activityType) {
      return NextResponse.json(
        { error: "Invalid record type" },
        { status: 400 }
      );
    }

    // RecordとContentを結合して取得
    const records = await prisma.record.findMany({
      where: {
        activityType: activityType,
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
          },
        },
      },
      orderBy: {
        date: "desc",
      },
    });

    // クライアント用にデータを整形
    const formattedRecords = records.flatMap((record) => {
      return record.Content.map((content) => ({
        contentId: content.id,
        recordId: record.id,
        year: record.year,
        place: record.place,
        activityType: record.activityType,
        date: record.date,
        details: record.details,
        title: content.title,
      }));
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
