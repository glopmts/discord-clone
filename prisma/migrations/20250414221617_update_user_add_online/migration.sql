/*
  Warnings:

  - The `isOnline` column on the `User` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "Server" ADD COLUMN     "isRole" "Roles" NOT NULL DEFAULT 'user';

-- AlterTable
ALTER TABLE "User" DROP COLUMN "isOnline",
ADD COLUMN     "isOnline" BOOLEAN NOT NULL DEFAULT false;
