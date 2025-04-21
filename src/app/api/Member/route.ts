import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET() {
  try {
    console.log("📌 メンバーデータを取得開始...");

    const members = await prisma.member.findMany({
      select: {
        id: true,
        year: true,
        role: true,
        major: true,
        nickname: true,
        profile: true,
        src: true,
      },
    });

    console.log("✅ メンバーデータ取得成功:", members);

    return NextResponse.json(members);
  } catch (error) {
    console.error("❌ API エラー: ", error);
    return NextResponse.json(
      { error: "データ取得に失敗しました", details: error },
      { status: 500 }
    );
  }
}
