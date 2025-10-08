/**
 * convertExcelToMembers.ts
 * 
 * ExcelファイルからメンバーデータをJSONに変換するスクリプト
 * 
 * 機能:
 * - Excelファイルからメンバー情報を読み込み
 * - データをmembers.json形式に変換
 * - 画像データは src フィールドのみ抽出
 * - プロフィールデータは配列形式で保存
 * 
 * 使用方法:
 * npx tsx scripts/convertExcelToMembers.ts [Excelファイルパス]
 * 
 * 期待するExcel形式:
 * | name | year | role | major | nickname | profile | src |
 * |------|------|------|-------|----------|---------|-----|
 */

import "dotenv/config";
import fs from "fs-extra";
import path from "path";
import { fileURLToPath } from "url";
import * as XLSX from "xlsx";

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

const convertExcelToMembers = async () => {
  try {
    // コマンドライン引数からExcelファイルパスを取得
    const excelFilePath = process.argv[2];
    
    if (!excelFilePath) {
      console.error("❌ Excelファイルパスを指定してください");
      console.log("使用方法: npx tsx scripts/convertExcelToMembers.ts [Excelファイルパス]");
      process.exit(1);
    }

    // ファイルの存在確認
    if (!fs.existsSync(excelFilePath)) {
      console.error(`❌ ファイルが見つかりません: ${excelFilePath}`);
      process.exit(1);
    }

    console.log(`📌 Excelファイルを読み込み中: ${excelFilePath}`);

    // Excelファイルを読み込み
    const workbook = XLSX.readFile(excelFilePath);
    const sheetName = workbook.SheetNames[0]; // 最初のシートを使用
    const worksheet = workbook.Sheets[sheetName];

    console.log(`✅ シート "${sheetName}" を読み込み成功`);

    // ワークシートをJSONに変換
    const rawData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
    
    if (rawData.length < 2) {
      console.error("❌ データが不足しています。ヘッダー行とデータ行が必要です。");
      process.exit(1);
    }

    // ヘッダー行を取得
    const headers = rawData[0] as string[];
    console.log("📋 検出されたヘッダー:", headers);

    // データ行を変換
    const members: MemberData[] = [];
    
    for (let i = 1; i < rawData.length; i++) {
      const row = rawData[i] as any[];
      
      // 空行をスキップ
      if (!row || row.length === 0 || !row.some(cell => cell)) {
        continue;
      }

      // ヘッダーとデータを対応付け
      const memberData: any = {};
      headers.forEach((header, index) => {
        if (row[index] !== undefined && row[index] !== null && row[index] !== "") {
          memberData[header] = row[index];
        }
      });

      // 必須フィールドの確認
      if (!memberData.nickname) {
        console.warn(`⚠️ 行 ${i + 1}: nicknameが空のためスキップします`);
        continue;
      }

      // データ変換
      const member: MemberData = {
        name: memberData.name || memberData.nickname,
        year: memberData.year || "不明",
        role: memberData.role || "",
        major: memberData.major || null,
        nickname: memberData.nickname,
        profile: memberData.profile ? 
          (Array.isArray(memberData.profile) ? memberData.profile : [memberData.profile.toString()]) : 
          [],
        src: memberData.src || ""
      };

      // 画像URLの抽出（srcフィールドのみ）
      if (memberData.src && typeof memberData.src === 'string') {
        // URLが複数ある場合は最初の1つを取得
        const urlMatch = memberData.src.match(/https?:\/\/[^\s,]+/);
        member.src = urlMatch ? urlMatch[0] : "";
      }

      members.push(member);
      console.log(`✅ 変換完了: ${member.nickname} (${member.role})`);
    }

    console.log(`📊 変換されたメンバー数: ${members.length} 人`);

    // JSONファイルに保存
    const outputPath = path.join(__dirname, "members.json");
    await fs.writeJSON(outputPath, members, { spaces: 2 });

    console.log(`🚀 members.json ファイルを更新しました: ${outputPath}`);
    console.log("📝 データ確認用:");
    console.log(JSON.stringify(members.slice(0, 2), null, 2)); // 最初の2件を表示

  } catch (error) {
    console.error("❌ 変換処理に失敗:", error);
    process.exit(1);
  }
};

// スクリプトを実行
convertExcelToMembers();
