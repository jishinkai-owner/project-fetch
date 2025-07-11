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

    // 画像がないメンバーにデフォルト画像を設定
    const membersWithDefaultImage = members.map(member => ({
      ...member,
      src: member.src && member.src.trim() !== "" ? member.src : "/member.jpg"
    }));

    console.log("✅ メンバーデータ取得成功:", membersWithDefaultImage.length, "件");

    return NextResponse.json(membersWithDefaultImage);
  } catch (error) {
    console.error("❌ API エラー: ", error);
    return NextResponse.json(
      { error: "データ取得に失敗しました", details: error },
      { status: 500 }
    );
  }
}
