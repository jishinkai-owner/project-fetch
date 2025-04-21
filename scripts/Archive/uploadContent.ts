import "dotenv/config";
import fs from "fs-extra";
import path from "path";
import { createClient } from "@supabase/supabase-js";
import { PrismaClient } from "@prisma/client"; // ★ 1. PrismaClient をインポート

// Prisma クライアント
const prisma = new PrismaClient();

console.log("🚀 スクリプト開始: uploadContent.ts");

// ✅ 環境変数のチェック
const NEXT_PUBLIC_SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!NEXT_PUBLIC_SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
  console.error("❌ 環境変数が正しく設定されていません。");
  process.exit(1);
}

// ✅ Supabase クライアント作成（画像アップロード用）
const supabase = createClient(NEXT_PUBLIC_SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

// ✅ ベースディレクトリ設定（全年度対応）
const BASE_DIR = path.join(process.cwd(), "src", "content", "yama");

// ✅ 指定されたフォルダ内の Markdown ファイルと画像を解析
/**
 * @returns {
 *   year: number;
 *   filename: string; // 例: "2007/Adatara/20070623adatara"
 *   content: string;
 *   images: string[]; // ローカルファイルパス
 * }[]
 */
const getMarkdownFiles = (dir: string) => {
  const results = [];
  // 年度ディレクトリを走査
  const years = fs.readdirSync(dir, { withFileTypes: true }).filter(dirent => dirent.isDirectory());

  for (const yearDir of years) {
    const year = parseInt(yearDir.name, 10);
    if (isNaN(year) || year < 1900) continue; // 年のフォーマットチェック

    const yearPath = path.join(dir, yearDir.name);
    // 年度ディレクトリ内の各「山行フォルダ」を走査
    const records = fs.readdirSync(yearPath, { withFileTypes: true }).filter(dirent => dirent.isDirectory());

    for (const record of records) {
      const recordPath = path.join(yearPath, record.name);
      const mdxFiles = fs
        .readdirSync(recordPath)
        .filter(file => file.endsWith(".mdx") || file.endsWith(".md"));

      if (mdxFiles.length === 0) {
        console.warn(`⚠️ .mdx / .md ファイルが見つかりません: ${record.name}`);
        continue;
      }

      for (const mdxFile of mdxFiles) {
        const filePath = path.join(recordPath, mdxFile);
        const rawContent = fs.readFileSync(filePath, "utf-8").trim();
        if (!rawContent) {
          console.warn(`⚠️ 空のファイル: ${mdxFile}`);
          continue;
        }

        // ★ ② Contentから front matter と import 行を削除
        let cleanedContent = rawContent.replace(/^---[\s\S]*?---\s*/, "");
        cleanedContent = cleanedContent
          .split("\n")
          .filter(line => !line.trim().startsWith("import "))
          .join("\n")
          .trim();

        // 画像ファイルを取得（jpg, jpeg, png）
        const images = fs
          .readdirSync(recordPath)
          .filter(file => file.match(/\.(jpg|jpeg|png)$/i))
          .map(file => path.join(recordPath, file));

        // ★ ① filename を "2007/Adatara/20070623adatara" の形式に変更（拡張子削除、スラッシュ区切り）
        const filename = `${yearDir.name}/${record.name}/${mdxFile.replace(/\.(mdx|md)$/, "")}`;

        results.push({
          year,
          filename,
          content: cleanedContent,
          images,
        });
      }
    }
  }
  return results;
};

// ✅ Supabase に画像をアップロード
const uploadImage = async (filePath: string, year: number, folderName: string) => {
  const fileName = path.basename(filePath);
  const storagePath = `images/${year}/${folderName}/${fileName}`;

  const fileBuffer = fs.readFileSync(filePath);
  const { data, error } = await supabase.storage.from("images").upload(storagePath, fileBuffer, {
    contentType: "image/jpeg",
    upsert: true,
  });

  if (error) {
    console.error(`❌ 画像アップロード失敗: ${filePath}`, error);
    return null;
  }

  // Public URL を返す
  return `${NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/${data.path}`;
};

// ✅ バッチ処理のための関数
const chunkArray = <T>(array: T[], size: number): T[][] =>
  Array.from({ length: Math.ceil(array.length / size) }, (_, i) =>
    array.slice(i * size, i * size + size)
  );

// ✅ メインのアップロード処理
const uploadRecordContent = async () => {
  try {
    console.log("📌 ファイル情報を取得中...");
    const records = getMarkdownFiles(BASE_DIR);
    console.log(`✅ ${records.length} 件のデータを取得`);

    if (records.length === 0) {
      console.warn("⚠️ アップロードするデータがありません。");
      return;
    }

    // まとめてアップロードするときに負荷を避けるためバッチ化
    const chunks = chunkArray(records, 10);

    for (const [index, chunk] of chunks.entries()) {
      console.log(`📌 ${index + 1}/${chunks.length} のバッチをアップロード中 (${chunk.length} 件)`);

      for (const record of chunk) {
        // 画像を Supabase Storage にアップロード
        const uploadedImages: string[] = [];
        for (const imagePath of record.images) {
          // フォルダ名には record.name（=山行フォルダ名）を使うのも一案だが
          // ここでは filename のディレクトリ部分を使ってもOK
          // ただし path に ":" や "/" が入ると不具合になる可能性があるので注意
          const folderName = path.basename(path.dirname(imagePath));
          const imageUrl = await uploadImage(imagePath, record.year, folderName);
          if (imageUrl) uploadedImages.push(imageUrl);
        }

        // ★ Prisma で RecordContent テーブルに insert
        try {
          await prisma.recordContent.create({
            data: {
              year: record.year,          // Int?
              filename: record.filename,  // String @unique
              content: record.content,    // String
              images: uploadedImages,     // String[]
              // createdAt はデフォルト値 now() が入るので指定不要
            },
          });
          console.log(`✅ 記録データアップロード成功: ${record.filename}`);
        } catch (err) {
          console.error(`❌ Prisma でのアップロード失敗: ${record.filename}`, err);
        }
      }
    }

    console.log("🚀 すべてのデータをアップロード完了！");
  } catch (error) {
    console.error("❌ 予期しないエラー:", error);
  } finally {
    // Prisma 接続を終了
    await prisma.$disconnect();
  }
};

// ✅ スクリプト実行
uploadRecordContent();
