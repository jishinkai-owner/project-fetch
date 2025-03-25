-- CreateTable
CREATE TABLE "Member" (
    "id" TEXT NOT NULL,
    "nickname" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "major" TEXT,
    "profile" TEXT,
    "name" TEXT,
    "role" TEXT,
    "year" TEXT NOT NULL,
    "src" TEXT,

    CONSTRAINT "Member_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ActivityRecord" (
    "title" TEXT,
    "year" INTEGER,
    "date" TEXT,
    "filename" TEXT,
    "place" TEXT,
    "id" SERIAL NOT NULL,
    "activityType" TEXT,
    "details" TEXT,

    CONSTRAINT "ActivityRecord_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RecordContent" (
    "year" INTEGER,
    "content" TEXT,
    "images" TEXT[],
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "filename" TEXT,
    "id" SERIAL NOT NULL,

    CONSTRAINT "RecordContent_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Record" (
    "id" SERIAL NOT NULL,
    "year" INTEGER,
    "place" TEXT,
    "date" TEXT,
    "activityType" TEXT,
    "details" TEXT,

    CONSTRAINT "Record_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Content" (
    "id" SERIAL NOT NULL,
    "title" TEXT,
    "content" TEXT,
    "images" TEXT[],
    "filename" TEXT,
    "recordId" INTEGER NOT NULL,

    CONSTRAINT "Content_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PostHike" (
    "id" SERIAL NOT NULL,
    "year" INTEGER NOT NULL,
    "place" TEXT NOT NULL,
    "date" TEXT NOT NULL,

    CONSTRAINT "PostHike_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PostHikeContent" (
    "id" SERIAL NOT NULL,
    "equipmentPerson" TEXT NOT NULL,
    "weatherPerson" TEXT NOT NULL,
    "mealPerson" TEXT NOT NULL,
    "sl" TEXT NOT NULL,
    "equipmentComment" TEXT NOT NULL,
    "weatherComment" TEXT NOT NULL,
    "mealComment" TEXT NOT NULL,
    "slComemnt" TEXT NOT NULL,
    "postHikeId" INTEGER NOT NULL,

    CONSTRAINT "PostHikeContent_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Record_year_place_activityType_key" ON "Record"("year", "place", "activityType");

-- CreateIndex
CREATE UNIQUE INDEX "Content_recordId_filename_key" ON "Content"("recordId", "filename");

-- AddForeignKey
ALTER TABLE "Content" ADD CONSTRAINT "Content_recordId_fkey" FOREIGN KEY ("recordId") REFERENCES "Record"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PostHikeContent" ADD CONSTRAINT "PostHikeContent_postHikeId_fkey" FOREIGN KEY ("postHikeId") REFERENCES "PostHike"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

