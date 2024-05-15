/*
  Warnings:

  - You are about to drop the column `fighterId` on the `fights` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "fights" DROP CONSTRAINT "fights_fighterId_fkey";

-- AlterTable
ALTER TABLE "fights" DROP COLUMN "fighterId";
