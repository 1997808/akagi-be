-- CreateEnum
CREATE TYPE "MemberStatus" AS ENUM ('IN', 'OUT', 'DELETE');

-- AlterTable
ALTER TABLE "Member" ADD COLUMN     "status" "MemberStatus" NOT NULL DEFAULT 'IN';
