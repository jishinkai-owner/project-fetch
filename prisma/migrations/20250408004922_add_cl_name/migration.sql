/*
  Warnings:

  - The `impression` column on the `PostHikeContent` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "PostHikeContent" ADD COLUMN     "clName" TEXT,
DROP COLUMN "impression",
ADD COLUMN     "impression" TEXT[];
