import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const seedRoles = async () => {
  console.log("Seeding roles data...");

  const rolesData: { name: string; description: string }[] = [
    { name: "Admin", description: "自親会HP管理者" },
    { name: "CL", description: "CL" },
    { name: "SL", description: "SL" },
    { name: "Meal", description: "食事係" },
    { name: "Equipment", description: "装備係" },
    { name: "Weather", description: "天気図係" },
  ];

  try {
    for (const roleData of rolesData) {
      const { name, description } = roleData;
      await prisma.role.create({
        data: {
          name: name,
          description: description,
        },
      });
      console.log(`Role created: ${name}`);
    }
  } catch (error) {
    console.error("Error seeding roles data:", error);
  }
};

seedRoles();
//
const addDiscordRoleIds = async () => {
  console.log("Adding Discord Role IDs...");

  const roleDiscordIds: { name: string; discordRoleId: string }[] = [
    { name: "Admin", discordRoleId: "1143235241033609337" },
    { name: "CL", discordRoleId: "1091925379540852828" },
    { name: "SL", discordRoleId: "1091929637023658024" },
    { name: "Meal", discordRoleId: "1230085573021270036" },
    { name: "Equipment", discordRoleId: "1230084175843819551" },
    { name: "Weather", discordRoleId: "1230081030912872449" },
  ];

  try {
    for (const roleData of roleDiscordIds) {
      const { name, discordRoleId } = roleData;

      await prisma.role.updateMany({
        where: { name: name },
        data: { discordRoleId: discordRoleId },
      });
      console.log(`Updated Discord Role ID for: ${name}`);
    }
  } catch (error) {
    console.error("Error adding Discord Role IDs:", error);
  } finally {
    await prisma.$disconnect();
  }
};

addDiscordRoleIds();
