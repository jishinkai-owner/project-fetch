-- DropForeignKey
ALTER TABLE "Content" DROP CONSTRAINT "Content_authorId_fkey";

-- AddForeignKey
ALTER TABLE "Content" ADD CONSTRAINT "Content_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
