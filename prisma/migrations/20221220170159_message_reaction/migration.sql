-- CreateTable
CREATE TABLE "Reaction" (
    "id" SERIAL NOT NULL,
    "unified" TEXT NOT NULL,
    "emoji" TEXT NOT NULL,
    "memberId" INTEGER NOT NULL,
    "messageId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Reaction_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Reaction" ADD CONSTRAINT "Reaction_memberId_fkey" FOREIGN KEY ("memberId") REFERENCES "Member"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Reaction" ADD CONSTRAINT "Reaction_messageId_fkey" FOREIGN KEY ("messageId") REFERENCES "Message"("id") ON DELETE CASCADE ON UPDATE CASCADE;
