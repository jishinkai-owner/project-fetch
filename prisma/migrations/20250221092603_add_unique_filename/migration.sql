-- DropIndex
DROP INDEX "ActivityRecord_filename_key";

-- DropIndex
DROP INDEX "RecordContent_filename_key";

-- AlterTable
ALTER TABLE "ActivityRecord" ALTER COLUMN "year" DROP NOT NULL,
ALTER COLUMN "date" DROP NOT NULL,
ALTER COLUMN "filename" DROP NOT NULL,
ALTER COLUMN "place" DROP NOT NULL,
ALTER COLUMN "activityType" DROP NOT NULL;

-- AlterTable
ALTER TABLE "RecordContent" ALTER COLUMN "content" DROP NOT NULL,
ALTER COLUMN "filename" DROP NOT NULL;
