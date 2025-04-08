/*
  Warnings:

  - A unique constraint covering the columns `[clerck_id]` on the table `user` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "user_clerck_id_key" ON "user"("clerck_id");
