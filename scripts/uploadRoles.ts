/**
 * uploadRoles.ts
 * 
 * ユーザーの役割・権限データをJSONファイルからデータベースに登録するスクリプト
 * 
 * 機能:
 * - scripts/roles.jsonファイルから役割情報を読み込み
 * - 既存のUserテーブルのemailを基に該当ユーザーを検索
 * - Roleテーブルに各種権限フラグ（isAdmin, isCL, isSL, isMeal, isEquipment, isWeather）を設定
 * - upsert処理により、既存レコードは更新、新規レコードは作成
 * 
 * 対象ファイル: scripts/roles.json
 * 期待するJSONフォーマット: [{"email": "user@example.com", "isAdmin": true, "isCL": false, ...}, ...]
 * 
 * 使用方法:
 * npm run tsx scripts/uploadRoles.ts
 */

import { PrismaClient } from "@prisma/client";
import fs from "fs-extra";
import path from "path";
import { dirname } from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const prisma = new PrismaClient();

const uploadRole = async () => {
  try {
    console.log("uploading role data from JSON file...");
    const filePath = path.join(__dirname, "roles.json");
    if (!fs.existsSync(filePath)) {
      console.error("JSON file not found!", filePath);
      return;
    }

    const roles = await fs.readJson(filePath);
    console.log("JSON file read successfully!", roles);
    for (const role of roles) {
      const { email, isAdmin, isCL, isSL, isMeal, isEquipment, isWeather } =
        role;
      if (!email) {
        console.error("Invalid user data:", role);
        continue;
      }

      const user = await prisma.user.findUnique({
        where: {
          email: email,
        },
        select: {
          id: true,
        },
      });
      if (!user) {
        console.error(`User with following email not found: ${email}`);
        continue;
      }
      console.log(`Registering user: ${email}`);
      await prisma.role.upsert({
        where: {
          userId: user.id,
        },
        update: {
          isAdmin: isAdmin ?? false,
          isCL: isCL ?? false,
          isSL: isSL ?? false,
          isMeal: isMeal ?? false,
          isEquipment: isEquipment ?? false,
          isWeather: isWeather ?? false,
        },
        create: {
          userId: user.id,
          isAdmin: isAdmin ?? false,
          isCL: isCL ?? false,
          isSL: isSL ?? false,
          isMeal: isMeal ?? false,
          isEquipment: isEquipment ?? false,
          isWeather: isWeather ?? false,
        },
      });
    }
  } catch (error) {
    console.error("Failed to upload role data:", error);
  } finally {
    await prisma.$disconnect();
    console.log("Disconnected from the database.");
  }
};

uploadRole();
