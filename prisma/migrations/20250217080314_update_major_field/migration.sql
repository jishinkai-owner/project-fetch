/*
  Warnings:

  - You are about to drop the column `role` on the `Member` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Member" DROP COLUMN "role",
ADD COLUMN     "roles" TEXT[];
