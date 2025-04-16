/*
  Warnings:

  - A unique constraint covering the columns `[clId,recordId]` on the table `PostHikeContent` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "PostHikeContent_clId_recordId_key" ON "PostHikeContent"("clId", "recordId");
