import fs from "fs";
import path from "path";

// 活動記録が保存されているフォルダ
const BASE_DIR = path.join(process.cwd(), "src", "content");

// Markdown / MDX ファイルを取得する関数
const getMarkdownFiles = (dir: string): string[] => {
  let results: string[] = [];
  const files = fs.readdirSync(dir, { withFileTypes: true });

  for (const file of files) {
    const fullPath = path.join(dir, file.name);

    if (file.isDirectory()) {
      // 再帰的にフォルダを検索
      results = results.concat(getMarkdownFiles(fullPath));
    } else if (file.name.endsWith(".md") || file.name.endsWith(".mdx")) {
      results.push(fullPath);
    }
  }
  return results;
};

// 全ての Markdown / MDX ファイルを取得
const allFiles = getMarkdownFiles(BASE_DIR);
console.log("📌 取得したファイル一覧:", allFiles);
