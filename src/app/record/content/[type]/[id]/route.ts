// /record/content/[type]/[id]/route.ts
import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET(
  request: NextRequest,
  { params }: { params: { type: string; id: string } }
) {
  try {
    const { type, id } = params;
    const contentId = parseInt(id);

    if (isNaN(contentId)) {
      return NextResponse.json(
        { error: "Invalid content ID" },
        { status: 400 }
      );
    }

    // Contentを取得し、Recordも一緒に取得
    const content = await prisma.content.findFirst({
      where: {
        id: contentId
      },
      include: {
        Record: {
          select: {
            id: true,
            year: true,
            place: true,
            date: true,
            activityType: true,
            details: true
          }
        }
      }
    });

    if (!content) {
      return NextResponse.json(
        { error: "Content not found" },
        { status: 404 }
      );
    }

    // 指定されたタイプに合致するかチェック
    const ACTIVITY_TYPE_MAP: { [key: string]: string } = {
      yama: "yama",
      tabi: "travel",
      tsuri: "fishing"
    };
    
    const requestedType = ACTIVITY_TYPE_MAP[type];
    
    if (requestedType && content.Record.activityType !== requestedType) {
      return NextResponse.json(
        { error: "Content type mismatch" },
        { status: 400 }
      );
    }

    // クライアント用にデータを整形
    const formattedContent = {
      id: content.id,
      recordId: content.recordId,
      title: content.title,
      content: content.content,
      images: content.images,
      year: content.Record.year,
      place: content.Record.place,
      date: content.Record.date,
      activityType: content.Record.activityType
    };

    return NextResponse.json(formattedContent);
  } catch (error) {
    console.error("API error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}