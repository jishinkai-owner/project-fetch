/**
 * deleteTsuriTabiOther.ts
 *
 * tsuri, tabi, otherの記録データをデータベースから削除するスクリプト
 *
 * 使用方法:
 * npx tsx scripts/deleteTsuriTabiOther.ts
 */

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("tsuri, tabi, otherのデータを削除します...\n");

  // 削除対象のactivityType
  const targetTypes = ["tsuri", "tabi", "other"];

  for (const activityType of targetTypes) {
    // まず対象のRecordを取得
    const records = await prisma.record.findMany({
      where: { activityType },
      include: { Content: true },
    });

    console.log(`${activityType}: ${records.length}件のRecordが見つかりました`);

    // 各RecordのContentを削除
    let contentCount = 0;
    for (const record of records) {
      if (record.Content.length > 0) {
        await prisma.content.deleteMany({
          where: { recordId: record.id },
        });
        contentCount += record.Content.length;
      }
    }
    console.log(`  - ${contentCount}件のContentを削除しました`);

    // Recordを削除
    const deletedRecords = await prisma.record.deleteMany({
      where: { activityType },
    });
    console.log(`  - ${deletedRecords.count}件のRecordを削除しました\n`);
  }

  console.log("削除完了!");
}

main()
  .catch((e) => {
    console.error("エラーが発生しました:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
