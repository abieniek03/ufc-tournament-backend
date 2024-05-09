/*
  Warnings:

  - The primary key for the `rankings` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `rankings` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[fighterId]` on the table `rankings` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "rankings_id_key";

-- AlterTable
ALTER TABLE "rankings" DROP CONSTRAINT "rankings_pkey",
DROP COLUMN "id",
ADD CONSTRAINT "rankings_pkey" PRIMARY KEY ("fighterId");

-- CreateIndex
CREATE UNIQUE INDEX "rankings_fighterId_key" ON "rankings"("fighterId");
