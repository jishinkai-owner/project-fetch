/**
 * convertCsvToMembers.ts
 * 
 * CSVファイルからメンバーデータをJSONに変換するスクリプト
 * 
 * 機能:
 * - CSVファイルからメンバー情報を読み込み
 * - データをmembers.json形式に変換
 * - 画像データはsrcフィールドのみ抽出（FlickrのHTMLから画像URLを抽出）
 * - プロフィールデータは配列形式で保存
 * 
 * 使用方法:
 * npx tsx scripts/convertCsvToMembers.ts [CSVファイルパス]
 * 
 * 期待するCSV形式:
 * 名前,役職,学部,通称,プロフィール,写真リンク
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

// CSVを解析する簡単な関数
const parseCSV = (csvText: string): string[][] => {
  const lines = csvText.split('\n');
  const result: string[][] = [];
  
  for (const line of lines) {
    if (line.trim() === '') continue;
    
    const fields: string[] = [];
    let currentField = '';
    let inQuotes = false;
    
    for (let i = 0; i < line.length; i++) {
      const char = line[i];
      
      if (char === '"') {
        inQuotes = !inQuotes;
      } else if (char === ',' && !inQuotes) {
        fields.push(currentField.trim());
        currentField = '';
      } else {
        currentField += char;
      }
    }
    
    fields.push(currentField.trim());
    result.push(fields);
  }
  
  return result;
};

// FlickrのHTMLから画像URLを抽出
const extractImageUrl = (htmlString: string): string => {
  if (!htmlString || htmlString.trim() === '') {
    return '';
  }
  
  // src="..." の部分を抽出（実際の画像URL）
  const srcMatch = htmlString.match(/src="([^"]*live\.staticflickr\.com[^"]+)"/);
  if (srcMatch && srcMatch[1]) {
    return srcMatch[1];
  }
  
  // 直接live.staticflickr.comのURLが入っている場合
  const urlMatch = htmlString.match(/https:\/\/live\.staticflickr\.com\/[^\s"<>]+/);
  if (urlMatch) {
    return urlMatch[0];
  }
  
  return '';
};

const convertCsvToMembers = async () => {
  try {
    // コマンドライン引数からCSVファイルパスを取得
    const csvFilePath = process.argv[2];
    
    if (!csvFilePath) {
      console.error("❌ CSVファイルパスを指定してください");
      console.log("使用方法: npx tsx scripts/convertCsvToMembers.ts [CSVファイルパス]");
      process.exit(1);
    }

    // ファイルの存在確認
    if (!fs.existsSync(csvFilePath)) {
      console.error(`❌ ファイルが見つかりません: ${csvFilePath}`);
      process.exit(1);
    }

    console.log(`📌 CSVファイルを読み込み中: ${csvFilePath}`);

    // CSVファイルを読み込み
    const csvText = await fs.readFile(csvFilePath, 'utf-8');
    const csvData = parseCSV(csvText);
    
    if (csvData.length < 2) {
      console.error("❌ データが不足しています。ヘッダー行とデータ行が必要です。");
      process.exit(1);
    }

    // ヘッダー行を取得
    const headers = csvData[0];
    console.log("📋 検出されたヘッダー:", headers);

    // データ行を変換
    const members: MemberData[] = [];
    
    for (let i = 1; i < csvData.length; i++) {
      const row = csvData[i];
      
      // 空行をスキップ
      if (!row || row.length === 0 || !row.some(cell => cell && cell.trim() !== '')) {
        continue;
      }

      // CSVの列に基づいてデータを取得
      const name = row[0] || '';
      const role = row[1] || '';
      const major = row[2] || '';
      const nickname = row[3] || '';
      const profile = row[4] || '';
      const photoLink = row[5] || '';

      // 必須フィールドの確認（名前が空の場合はスキップ）
      if (!name.trim()) {
        console.warn(`⚠️ 行 ${i + 1}: 名前が空のためスキップします`);
        continue;
      }

      // 画像URLの抽出
      const imageUrl = extractImageUrl(photoLink);

      // データ変換
      const member: MemberData = {
        name: name,
        year: "C4", // CSVには年度情報がないので固定値
        role: role,
        major: major || undefined,
        nickname: nickname || name,
        profile: profile ? [profile] : [],
        src: imageUrl
      };

      members.push(member);
      console.log(`✅ 変換完了: ${member.name} (${member.nickname}) - ${member.role}`);
      if (imageUrl) {
        console.log(`  📸 画像URL: ${imageUrl}`);
      }
    }

    console.log(`📊 変換されたメンバー数: ${members.length} 人`);

    // 既存のmembers.jsonがある場合は確認
    const outputPath = path.join(__dirname, "members.json");
    let shouldOverwrite = true;
    
    if (fs.existsSync(outputPath)) {
      console.log("⚠️ 既存のmembers.jsonファイルが存在します。");
      console.log("🔄 上書きして新しいデータで置き換えます...");
    }

    if (shouldOverwrite) {
      // JSONファイルに保存
      await fs.writeJSON(outputPath, members, { spaces: 2 });
      console.log(`🚀 members.json ファイルを更新しました: ${outputPath}`);
    }

    // データ確認用：最初の3件を表示
    console.log("\n📝 変換されたデータ確認用（最初の3件）:");
    console.log(JSON.stringify(members.slice(0, 3), null, 2));

    // 画像付きメンバーの統計
    const membersWithImages = members.filter(m => m.src);
    console.log(`\n📊 統計:`);
    console.log(`  総メンバー数: ${members.length} 人`);
    console.log(`  画像付きメンバー: ${membersWithImages.length} 人`);
    console.log(`  画像なしメンバー: ${members.length - membersWithImages.length} 人`);

  } catch (error) {
    console.error("❌ 変換処理に失敗:", error);
    process.exit(1);
  }
};

// スクリプトを実行
convertCsvToMembers();
