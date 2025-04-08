/*
  Warnings:

  - You are about to drop the column `clerck_id` on the `user` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[clerk_id]` on the table `user` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "user_clerck_id_key";

-- AlterTable
ALTER TABLE "user" DROP COLUMN "clerck_id",
ADD COLUMN     "clerk_id" TEXT,
ADD COLUMN     "dateNce" TIMESTAMP(3);

-- CreateIndex
CREATE UNIQUE INDEX "user_clerk_id_key" ON "user"("clerk_id");
