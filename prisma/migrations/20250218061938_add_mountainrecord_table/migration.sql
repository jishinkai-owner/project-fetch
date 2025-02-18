-- CreateTable
CREATE TABLE "MountainRecord" (
    "id" TEXT NOT NULL,
    "year" INTEGER NOT NULL,
    "month" INTEGER NOT NULL,
    "mountainname" TEXT NOT NULL,
    "teamname" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "MountainRecord_pkey" PRIMARY KEY ("id")
);
