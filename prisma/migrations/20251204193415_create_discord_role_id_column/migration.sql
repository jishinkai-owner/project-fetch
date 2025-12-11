/*
  Warnings:

  - A unique constraint covering the columns `[discordRoleId]` on the table `Role` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[userId,roleId]` on the table `UserRole` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "Role" ADD COLUMN     "discordRoleId" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "Role_discordRoleId_key" ON "Role"("discordRoleId");

-- CreateIndex
CREATE UNIQUE INDEX "UserRole_userId_roleId_key" ON "UserRole"("userId", "roleId");
