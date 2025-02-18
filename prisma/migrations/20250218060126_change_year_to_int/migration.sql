/*
  Warnings:

  - Changed the type of `year` on the `ActivityRecord` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "ActivityRecord" DROP COLUMN "year",
ADD COLUMN     "year" INTEGER NOT NULL;
