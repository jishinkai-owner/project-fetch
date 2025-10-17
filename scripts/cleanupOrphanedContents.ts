import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const main = async () => {
  console.log("Cleaning up orphaned contents...");

  try {
    const orphanedContents = await prisma.content.findMany({
      where: {
        authorId: null,
      },
    });

    console.log(`Found ${orphanedContents.length} orphaned contents.`);

    if (orphanedContents.length > 0) {
      const deleteResult = await prisma.content.deleteMany({
        where: {
          authorId: null,
        },
      });

      console.log(`Deleted ${deleteResult.count} orphaned contents.`);
    }
  } catch (error) {
    console.error("Error during cleanup:", error);
  }
};

main();
