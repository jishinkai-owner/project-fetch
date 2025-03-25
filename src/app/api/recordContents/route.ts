// src/app/api/recordContents/route.ts
import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// named export の GET 関数を定義
export async function GET() {
  try {
    // Record と Content を join
    const data = await prisma.content.findMany({
      include: { Record: true },
    });

    // Flatten したデータ構造に変換
    const result = data.map((c) => ({
      contentId: c.id,
      recordId: c.recordId,
      year: c.Record.year,
      place: c.Record.place,
      activityType: c.Record.activityType,
      date: c.Record.date,
      details: c.Record.details,

      title: c.title,
      filename: c.filename,
      // content: c.content, // 必要なら
      // images: c.images,   // 必要なら
    }));

    // JSON を返す
    return NextResponse.json(result, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  const { title, content, filename, recordId } = await req.json();

  try {
    console.log("posting new content...");
    if (!title || !content || !recordId) {
      return NextResponse.json(
        { error: "title, content, filename, and recordId are all required" },
        { status: 400 }
      );
    }

    const newContent = await prisma.content.create({
      data: {
        title,
        content,
        filename,
        recordId,
      },
    });

    if (!newContent) {
      return NextResponse.json(
        { error: "Failed to post new content" },
        { status: 500 }
      );
    }

    console.log("new content successfully posted: ", newContent);
    return NextResponse.json(
      { success: true, data: newContent },
      { status: 201 }
    );
  } catch (error) {
    console.error("API Error: ", error);

    return NextResponse.json(
      { error: "Failed to post new content", details: error },
      { status: 500 }
    );
  }
}
