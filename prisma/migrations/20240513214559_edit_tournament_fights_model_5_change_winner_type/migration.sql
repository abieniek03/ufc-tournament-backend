/*
  Warnings:

  - The `winner` column on the `fights` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "fights" DROP COLUMN "winner",
ADD COLUMN     "winner" TEXT;
