/*
  Warnings:

  - The primary key for the `RecordContent` table will be changed. If it partially fails, the table could be left without primary key constraint.

*/
-- AlterTable
ALTER TABLE "RecordContent" DROP CONSTRAINT "RecordContent_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ADD CONSTRAINT "RecordContent_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "RecordContent_id_seq";
