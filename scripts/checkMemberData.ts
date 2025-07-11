import "dotenv/config";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

(async () => {
  try {
    const members = await prisma.member.findMany({ 
      select: { nickname: true, src: true },
      take: 10
    });
    
    console.log('データベースのメンバーデータサンプル:');
    members.forEach(m => {
      console.log(`${m.nickname}: '${m.src}' (type: ${typeof m.src}, length: ${m.src?.length || 0})`);
    });
    
    // Null値の数も確認
    const nullCount = members.filter(m => !m.src || m.src.trim() === '').length;
    console.log(`\n画像なしメンバー数: ${nullCount}/${members.length}`);
    
  } catch (error) {
    console.error('エラー:', error);
  } finally {
    await prisma.$disconnect();
  }
})();
