/**
 * delete2011_2012.ts
 *
 * 2011年と2012年の山行記録データをデータベースから削除するスクリプト
 *
 * 使用方法:
 * npx ts-node scripts/delete2011_2012.ts
 */

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("2011年と2012年のデータを削除します...\n");

  // 削除対象の年
  const targetYears = [2011, 2012];

  for (const year of targetYears) {
    // まず対象のRecordを取得
    const records = await prisma.record.findMany({
      where: { year },
      include: { Content: true },
    });

    console.log(`${year}年: ${records.length}件のRecordが見つかりました`);

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
      where: { year },
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
