/*
  Warnings:

  - The primary key for the `RolesOnMembers` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - A unique constraint covering the columns `[memberId,roleId]` on the table `RolesOnMembers` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "RolesOnMembers" DROP CONSTRAINT "RolesOnMembers_pkey",
ADD COLUMN     "id" SERIAL NOT NULL,
ADD CONSTRAINT "RolesOnMembers_pkey" PRIMARY KEY ("id");

-- CreateIndex
CREATE UNIQUE INDEX "RolesOnMembers_memberId_roleId_key" ON "RolesOnMembers"("memberId", "roleId");
