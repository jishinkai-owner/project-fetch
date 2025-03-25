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

    CONSTRAINT "Content_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Content_filename_key" ON "Content"("filename");
