/*
  Warnings:

  - You are about to drop the column `recordid` on the `Content` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[recordId,filename]` on the table `Content` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[year,place,activityType]` on the table `Record` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `recordId` to the `Content` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "Content_filename_key";

-- AlterTable
ALTER TABLE "Content" DROP COLUMN "recordid",
ADD COLUMN     "recordId" INTEGER NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Content_recordId_filename_key" ON "Content"("recordId", "filename");

-- CreateIndex
CREATE UNIQUE INDEX "Record_year_place_activityType_key" ON "Record"("year", "place", "activityType");

-- AddForeignKey
ALTER TABLE "Content" ADD CONSTRAINT "Content_recordId_fkey" FOREIGN KEY ("recordId") REFERENCES "Record"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
