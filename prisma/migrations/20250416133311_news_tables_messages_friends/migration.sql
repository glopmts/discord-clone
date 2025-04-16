-- AlterEnum
ALTER TYPE "FriendStatus" ADD VALUE 'FRIENDS';

-- AlterTable
ALTER TABLE "MessageRead" ADD COLUMN     "messageFriendsId" TEXT;

-- CreateTable
CREATE TABLE "MessageFriends" (
    "id" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "sendId" TEXT NOT NULL,
    "receivesId" TEXT NOT NULL,
    "image" TEXT,
    "channelId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "MessageFriends_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "MessageFriends" ADD CONSTRAINT "MessageFriends_sendId_fkey" FOREIGN KEY ("sendId") REFERENCES "User"("clerk_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MessageFriends" ADD CONSTRAINT "MessageFriends_receivesId_fkey" FOREIGN KEY ("receivesId") REFERENCES "User"("clerk_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MessageRead" ADD CONSTRAINT "MessageRead_messageFriendsId_fkey" FOREIGN KEY ("messageFriendsId") REFERENCES "MessageFriends"("id") ON DELETE SET NULL ON UPDATE CASCADE;
