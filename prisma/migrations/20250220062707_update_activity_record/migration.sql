/*
  Warnings:

  - The primary key for the `ActivityRecord` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `content` on the `ActivityRecord` table. All the data in the column will be lost.
  - The `id` column on the `ActivityRecord` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The primary key for the `RecordContent` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The `id` column on the `RecordContent` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - A unique constraint covering the columns `[filename]` on the table `ActivityRecord` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `date` to the `ActivityRecord` table without a default value. This is not possible if the table is not empty.
  - Added the required column `filename` to the `ActivityRecord` table without a default value. This is not possible if the table is not empty.
  - Added the required column `place` to the `ActivityRecord` table without a default value. This is not possible if the table is not empty.
  - Added the required column `activityRecordId` to the `RecordContent` table without a default value. This is not possible if the table is not empty.
  - Made the column `year` on table `RecordContent` required. This step will fail if there are existing NULL values in that column.
  - Made the column `month` on table `RecordContent` required. This step will fail if there are existing NULL values in that column.
  - Made the column `mountainname` on table `RecordContent` required. This step will fail if there are existing NULL values in that column.
  - Made the column `teamname` on table `RecordContent` required. This step will fail if there are existing NULL values in that column.
  - Made the column `content` on table `RecordContent` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "ActivityRecord" DROP CONSTRAINT "ActivityRecord_pkey",
DROP COLUMN "content",
ADD COLUMN     "date" TEXT NOT NULL,
ADD COLUMN     "filename" TEXT NOT NULL,
ADD COLUMN     "place" TEXT NOT NULL,
DROP COLUMN "id",
ADD COLUMN     "id" SERIAL NOT NULL,
ADD CONSTRAINT "ActivityRecord_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "RecordContent" DROP CONSTRAINT "RecordContent_pkey",
ADD COLUMN     "activityRecordId" INTEGER NOT NULL,
DROP COLUMN "id",
ADD COLUMN     "id" SERIAL NOT NULL,
ALTER COLUMN "year" SET NOT NULL,
ALTER COLUMN "month" SET NOT NULL,
ALTER COLUMN "mountainname" SET NOT NULL,
ALTER COLUMN "teamname" SET NOT NULL,
ALTER COLUMN "content" SET NOT NULL,
ALTER COLUMN "images" DROP DEFAULT,
ADD CONSTRAINT "RecordContent_pkey" PRIMARY KEY ("id");

-- CreateIndex
CREATE UNIQUE INDEX "ActivityRecord_filename_key" ON "ActivityRecord"("filename");

-- AddForeignKey
ALTER TABLE "RecordContent" ADD CONSTRAINT "RecordContent_activityRecordId_fkey" FOREIGN KEY ("activityRecordId") REFERENCES "ActivityRecord"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
