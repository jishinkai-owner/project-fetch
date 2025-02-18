import "dotenv/config";
import fs from "fs-extra";
import path from "path";
import { createClient } from "@supabase/supabase-js";

console.log("🚀 スクリプト開始: uploadMountains.ts");

// ✅ 環境変数のチェック
const NEXT_PUBLIC_SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!NEXT_PUBLIC_SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
  console.error("❌ 環境変数が正しく設定されていません。");
  process.exit(1);
}

// ✅ Supabase クライアント作成
const supabase = createClient(NEXT_PUBLIC_SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

// ✅ ベースディレクトリ設定（2023年と2024年に対応）
const BASE_DIRS = [
  path.join(process.cwd(), "src", "content", "yama", "2023"),
  path.join(process.cwd(), "src", "content", "yama", "2024")
];

// ✅ フォルダ・ファイル名からデータを解析し、.mdx / .md の内容を取得する関数
const getMarkdownFiles = (dirs: string[]) => {
  const results = [];

  for (const dir of dirs) {
    const year = parseInt(path.basename(dir), 10) || null; // `null` に修正
    const items = fs.readdirSync(dir, { withFileTypes: true });

    for (const item of items) {
      if (item.isDirectory()) {
        // 📂 フォルダ (2023のような構成)
        console.log(`📁 解析中 (フォルダ): ${item.name}`);

        const match = item.name.match(/^(\d{4})\.(\d{2})\.(.+?)\.(.+)$/);
        if (!match) {
          console.warn(`⚠️ フォーマットエラー: ${item.name}`);
          continue;
        }

        const [, , month, mountainname, teamname] = match.map(value => value.trim());
        const parsedMonth = parseInt(month, 10);
        const validMonth = isNaN(parsedMonth) ? null : parsedMonth; // `null` に修正

        const recordPath = path.join(dir, item.name);
        const mdxFiles = fs.readdirSync(recordPath).filter(file => file.endsWith(".mdx") || file.endsWith(".md"));

        if (mdxFiles.length === 0) {
          console.warn(`⚠️ .mdx / .md ファイルが見つかりません: ${item.name}`);
          continue;
        }

        for (const mdxFile of mdxFiles) {
          const filePath = path.join(recordPath, mdxFile);
          const content = fs.readFileSync(filePath, "utf-8").trim() || null; // `null` に修正

          if (!content) {
            console.warn(`⚠️ 空のファイル: ${mdxFile}`);
            continue;
          }

          results.push({
            year: year || null, // `null` に修正
            month: validMonth,
            mountainname: mountainname || null, // `null` に修正
            teamname: teamname || "なし",
            content
          });
        }
      } else if (item.isFile() && (item.name.endsWith(".mdx") || item.name.endsWith(".md"))) {
        // 📄 直置きファイル (2024のような構成)
        console.log(`📄 解析中 (ファイル): ${item.name}`);

        const match = item.name.match(/^(\d{4})_(.+?)_(.+?)\.(mdx|md)$/);
        if (!match) {
          console.warn(`⚠️ フォーマットエラー: ${item.name}`);
          continue;
        }

        const [, yearStr, mountainname, teamname] = match.map(value => value.trim());
        const parsedYear = parseInt(yearStr, 10) || null; // `null` に修正
        const content = fs.readFileSync(path.join(dir, item.name), "utf-8").trim() || null; // `null` に修正

        results.push({
          year: parsedYear,
          month: null, // `null` に修正
          mountainname: mountainname || null, // `null` に修正
          teamname: teamname || "なし",
          content
        });
      }
    }
  }

  return results;
};

// ✅ バッチ処理のための関数
const chunkArray = <T>(array: T[], size: number): T[][] =>
  Array.from({ length: Math.ceil(array.length / size) }, (_, i) =>
    array.slice(i * size, i * size + size)
  );

// ✅ Supabase へのデータアップロード処理
const uploadMountainRecords = async () => {
  try {
    console.log("📌 ファイル情報を取得中...");
    const records = getMarkdownFiles(BASE_DIRS);
    console.log(`✅ ${records.length} 件のデータを取得`);

    if (records.length === 0) {
      console.warn("⚠️ アップロードするデータがありません。");
      return;
    }

    // 10件ごとに分割してアップロード
    const chunks = chunkArray(records, 10);
    for (const [index, chunk] of chunks.entries()) {
      console.log(`📌 ${index + 1}/${chunks.length} のバッチをアップロード中 (${chunk.length} 件)`);

      const { data, error } = await supabase.from("MountainRecord").insert(chunk);

      if (error) {
        console.error("❌ エラー詳細:", JSON.stringify(error, null, 2));
      } else {
        console.log("✅ バッチアップロード成功:", data);
      }
    }

    console.log("🚀 すべてのデータをアップロード完了！");
  } catch (error) {
    console.error("❌ 予期しないエラー:", error);
  }
};

// ✅ スクリプト実行
uploadMountainRecords();
