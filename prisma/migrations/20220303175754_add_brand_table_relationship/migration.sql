/*
  Warnings:

  - You are about to drop the column `brandName` on the `posts` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "posts" DROP COLUMN "brandName",
ADD COLUMN     "brandId" TEXT;

-- CreateTable
CREATE TABLE "brands" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "createdAt" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "brands_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "posts" ADD CONSTRAINT "posts_brandId_fkey" FOREIGN KEY ("brandId") REFERENCES "brands"("id") ON DELETE CASCADE ON UPDATE CASCADE;
