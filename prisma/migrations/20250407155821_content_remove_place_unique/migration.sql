/*
  Warnings:

  - A unique constraint covering the columns `[year,activityType]` on the table `Record` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "Record_year_place_activityType_key";

-- CreateIndex
CREATE UNIQUE INDEX "Record_year_activityType_key" ON "Record"("year", "activityType");
