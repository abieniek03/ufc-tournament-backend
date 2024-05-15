/*
  Warnings:

  - Added the required column `userId` to the `tournaments-scores` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "tournaments-scores" ADD COLUMN     "userId" TEXT NOT NULL;
