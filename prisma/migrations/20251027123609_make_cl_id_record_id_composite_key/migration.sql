/*
  Warnings:

  - A unique constraint covering the columns `[recordId,clId]` on the table `PostHikeContent` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "PostHikeContent_recordId_clId_key" ON "PostHikeContent"("recordId", "clId");
