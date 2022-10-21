/*
  Warnings:

  - A unique constraint covering the columns `[memberOwnerId]` on the table `Group` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "Group" ADD COLUMN     "memberOwnerId" INTEGER;

-- CreateIndex
CREATE UNIQUE INDEX "Group_memberOwnerId_key" ON "Group"("memberOwnerId");

-- AddForeignKey
ALTER TABLE "Group" ADD CONSTRAINT "Group_memberOwnerId_fkey" FOREIGN KEY ("memberOwnerId") REFERENCES "Member"("id") ON DELETE SET NULL ON UPDATE CASCADE;
