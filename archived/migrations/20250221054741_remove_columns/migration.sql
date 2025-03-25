/*
  Warnings:

  - You are about to drop the column `createdAt` on the `ActivityRecord` table. All the data in the column will be lost.
  - The primary key for the `RecordContent` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `activityRecordId` on the `RecordContent` table. All the data in the column will be lost.
  - You are about to drop the column `activityType` on the `RecordContent` table. All the data in the column will be lost.
  - You are about to drop the column `month` on the `RecordContent` table. All the data in the column will be lost.
  - You are about to drop the column `mountainname` on the `RecordContent` table. All the data in the column will be lost.
  - You are about to drop the column `teamname` on the `RecordContent` table. All the data in the column will be lost.
  - The `id` column on the `RecordContent` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - A unique constraint covering the columns `[filename]` on the table `RecordContent` will be added. If there are existing duplicate values, this will fail.
  - Made the column `year` on table `ActivityRecord` required. This step will fail if there are existing NULL values in that column.
  - Made the column `activityType` on table `ActivityRecord` required. This step will fail if there are existing NULL values in that column.
  - Added the required column `filename` to the `RecordContent` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "RecordContent" DROP CONSTRAINT "RecordContent_activityRecordId_fkey";

-- AlterTable
ALTER TABLE "ActivityRecord" DROP COLUMN "createdAt",
ADD COLUMN     "details" TEXT,
ALTER COLUMN "title" DROP NOT NULL,
ALTER COLUMN "year" SET NOT NULL,
ALTER COLUMN "activityType" SET NOT NULL;

-- AlterTable
ALTER TABLE "RecordContent" DROP CONSTRAINT "RecordContent_pkey",
DROP COLUMN "activityRecordId",
DROP COLUMN "activityType",
DROP COLUMN "month",
DROP COLUMN "mountainname",
DROP COLUMN "teamname",
ADD COLUMN     "filename" TEXT NOT NULL,
DROP COLUMN "id",
ADD COLUMN     "id" SERIAL NOT NULL,
ADD CONSTRAINT "RecordContent_pkey" PRIMARY KEY ("id");

-- CreateIndex
CREATE UNIQUE INDEX "RecordContent_filename_key" ON "RecordContent"("filename");
