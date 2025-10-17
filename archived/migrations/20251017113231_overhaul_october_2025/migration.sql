/*
  Warnings:

  - You are about to drop the column `clName` on the `PostHikeContent` table. All the data in the column will be lost.
  - You are about to drop the column `slComemnt` on the `PostHikeContent` table. All the data in the column will be lost.
  - You are about to drop the column `isAdmin` on the `Role` table. All the data in the column will be lost.
  - You are about to drop the column `isCL` on the `Role` table. All the data in the column will be lost.
  - You are about to drop the column `isEquipment` on the `Role` table. All the data in the column will be lost.
  - You are about to drop the column `isMeal` on the `Role` table. All the data in the column will be lost.
  - You are about to drop the column `isSL` on the `Role` table. All the data in the column will be lost.
  - You are about to drop the column `isWeather` on the `Role` table. All the data in the column will be lost.
  - You are about to drop the column `userId` on the `Role` table. All the data in the column will be lost.
  - You are about to drop the `ActivityRecord` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[name]` on the table `Role` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `name` to the `Role` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Content" DROP CONSTRAINT "Content_recordId_fkey";

-- DropForeignKey
ALTER TABLE "Role" DROP CONSTRAINT "Role_userId_fkey";

-- DropIndex
DROP INDEX "Role_userId_key";

-- AlterTable
ALTER TABLE "PostHikeContent" DROP COLUMN "clName",
DROP COLUMN "slComemnt",
ADD COLUMN     "slComment" TEXT,
ALTER COLUMN "clId" DROP NOT NULL;

-- AlterTable
ALTER TABLE "Role" DROP COLUMN "isAdmin",
DROP COLUMN "isCL",
DROP COLUMN "isEquipment",
DROP COLUMN "isMeal",
DROP COLUMN "isSL",
DROP COLUMN "isWeather",
DROP COLUMN "userId",
ADD COLUMN     "description" TEXT,
ADD COLUMN     "name" TEXT NOT NULL;

-- DropTable
DROP TABLE "ActivityRecord";

-- CreateTable
CREATE TABLE "UserRole" (
    "id" SERIAL NOT NULL,
    "userId" UUID NOT NULL,
    "roleId" INTEGER NOT NULL,

    CONSTRAINT "UserRole_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Content_authorId_idx" ON "Content"("authorId");

-- CreateIndex
CREATE INDEX "Content_recordId_idx" ON "Content"("recordId");

-- CreateIndex
CREATE INDEX "PostHikeContent_recordId_idx" ON "PostHikeContent"("recordId");

-- CreateIndex
CREATE INDEX "Record_year_idx" ON "Record"("year");

-- CreateIndex
CREATE INDEX "Record_activityType_idx" ON "Record"("activityType");

-- CreateIndex
CREATE UNIQUE INDEX "Role_name_key" ON "Role"("name");

-- CreateIndex
CREATE INDEX "User_grade_idx" ON "User"("grade");

-- AddForeignKey
ALTER TABLE "Content" ADD CONSTRAINT "Content_recordId_fkey" FOREIGN KEY ("recordId") REFERENCES "Record"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserRole" ADD CONSTRAINT "UserRole_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserRole" ADD CONSTRAINT "UserRole_roleId_fkey" FOREIGN KEY ("roleId") REFERENCES "Role"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PostHikeContent" ADD CONSTRAINT "PostHikeContent_clId_fkey" FOREIGN KEY ("clId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
