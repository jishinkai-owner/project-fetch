/*
  Warnings:

  - You are about to drop the column `postHikeId` on the `PostHikeContent` table. All the data in the column will be lost.
  - You are about to drop the column `retrospective` on the `PostHikeContent` table. All the data in the column will be lost.
  - You are about to drop the `PostHike` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[recordId]` on the table `PostHikeContent` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `clId` to the `PostHikeContent` table without a default value. This is not possible if the table is not empty.
  - Added the required column `recordId` to the `PostHikeContent` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "PostHikeContent" DROP CONSTRAINT "PostHikeContent_postHikeId_fkey";

-- AlterTable
ALTER TABLE "PostHikeContent" DROP COLUMN "postHikeId",
DROP COLUMN "retrospective",
ADD COLUMN     "clId" TEXT NOT NULL,
ADD COLUMN     "recordId" INTEGER NOT NULL,
ALTER COLUMN "equipmentPerson" DROP NOT NULL,
ALTER COLUMN "weatherPerson" DROP NOT NULL,
ALTER COLUMN "mealPerson" DROP NOT NULL,
ALTER COLUMN "sl" DROP NOT NULL,
ALTER COLUMN "equipmentComment" DROP NOT NULL,
ALTER COLUMN "weatherComment" DROP NOT NULL,
ALTER COLUMN "mealComment" DROP NOT NULL,
ALTER COLUMN "slComemnt" DROP NOT NULL;

-- DropTable
DROP TABLE "PostHike";

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "role" TEXT[],

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "PostHikeContent_recordId_key" ON "PostHikeContent"("recordId");

-- AddForeignKey
ALTER TABLE "PostHikeContent" ADD CONSTRAINT "PostHikeContent_recordId_fkey" FOREIGN KEY ("recordId") REFERENCES "Record"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
