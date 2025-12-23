import React, { Suspense } from "react";
import LoadingMemberPlaceholder from "./loading";
import MemberClient from "./client";
import { PrismaClient } from "@prisma/client";

// シングルトンパターンでPrismaClientを管理
const globalForPrisma = globalThis as unknown as { prisma: PrismaClient };
const prisma = globalForPrisma.prisma || new PrismaClient();
if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;

// メンバーの型定義
export type MemberDTO = {
  id: string;
  year: string;
  role: string | null;
  major?: string | null;
  nickname: string;
  profile?: string | null;
  src?: string | null; // 画像URL
};

const getMembers = async (): Promise<MemberDTO[]> => {
  try {
    console.log("📌 メンバーデータを取得開始...");

    const members: MemberDTO[] = await prisma.member.findMany({
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

    console.log("✅ メンバーデータ取得成功:", members.length, "件");

    return members;
  } catch (error) {
    console.error("❌ メンバー取得失敗: ", error);
    return [];
  }
};

const MemberPage: React.FC = async () => {
  const members = await getMembers();

  return (
    <Suspense fallback={<LoadingMemberPlaceholder />}>
      <MemberClient members={members} />
    </Suspense>
  );
};

export default MemberPage;

// 動的レンダリングを強制（キャッシュを完全に無効化）
export const dynamic = 'force-dynamic';
export const revalidate = 0;
