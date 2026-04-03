/**
 * updateMemberImages.ts
 * 
 * メンバーデータで画像がないメンバーの画像をデフォルト画像に設定するスクリプト
 * 
 * 機能:
 * - members.jsonを読み込み
 * - src フィールドが空文字列のメンバーを特定
 * - 該当メンバーの src を "member.jpg" に設定
 * - 更新されたデータをmembers.jsonに保存
 * 
 * 使用方法:
 * npx tsx scripts/updateMemberImages.ts
 */

import "dotenv/config";
import fs from "fs-extra";
import path from "path";
import { fileURLToPath } from "url";

// `__dirname` を ESM で再現
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

interface MemberData {
  name?: string;
  year: string;
  role: string;
  major?: string;
  nickname: string;
  profile: string[];
  src: string;
}

const updateMemberImages = async () => {
  try {
    const filePath = path.join(__dirname, "members.json");

    if (!fs.existsSync(filePath)) {
      console.error(`❌ members.jsonファイルが見つかりません: ${filePath}`);
      process.exit(1);
    }

    console.log("📌 members.jsonファイルを読み込み中...");

    // JSONファイルを読み込み
    const members: MemberData[] = await fs.readJSON(filePath);

    console.log(`✅ ${members.length} 人のメンバーデータを読み込み完了`);

    // 画像がないメンバーを特定して更新
    let updatedCount = 0;
    const updatedMembers = members.map(member => {
      if (member.src === "" || !member.src) {
        updatedCount++;
        console.log(`🔄 更新: ${member.name || member.nickname} の画像を member.jpg に設定`);
        return {
          ...member,
          src: "member.jpg"
        };
      }
      return member;
    });

    console.log(`📊 統計:`);
    console.log(`  総メンバー数: ${members.length} 人`);
    console.log(`  更新されたメンバー: ${updatedCount} 人`);
    console.log(`  画像付きメンバー（更新前から）: ${members.filter(m => m.src && m.src !== "").length} 人`);

    // 更新されたデータを保存
    await fs.writeJSON(filePath, updatedMembers, { spaces: 2 });

    console.log(`🚀 members.json ファイルを更新しました: ${filePath}`);

    // 更新結果の確認表示
    console.log("\n📝 更新されたメンバーの確認:");
    updatedMembers.filter(m => m.src === "member.jpg").slice(0, 5).forEach(member => {
      console.log(`  - ${member.name || member.nickname}: ${member.src}`);
    });

    if (updatedCount > 5) {
      console.log(`  ... 他 ${updatedCount - 5} 人`);
    }

  } catch (error) {
    console.error("❌ 更新処理に失敗:", error);
    process.exit(1);
  }
};

// スクリプトを実行
updateMemberImages();
