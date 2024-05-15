/*
  Warnings:

  - You are about to drop the column `size` on the `tournaments` table. All the data in the column will be lost.
  - Changed the type of `fighters` on the `tournaments` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "tournaments" DROP COLUMN "size",
DROP COLUMN "fighters",
ADD COLUMN     "fighters" INTEGER NOT NULL;

-- DropEnum
DROP TYPE "TournamentSize";
