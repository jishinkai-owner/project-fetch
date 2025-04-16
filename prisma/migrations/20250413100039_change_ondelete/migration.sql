-- DropForeignKey
ALTER TABLE "PostHikeContent" DROP CONSTRAINT "PostHikeContent_recordId_fkey";

-- AddForeignKey
ALTER TABLE "PostHikeContent" ADD CONSTRAINT "PostHikeContent_recordId_fkey" FOREIGN KEY ("recordId") REFERENCES "Record"("id") ON DELETE CASCADE ON UPDATE CASCADE;
