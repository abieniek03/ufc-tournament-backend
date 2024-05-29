-- DropForeignKey
ALTER TABLE "fights" DROP CONSTRAINT "blueScoreId_fkey";

-- DropForeignKey
ALTER TABLE "fights" DROP CONSTRAINT "redScoreId_fkey";

-- DropIndex
DROP INDEX "scores_fighterId_key";
