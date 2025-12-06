import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET(
  request: NextRequest,
  props: { params: Promise<{ Type: string; id: string }> }
) {
  const params = await props.params;
  try {
    const { Type: type, id } = params;
    const contentId = parseInt(id);

    let content;

    // IDが数値でない場合、filenameで検索
    if (isNaN(contentId)) {
      // filenameで検索（完全一致、または末尾一致）
      content = await prisma.content.findFirst({
        where: {
          OR: [
            // 完全一致
            { filename: id },
            // 末尾一致（拡張子なし）
            { filename: { endsWith: `/${id}` } },
            // 末尾一致（.mdx拡張子付き）
            { filename: { endsWith: `/${id}.mdx` } },
          ]
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
    } else {
      // 数値IDで検索
      content = await prisma.content.findFirst({
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
    }

    if (!content) {
      return NextResponse.json(
        { error: "Content not found" },
        { status: 404 }
      );
    }

    // 指定されたタイプに合致するかチェック
    const ACTIVITY_TYPE_MAP: { [key: string]: string } = {
      yama: "yama",
      tabi: "tabi",
      tsuri: "tsuri"
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
      filename: content.filename,
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