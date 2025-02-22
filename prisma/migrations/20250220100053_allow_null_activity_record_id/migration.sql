-- DropForeignKey
ALTER TABLE "RecordContent" DROP CONSTRAINT "RecordContent_activityRecordId_fkey";

-- AlterTable
ALTER TABLE "ActivityRecord" ALTER COLUMN "year" DROP NOT NULL;

-- AlterTable
ALTER TABLE "RecordContent" ALTER COLUMN "year" DROP NOT NULL,
ALTER COLUMN "activityRecordId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "RecordContent" ADD CONSTRAINT "RecordContent_activityRecordId_fkey" FOREIGN KEY ("activityRecordId") REFERENCES "ActivityRecord"("id") ON DELETE SET NULL ON UPDATE CASCADE;
