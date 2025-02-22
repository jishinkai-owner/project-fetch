// src/app/api/recordContents/route.ts
import { NextResponse } from "next/server";
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
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

