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
