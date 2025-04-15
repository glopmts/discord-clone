/*
  Warnings:

  - You are about to drop the column `isRole` on the `MemberCargo` table. All the data in the column will be lost.
  - Added the required column `updatedAt` to the `MemberCargo` table without a default value. This is not possible if the table is not empty.

*/
-- AlterEnum
-- This migration adds more than one value to an enum.
-- With PostgreSQL versions 11 and earlier, this is not possible
-- in a single migration. This can be worked around by creating
-- multiple migrations, each migration adding only one value to
-- the enum.


ALTER TYPE "Roles" ADD VALUE 'owner';
ALTER TYPE "Roles" ADD VALUE 'moderator';
ALTER TYPE "Roles" ADD VALUE 'vip';

-- AlterTable
ALTER TABLE "MemberCargo" DROP COLUMN "isRole",
ADD COLUMN     "role" "Roles" NOT NULL DEFAULT 'user',
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;
