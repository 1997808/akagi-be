-- CreateEnum
CREATE TYPE "GroupType" AS ENUM ('DIRECT', 'GROUP');

-- AlterTable
ALTER TABLE "Group" ADD COLUMN     "isPublic" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "type" "GroupType" NOT NULL DEFAULT 'GROUP';
