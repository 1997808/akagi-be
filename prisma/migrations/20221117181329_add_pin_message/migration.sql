-- AlterTable
ALTER TABLE "Message" ADD COLUMN     "pinMessageId" INTEGER;

-- CreateTable
CREATE TABLE "PinMessage" (
    "id" SERIAL NOT NULL,
    "channelId" INTEGER NOT NULL,
    "messageId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "PinMessage_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "PinMessage_messageId_key" ON "PinMessage"("messageId");

-- CreateIndex
CREATE UNIQUE INDEX "PinMessage_channelId_messageId_key" ON "PinMessage"("channelId", "messageId");

-- AddForeignKey
ALTER TABLE "PinMessage" ADD CONSTRAINT "PinMessage_channelId_fkey" FOREIGN KEY ("channelId") REFERENCES "Channel"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PinMessage" ADD CONSTRAINT "PinMessage_messageId_fkey" FOREIGN KEY ("messageId") REFERENCES "Message"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
