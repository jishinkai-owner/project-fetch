/**
 * uploadActivityRecords.ts
 * 
 * 活動記録インデックスファイルから活動記録データを抽出してデータベースに登録するスクリプト
 * 
 * 機能:
 * - src/content/yama/index.md から山行記録の一覧情報を解析
 * - 正規表現を使って日付、タイトル、ファイル名、参加者情報を抽出
 * - PrismaのActivityRecordテーブルに年度、日付、タイトル、ファイル名、場所、活動タイプを登録
 * - upsert処理により重複データの回避
 * - リンク形式とプレーンテキスト形式の両方に対応
 * 
 * 対象ファイル: src/content/yama/index.md
 * 解析対象形式: "YYYY/MM/DD: [タイトル](リンク)" または "YYYY/MM/DD: タイトル (参加者)"
 * 
 * 使用方法:
 * npm run tsx scripts/uploadActivityRecords.ts
 */

import { PrismaClient } from '@prisma/client';
import "dotenv/config";
import fs from "fs-extra";
import path from "path";

// ── Prisma クライアント ────────────────────────────────────────────

class ExtendedPrismaClient extends PrismaClient {
  constructor() {
    super();
  }
}

const prisma = new ExtendedPrismaClient();

// ── Markdown ファイル読み込みと解析 ────────────────────────────────
const BASE_FILE = path.resolve(process.cwd(), "src", "content", "yama", "index.md");

// 活動記録を解析する正規表現
const activityRegex = /(\d{4})\/(\d{1,2})\/(\d{1,2})?(?:(?:～|-)(\d{1,2}))?:\s*(?:\[([^\(\[\{【\]]+)\]\(([^)]+)\)|([^\(\[\{【\]]+))?(?:[\(\（]([\s\S]+)[\)\）])?/;

const extractActivityDetails = (line: string) => {
  console.log("Parsing line:", line);
  const match = line.match(activityRegex);
  if (!match) {
    console.log("⚠️ No match for line:", line);
    return null;
  }

  const [, year, month, day, dayRange, linkedTitle, linkedFilename, rawTitle, rawParticipants] = match;
  const date = day ? `${month}/${day}${dayRange ? `～${dayRange}` : ""}` : month;
  const title = linkedTitle || rawTitle?.trim() || "";
  const filename = linkedFilename?.split("/").pop() || "";
  let participants: { title: string; filename: string }[] = [];

  if (rawParticipants) {
    const participantMatches = [...rawParticipants.matchAll(/\[(.*?)編\]\(([^)]+)\)/g)];
    participants = participantMatches.map(pm => ({
      title: `${pm[1]}編`,
      filename: pm[2].split("/").pop() || ""
    }));
  }

  console.log(`✅ Extracted Data: { year: ${year}, date: ${date}, title: ${title}, filename: ${filename}, participants: ${participants.length} }`);

  return {
    year: parseInt(year, 10),
    date,
    title,
    filename,
    participants
  };
};

const getActivityRecords = (filePath: string) => {
  console.log("Reading file:", filePath);
  if (!fs.existsSync(filePath)) {
    console.error("❌ File not found:", filePath);
    return [];
  }

  const content = fs.readFileSync(filePath, "utf-8");
  console.log("📄 File content preview:", content.slice(0, 500));

  const lines = content.split("\n").filter(line => line.trim() !== "");
  const results = lines.map(extractActivityDetails).filter((x): x is NonNullable<typeof x> => x !== null);

  console.log("✅ Extracted Records:", results);
  return results;
};

// ── アップロード処理 ────────────────────────────────────────────────
const uploadRecords = async () => {
  const records = getActivityRecords(BASE_FILE);
  if (records.length === 0) {
    console.log("No records found. Check file path and content structure.");
    return;
  }

  for (const record of records) {
    const baseFilename = record.filename || record.title;
    if (!baseFilename) {
      console.warn(`⚠️ Skipping record due to missing filename and title:`, record);
      continue;
    }

    // `mountainname` を `filename` から取得
    const mountainname = baseFilename.replace(/\..*$/, "");

    try {
      console.log("📌 Uploading ActivityRecord:", {
        year: record.year,
        date: record.date,
        title: record.title,
        filename: baseFilename,
        activityType: "yama",
      });

      await prisma.activityRecord.upsert({
              where: {
                id: 0, // Replace with the appropriate id value
                filename: baseFilename,
              },
              update: {
                year: record.year,
                date: record.date,
                title: record.title,
                filename: baseFilename,
                place: "Unknown", // Add a default or appropriate value for 'place'
                activityType: "yama",
              },
              create: {
                year: record.year,
                date: record.date,
                title: record.title,
                filename: baseFilename,
                place: "Unknown", // Add a default or appropriate value for 'place'
                activityType: "yama",
              },
            });

      console.log("📌 Uploading RecordContent:", {
        mountainname,
      });

    } catch (error) {
      console.error(`❌ Error inserting record: ${baseFilename}`, error);
    }
  }
};

uploadRecords()
  .catch((error) => {
    console.error("❌ Unexpected error:", error);
  })
  .finally(async () => {
    console.log("🛑 Disconnecting Prisma...");
    await prisma.$disconnect();
  });
