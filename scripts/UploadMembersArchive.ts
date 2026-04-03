/**
 * UploadMembersArchive.ts
 * 
 * 過去の部員情報（membersArchive.json）をデータベースに登録・更新・削除するスクリプト
 * 
 * 機能:
 * - scripts/membersArchive.jsonファイルから部員情報を読み込み
 * - 既存メンバー（name + year で識別）は更新、新規メンバーは作成（upsert方式）
 * - JSONに存在しないがDBに存在するメンバー（対象年度のみ）は削除
 * 
 * 対象ファイル: scripts/membersArchive.json
 * 含まれる年度: C3, C2, C1, C0, B9〜B0, A9, A8
 * 
 * 使用方法:
 * npx tsx scripts/UploadMembersArchive.ts
 */

import "dotenv/config";
import fs from "fs-extra";
import path from "path";
import { fileURLToPath } from "url";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// `__dirname` を ESM で再現
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// `scripts/` フォルダの `membersArchive.json` を取得
const filePath = path.join(__dirname, "membersArchive.json");

interface MemberInput {
  name?: string;
  year?: string;
  role?: string;
  major?: string;
  nickname?: string;
  profile?: string[] | string;
  src?: string;
}

const uploadMembersArchive = async () => {
  try {
    console.log("📌 membersArchive.json を読み込み中...");

    if (!fs.existsSync(filePath)) {
      console.error("❌ JSON ファイルが見つかりません！", filePath);
      return;
    }

    const members: MemberInput[] = await fs.readJson(filePath);
    console.log(`✅ JSON ファイル読み込み成功！ (${members.length} 人)`);

    // 処理結果のカウント
    let createdCount = 0;
    let updatedCount = 0;
    let deletedCount = 0;

    // JSONに存在するメンバーのキー（name + year）をSetで管理
    const jsonMemberKeys = new Set<string>();
    // JSONに存在する年度をSetで管理
    const jsonYears = new Set<string>();

    for (const member of members) {
      const memberName = member.name || "未設定";
      const memberYear = member.year && member.year.trim() !== "" ? member.year : "不明";
      const displayName = member.nickname || memberName;

      // キーをSetに追加
      jsonMemberKeys.add(`${memberName}|${memberYear}`);
      jsonYears.add(memberYear);

      console.log(`📌 処理中: ${displayName} (${memberYear})`);

      // 登録用データを準備
      const memberData = {
        name: memberName,
        year: memberYear,
        role: member.role || "",
        major: member.major || null,
        nickname: member.nickname || memberName,
        profile: Array.isArray(member.profile) ? member.profile.join("\n") : member.profile || "",
        src: member.src || "",
      };

      // 既存メンバーを name + year で検索
      const existingMember = await prisma.member.findFirst({
        where: {
          name: memberName,
          year: memberYear,
        },
      });

      if (existingMember) {
        // 既存メンバーを更新
        await prisma.member.update({
          where: { id: existingMember.id },
          data: memberData,
        });
        updatedCount++;
        console.log(`🔄 更新成功: ${displayName}`);
      } else {
        // 新規メンバーを作成
        await prisma.member.create({
          data: memberData,
        });
        createdCount++;
        console.log(`✅ 新規登録: ${displayName}`);
      }
    }

    // 削除同期: JSONに存在しないがDBに存在するメンバー（対象年度のみ）を削除
    console.log("\n📌 削除同期処理中...");
    const yearsArray = Array.from(jsonYears);

    // 対象年度のDBメンバーを取得
    const dbMembers = await prisma.member.findMany({
      where: {
        year: { in: yearsArray },
      },
    });

    for (const dbMember of dbMembers) {
      const key = `${dbMember.name}|${dbMember.year}`;
      if (!jsonMemberKeys.has(key)) {
        // JSONに存在しないメンバーを削除
        await prisma.member.delete({
          where: { id: dbMember.id },
        });
        deletedCount++;
        console.log(`🗑️ 削除: ${dbMember.nickname || dbMember.name} (${dbMember.year})`);
      }
    }

    console.log("\n" + "=".repeat(50));
    console.log("🚀 処理完了！");
    console.log(`  📊 合計処理: ${members.length} 人`);
    console.log(`  ✅ 新規登録: ${createdCount} 人`);
    console.log(`  🔄 更新: ${updatedCount} 人`);
    console.log(`  🗑️ 削除: ${deletedCount} 人`);
    console.log(`  📅 対象年度: ${yearsArray.join(", ")}`);
    console.log("=".repeat(50));

  } catch (error) {
    console.error("❌ データベース登録に失敗:", error);
  } finally {
    await prisma.$disconnect();
  }
};

// スクリプトを実行
uploadMembersArchive();
