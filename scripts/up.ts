import fs from "fs-extra";
import path from "path";
import { dirname } from "path";
import { fileURLToPath } from "url";
import { PrismaClient } from "@prisma/client";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const prisma = new PrismaClient();

const csvToObject = (filePath: string) => {
  const data = fs.readFileSync(filePath, "utf-8");
  const entries = [];
  console.log(data);
  const columns = data.split("\n");

  const columnNames = columns[0]
    .split(",")
    .map((name) => name.replace(/[\n\r]+/g, ""));
  console.log("column names: ", columnNames);

  for (let i = 1; i < columns.length; i++) {
    const values = columns[i].split(",");
    const entry: { [key: string]: string } = {};
    for (let j = 0; j < columnNames.length; j++) {
      const value = values[j].replace(/[\n\r]+/g, "");
      entry[columnNames[j]] = value;
    }
    entries.push(entry);
  }
  console.log(entries);

  console.log(entries[0]["id"]);
  return entries;
};

const up = async () => {
  console.log("reading from CSV file...");
  const userFilePath = path.join(
    __dirname,
    "oct2025Backup",
    "User_rows(1).csv",
  );
  // const roleFilePath = path.join(
  //   __dirname,
  //   "oct2025Backup",
  //   "Role_rows(1).csv"
  // );
  // const recordFilePath = path.join(
  //   __dirname,
  //   "oct2025Backup",
  //   "Record_rows(1).csv"
  // );
  //   const memberFilePath = path.join(
  //     __dirname,
  //     "oct2025Backup",
  //     "Member_rows(1).csv"
  //   );

  const users = csvToObject(userFilePath);
  // const roles = csvToObject(roleFilePath);
  // const records = csvToObject(recordFilePath);
  //   const members = csvToObject(memberFilePath);

  console.log("finished reading from CSV file.");

  //   console.log("users: ", users);
  //   console.log("roles: ", roles);
  //   console.log("records: ", records);

  try {
    for (const user of users) {
      console.log(`Inserting user: ${user["name"]}`);
      await prisma.user.create({
        data: {
          id: user["id"],
          email: user["email"],
          name: user["name"],
          grade: user["grade"] != "" ? parseInt(user["grade"]) : null,
        },
      });
    }
  } catch (error) {
    console.error("Error inserting users:", error);
  }
  console.log("Finished inserting users.");
};

up();
