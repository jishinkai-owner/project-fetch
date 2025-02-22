/*
  Warnings:

  - You are about to drop the column `ActivityType` on the `ActivityRecord` table. All the data in the column will be lost.
  - You are about to drop the column `ActivityType` on the `RecordContent` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "ActivityRecord" DROP COLUMN "ActivityType",
ADD COLUMN     "activityType" TEXT;

-- AlterTable
ALTER TABLE "RecordContent" DROP COLUMN "ActivityType",
ADD COLUMN     "activityType" TEXT;
