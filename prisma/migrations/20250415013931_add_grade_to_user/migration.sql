/*
  Warnings:

  - You are about to drop the column `userId` on the `Record` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Record" DROP COLUMN "userId";

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "grade" INTEGER;
