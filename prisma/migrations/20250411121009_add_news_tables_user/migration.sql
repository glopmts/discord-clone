-- CreateEnum
CREATE TYPE "Roles" AS ENUM ('admin', 'user');

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "admin" "Roles" NOT NULL DEFAULT 'user',
ADD COLUMN     "description" TEXT;
