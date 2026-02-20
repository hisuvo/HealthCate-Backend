/*
  Warnings:

  - You are about to drop the column `porfilePhoto` on the `admin` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "admin" DROP COLUMN "porfilePhoto",
ADD COLUMN     "profilePhoto" TEXT;
