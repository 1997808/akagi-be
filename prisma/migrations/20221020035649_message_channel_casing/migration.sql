/*
  Warnings:

  - You are about to drop the column `ChannelId` on the `Message` table. All the data in the column will be lost.
  - Added the required column `channelId` to the `Message` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Message" DROP CONSTRAINT "Message_ChannelId_fkey";

-- AlterTable
ALTER TABLE "Message" DROP COLUMN "ChannelId",
ADD COLUMN     "channelId" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "Message" ADD CONSTRAINT "Message_channelId_fkey" FOREIGN KEY ("channelId") REFERENCES "Channel"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
