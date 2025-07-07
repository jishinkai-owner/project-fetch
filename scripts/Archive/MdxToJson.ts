/**
 * MdxToJson.ts
 * 
 * 部員リストのMDXファイルをJSON形式に変換するスクリプト
 * 
 * 機能:
 * - src/app/member/legend.mdx から部員情報を抽出
 * - MDXコンテンツ内の <Member /> コンポーネントの属性を解析
 * - プロフィール、年次、所属、役割、画像URL等の詳細情報をパース
 * - 構造化されたJSONデータに変換してscripts/legend.jsonに保存
 * - 複数行プロフィールやimg属性の複雑な構造にも対応
 * 
 * 対象ファイル: src/app/member/legend.mdx
 * 出力ファイル: scripts/legend.json
 * 
 * 使用方法:
 * npm run tsx scripts/MdxToJson.ts
 * 
 * 注意: MDX内の<Member />コンポーネントの属性形式に依存
 */

//このスクリプトは部員リスト（MDXファイル）をJSON形式に変換するためのもので、主な機能は:
//src/app/member/index.mdxから部員情報を抽出
//MDXコンテンツから<Member /> コンポーネントの部員情報をパース
//プロファイル、所属、役割などの詳細情報をJSON形式に変換
//結果をscripts/members.jsonに保存
//MDXファイル内の<Member />コンポーネントに含まれる属性（プロフィール、年次、所属など）を解析し、構造化されたJSONデータに変換します。

import fs from "fs-extra";
import path from "path";
import { compile } from "@mdx-js/mdx";

// JSON ファイルの保存先を `scripts/` フォルダに明示的に設定
const jsonFilePath = path.join(process.cwd(), "scripts", "legend.json");

// 確認用のログ
console.log(`📌 JSON ファイルの出力先: ${jsonFilePath}`);

const extractMembersFromMDX = async () => {
  try {
    console.log("📌 MDX ファイルを読み込み中...");

    const mdxFilePath = path.join(process.cwd(), "src", "app", "member", "legend.mdx");

    if (!fs.existsSync(mdxFilePath)) {
      console.error(`❌ ファイルが見つかりません: ${mdxFilePath}`);
      return;
    }

    const mdxContent = await fs.readFile(mdxFilePath, "utf-8");
    console.log("✅ MDX ファイル読み込み成功！");

    const parsedData = await compile(mdxContent, { outputFormat: "function-body" });

    // MDX 内のデータを抽出
    const members = extractMembers(parsedData.toString());

    console.log("✅ データ抽出成功！", members);

    // JSON に保存
    await fs.writeJson(jsonFilePath, members, { spaces: 2 });

    console.log("🚀 MDX から JSON への変換が完了しました！");
  } catch (error) {
    console.error("❌ MDX の解析に失敗:", error);
  }
};

const extractMembers = (mdxText: string) => {
  const memberRegex = /<Member([\s\S]*?)\/>/g;
  const members: Record<string, string | string[] | Record<string, string>>[] = [];

  let match;
  while ((match = memberRegex.exec(mdxText)) !== null) {
    console.log(`📌 マッチした Member: ${match[0]}`);

    const attributes = match[1];
    const memberData: Record<string, string | string[] | Record<string, string>> = {};

    // `img={{ ... }}` のブロックを特別に処理する
    const imgMatch = attributes.match(/img=\{\{([\s\S]+?)\}\}/);
    if (imgMatch) {
      const imgAttributes = imgMatch[1]
        .split("\n")
        .map(line => line.trim())
        .filter(line => line.includes(":"));

      for (const attr of imgAttributes) {
        const [key, value] = attr.split(":").map(s => s.trim().replace(/["',]/g, ""));
        if (key === "year" || key === "name") {
          memberData[key] = value;
        }
        if (key === "img") {
          memberData[key] = {};
        }
        const srcMatch = match[1].match(/src:\s*"(https?:\/\/[^\s"]+)"/);
        memberData["src"] = srcMatch ? srcMatch[1] : "";
      }
    }

    // `profile` の処理（複数行のリストも対応）
    const profileMatch = attributes.match(/profile=\{\[([\s\S]*?)\]\}/);
    if (profileMatch) {
      memberData["profile"] = profileMatch[1]
        .split("\n") // 🔥 改行で分割
        .map(line => line.trim().replace(/^"|"$/g, "")) // 🔥 先頭・末尾の `"` を削除
        .filter(line => line.length > 0); // 🔥 空行を除外
    } else {
      // `profile="..."` の1行バージョンも対応
      const singleProfileMatch = attributes.match(/profile="([^"]+)"/);
      if (singleProfileMatch) {
        memberData["profile"] = [singleProfileMatch[1]]; // 🔥 1行でも配列で統一
      }
    }

    // その他の属性の処理
    for (const attr of attributes.matchAll(/(\w+)="([^"]+)"/g)) {
      const [, key, value] = attr;
      if (key !== "profile") {
        memberData[key] = value;
      }
    }

    members.push(memberData);
  }

  console.log("✅ 抽出された全 Member:", members);
  return members;
};

// スクリプト実行
extractMembersFromMDX();
