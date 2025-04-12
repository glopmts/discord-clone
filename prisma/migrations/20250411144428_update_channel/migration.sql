-- CreateEnum
CREATE TYPE "ChannelTypes" AS ENUM ('text', 'Voz', 'forum', 'announcement', 'stage');

-- AlterTable
ALTER TABLE "Channel" ADD COLUMN     "isPrivate" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "typeChannel" "ChannelTypes" NOT NULL DEFAULT 'text';
