import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET(
  request: NextRequest,
  props: { params: Promise<{ Type: string }> }
) {
  const params = await props.params;
  try {
    const { Type: type } = params;
    const { searchParams } = new URL(request.url);
    const filename = searchParams.get('filename');

    if (!filename) {
      return NextResponse.json(
        { error: "Filename is required" },
        { status: 400 }
      );
    }

    // filenameで検索（完全一致、または末尾一致）
    const content = await prisma.content.findFirst({
      where: {
        OR: [
          // 完全一致
          { filename: filename },
          // 末尾一致（拡張子なし）
          { filename: { endsWith: `/${filename}` } },
          // .mdx拡張子付きで完全一致
          { filename: `${filename}.mdx` },
          // .mdx拡張子付きで末尾一致
          { filename: { endsWith: `/${filename}.mdx` } },
        ]
      },
      include: {
        Record: {
          select: {
            activityType: true,
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

    // タイプの検証
    const ACTIVITY_TYPE_MAP: { [key: string]: string[] } = {
      yama: ["yama"],
      tabi: ["tabi", "other"],
      tsuri: ["tsuri"]
    };
    
    const allowedTypes = ACTIVITY_TYPE_MAP[type];
    
    if (allowedTypes && content.Record.activityType && !allowedTypes.includes(content.Record.activityType)) {
      return NextResponse.json(
        { error: "Content type mismatch" },
        { status: 400 }
      );
    }

    return NextResponse.json({ id: content.id });
  } catch (error) {
    console.error("API error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
