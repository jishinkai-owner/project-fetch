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
