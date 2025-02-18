/*
  Warnings:

  - You are about to drop the column `roles` on the `Member` table. All the data in the column will be lost.
  - Added the required column `year` to the `Member` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Member" DROP COLUMN "roles",
ADD COLUMN     "role" TEXT,
ADD COLUMN     "year" TEXT NOT NULL,
ALTER COLUMN "name" DROP NOT NULL;
