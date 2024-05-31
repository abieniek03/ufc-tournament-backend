/*
  Warnings:

  - You are about to drop the column `blueFighterId` on the `fighters` table. All the data in the column will be lost.
  - You are about to drop the column `redFighterId` on the `fighters` table. All the data in the column will be lost.

*/
-- CreateEnum
CREATE TYPE "Winner" AS ENUM ('RED', 'BLUE', 'DRAW');

-- AlterTable
ALTER TABLE "fighters" DROP COLUMN "blueFighterId",
DROP COLUMN "redFighterId";

-- RenameForeignKey
ALTER TABLE "fights" RENAME CONSTRAINT "fights_blueFighterId_fkey" TO "blueFighterId_fkey";

-- RenameForeignKey
ALTER TABLE "fights" RENAME CONSTRAINT "fights_redFighterId_fkey" TO "redFighterId_fkey";
