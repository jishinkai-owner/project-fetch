/**
 * uploadUser.ts
 *
 * ユーザーデータをJSONファイルからデータベースに登録するスクリプト
 *
 * 機能:
 * - scripts/users.jsonファイルからユーザー情報を読み込み
 * - PrismaのUserテーブルにユーザーデータ（email, name）を登録
 * - 各ユーザーには一意のIDが自動で割り当てられる
 *
 * 対象ファイル: scripts/users.json
 * 期待するJSONフォーマット: [{"email": "user@example.com", "name": "ユーザー名"}, ...]
 *
 * 使用方法:
 * npm run tsx scripts/uploadUser.ts
 */

import { PrismaClient } from "@prisma/client";
import fs from "fs-extra";
import path from "path";
import { dirname } from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const prisma = new PrismaClient();
const uploadUser = async () => {
  try {
    console.log("uploading user data from JSON file...");

    const filePath = path.join(__dirname, "users.json");

    if (!fs.existsSync(filePath)) {
      console.error("JSON file not found!", filePath);
      return;
    }

    const users = await fs.readJson(filePath);
    console.log("JSON file read successfully!", users);

    for (const user of users) {
      const { email, name } = user;
      if (!email || !name) {
        console.error("Invalid user data:", user);
        continue;
      }
      console.log(`Registering user: ${name} (${email})`);
      await prisma.user.create({
        data: {
          id: "hello",
          email: email,
          name: name,
        },
      });
    }

    console.log("All users have been successfully registered to the database!");
    console.log("Disconnecting from the database...");
  } catch (error) {
    console.error("Failed to upload user data:", error);
  } finally {
    await prisma.$disconnect();
    console.log("Disconnected from the database.");
  }
};

uploadUser();
