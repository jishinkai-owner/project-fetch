/*
  Warnings:

  - The `month` column on the `MountainRecord` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "MountainRecord" DROP COLUMN "month",
ADD COLUMN     "month" INTEGER,
ALTER COLUMN "teamname" DROP NOT NULL;
