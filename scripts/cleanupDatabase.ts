/**
 * cleanupDatabase.ts
 * 
 * 間違って作成されたRecordとContentを削除するスクリプト
 * 
 * 使用方法:
 * npx tsx scripts/cleanupDatabase.ts
 */

import { PrismaClient } from "@prisma/client";
import "dotenv/config";

const prisma = new PrismaClient();

async function main() {
  console.log("🔍 データベースの現状を確認中...");

  // すべてのRecordを取得
  const allRecords = await prisma.record.findMany({
    include: {
      Content: true,
    },
    orderBy: [
      { activityType: 'asc' },
      { year: 'asc' },
      { place: 'asc' },
    ],
  });

  console.log(`\n📊 現在のRecord数: ${allRecords.length}`);
  
  const recordsByType = new Map<string, number>();
  const contentCount = allRecords.reduce((sum, r) => sum + r.Content.length, 0);
  
  for (const record of allRecords) {
    const type = record.activityType || 'unknown';
    recordsByType.set(type, (recordsByType.get(type) || 0) + 1);
  }

  console.log('\n📊 activityType別のRecord数:');
  for (const [type, count] of recordsByType.entries()) {
    console.log(`  - ${type}: ${count} 件`);
  }
  
  console.log(`\n📊 総Content数: ${contentCount}`);

  console.log('\n⚠️  すべてのRecordとContentを削除しますか？');
  console.log('⚠️  この操作は取り消せません！');
  console.log('\n削除を開始します...');

  // 削除を実行
  const deleteAll = true;

  if (deleteAll) {
    console.log('\n🗑️  削除を開始します...');
    
    // まずContentを削除
    const deletedContents = await prisma.content.deleteMany({});
    console.log(`✅ Content削除: ${deletedContents.count} 件`);
    
    // 次にRecordを削除
    const deletedRecords = await prisma.record.deleteMany({});
    console.log(`✅ Record削除: ${deletedRecords.count} 件`);
    
    console.log('\n✅ データベースのクリーンアップが完了しました！');
  } else {
    console.log('\n💡 削除はスキップされました。');
  }

  await prisma.$disconnect();
}

main().catch((error) => {
  console.error('❌ エラーが発生しました:', error);
  process.exit(1);
});
