import "dotenv/config";
import fs from "fs";
import path from "path";
import { createClient } from "@supabase/supabase-js";

// Supabase クライアント作成
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

const BASE_DIR = path.join(process.cwd(), "src", "content", "yama");

// Markdown / MDX ファイルを取得する関数
const getMarkdownFiles = (dir: string, year: number): { filePath: string; year: number; title: string }[] => {
  let results: { filePath: string; year: number; title: string }[] = [];
  const files = fs.readdirSync(dir, { withFileTypes: true });

  for (const file of files) {
    const fullPath = path.join(dir, file.name);

    if (file.isDirectory()) {
      const yearMatch = file.name.match(/^\d{4}$/);
      if (yearMatch) {
        const folderYear = parseInt(file.name, 10);
        results = results.concat(getMarkdownFiles(fullPath, folderYear));
      } else {
        const activityYear = parseInt(path.basename(path.dirname(fullPath)), 10);
        results = results.concat(getMarkdownFiles(fullPath, activityYear));
      }
    } else if (file.name.endsWith(".md") || file.name.endsWith(".mdx")) {
      let activityYear = year;
      const activityTitle = path.basename(file.name, path.extname(file.name));

      if (year === 0) {
        const parentFolder = path.basename(path.dirname(fullPath));
        const yearMatch = parentFolder.match(/^\d{4}$/);
        if (yearMatch) {
          activityYear = parseInt(parentFolder, 10);
        }
      }

      results.push({ filePath: fullPath, year: activityYear, title: activityTitle });
    }
  }
  return results;
};

// ファイルの内容を Supabase に保存
const uploadActivities = async () => {
  const files = getMarkdownFiles(BASE_DIR, 0);

  for (const { filePath, year, title } of files) {
    const content = fs.readFileSync(filePath, "utf-8");

    console.log(`📌 アップロード: ${title} (${year})`);

    const { data, error } = await supabase
      .from("activity_records")
      .insert([{ title, content, year }]);

    if (error) {
      console.error("❌ アップロード失敗:", JSON.stringify(error, null, 2)); // エラー詳細を表示
    } else {
      console.log("✅ 成功:", data);
    }
  }
};

// 実行
uploadActivities();
