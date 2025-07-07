/**
 * UploadMembers.ts
 * 
 * 部員情報をJSONファイルからデータベースに登録するスクリプト
 * 
 * 機能:
 * - scripts/members.jsonファイルから部員情報を読み込み
 * - PrismaのMemberテーブルに部員データ（name, year, role, major, nickname, profile, src）を登録
 * - プロフィールが配列の場合は改行区切りの文字列に変換
 * - 空のデータは適切なデフォルト値で補完
 * 
 * 対象ファイル: scripts/members.json
 * 期待するJSONフォーマット: [{"name": "名前", "year": "年次", "role": "役職", "nickname": "ニックネーム", "profile": ["プロフィール"], "src": "画像URL"}, ...]
 * 
 * 使用方法:
 * npm run tsx scripts/UploadMembers.ts
 */

import fs from "fs-extra";
import path from "path";
import { fileURLToPath } from "url";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// `__dirname` を ESM で再現
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// `scripts/` フォルダの `members.json` を取得
const filePath = path.join(__dirname, "members.json");

const uploadMembers = async () => {
  try {
    console.log("📌 JSON ファイルを読み込み中...");

    if (!fs.existsSync(filePath)) {
      console.error("❌ JSON ファイルが見つかりません！", filePath);
      return;
    }

    const members = await fs.readJson(filePath);
    console.log("✅ JSON ファイル読み込み成功！", members);

    for (const member of members) {
      console.log(`📌 登録中: ${member.nickname} (${member.role})`);

      await prisma.member.create({
        data: {
          name: member.name || "未設定",
          year: member.year && member.year.trim() !== "" ? member.year : "不明",
          role: member.role || "",
          major: member.major || null,
          nickname: member.nickname || "名無し",
          profile: Array.isArray(member.profile) ? member.profile.join("\n") : member.profile || "",
          src: member.src || "", 
        },
      });

      console.log(`✅ 登録成功: ${member.nickname}`);
    }

    console.log("🚀 すべてのメンバーをデータベースに登録完了！");
  } catch (error) {
    console.error("❌ データベース登録に失敗:", error);
  } finally {
    await prisma.$disconnect();
  }
};

// スクリプトを実行
uploadMembers();
