/*
  Warnings:

  - Added the required column `size` to the `tournaments` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "TournamentSize" AS ENUM ('SMALL', 'BIG');

-- AlterTable
ALTER TABLE "tournaments" ADD COLUMN     "size" "TournamentSize" NOT NULL;
