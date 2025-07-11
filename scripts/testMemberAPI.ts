/**
 * testMemberAPI.ts
 * 
 * Member APIの動作テスト用スクリプト
 * 
 * 機能:
 * - Member APIエンドポイントにリクエストを送信
 * - レスポンスデータの内容を確認
 * - デフォルト画像の設定が正しく動作しているかチェック
 * 
 * 使用方法:
 * npx tsx scripts/testMemberAPI.ts
 */

import "dotenv/config";

const testMemberAPI = async () => {
  try {
    console.log("📌 Member APIをテスト中...");
    
    // 開発サーバーが動いていることを前提
    const response = await fetch("http://localhost:3000/api/Member");
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const members = await response.json();
    
    console.log(`✅ API レスポンス取得成功: ${members.length} 件`);
    
    // デフォルト画像が設定されているメンバーをチェック
    const defaultImageMembers = members.filter((m: any) => m.src === "/member.jpg");
    const customImageMembers = members.filter((m: any) => m.src && m.src !== "/member.jpg");
    
    console.log("\n📊 画像設定統計:");
    console.log(`  デフォルト画像 (/member.jpg): ${defaultImageMembers.length} 人`);
    console.log(`  カスタム画像: ${customImageMembers.length} 人`);
    
    console.log("\n📝 デフォルト画像が設定されたメンバー (最初の5人):");
    defaultImageMembers.slice(0, 5).forEach((member: any) => {
      console.log(`  - ${member.nickname}: ${member.src}`);
    });
    
    console.log("\n📝 カスタム画像のメンバー (最初の3人):");
    customImageMembers.slice(0, 3).forEach((member: any) => {
      console.log(`  - ${member.nickname}: ${member.src}`);
    });
    
  } catch (error) {
    console.error("❌ API テストエラー:", error);
    console.log("💡 開発サーバーが起動していることを確認してください: npm run dev");
  }
};

// スクリプトを実行
testMemberAPI();
