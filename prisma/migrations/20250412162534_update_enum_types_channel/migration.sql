/*
  Warnings:

  - The values [text,Voz,forum,announcement,stage] on the enum `ChannelTypes` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "ChannelTypes_new" AS ENUM ('TEXT', 'VOZ', 'FORUM', 'ANNOUNCEMENT', 'STAGE');
ALTER TABLE "Channel" ALTER COLUMN "typeChannel" DROP DEFAULT;
ALTER TABLE "Channel" ALTER COLUMN "typeChannel" TYPE "ChannelTypes_new" USING ("typeChannel"::text::"ChannelTypes_new");
ALTER TYPE "ChannelTypes" RENAME TO "ChannelTypes_old";
ALTER TYPE "ChannelTypes_new" RENAME TO "ChannelTypes";
DROP TYPE "ChannelTypes_old";
ALTER TABLE "Channel" ALTER COLUMN "typeChannel" SET DEFAULT 'TEXT';
COMMIT;

-- AlterTable
ALTER TABLE "Channel" ALTER COLUMN "typeChannel" SET DEFAULT 'TEXT';
