/*
  Warnings:

  - You are about to drop the column `UserId` on the `doctor` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[userId]` on the table `doctor` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `qualification` to the `doctor` table without a default value. This is not possible if the table is not empty.
  - Added the required column `userId` to the `doctor` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "doctor" DROP CONSTRAINT "doctor_UserId_fkey";

-- DropIndex
DROP INDEX "doctor_UserId_key";

-- AlterTable
ALTER TABLE "doctor" DROP COLUMN "UserId",
ADD COLUMN     "qualification" TEXT NOT NULL,
ADD COLUMN     "userId" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "doctor_userId_key" ON "doctor"("userId");

-- AddForeignKey
ALTER TABLE "doctor" ADD CONSTRAINT "doctor_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;
