/*
  Warnings:

  - The `equipmentPerson` column on the `PostHikeContent` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `weatherPerson` column on the `PostHikeContent` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `mealPerson` column on the `PostHikeContent` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "PostHikeContent" DROP COLUMN "equipmentPerson",
ADD COLUMN     "equipmentPerson" TEXT[],
DROP COLUMN "weatherPerson",
ADD COLUMN     "weatherPerson" TEXT[],
DROP COLUMN "mealPerson",
ADD COLUMN     "mealPerson" TEXT[];
