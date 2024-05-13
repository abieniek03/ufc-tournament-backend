/*
  Warnings:

  - You are about to drop the `tournaments-fights` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `tournaments-scores` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "tournaments-fights" DROP CONSTRAINT "tournaments-fights_blueFighterId_fkey";

-- DropForeignKey
ALTER TABLE "tournaments-fights" DROP CONSTRAINT "tournaments-fights_fighterId_fkey";

-- DropForeignKey
ALTER TABLE "tournaments-fights" DROP CONSTRAINT "tournaments-fights_redFighterId_fkey";

-- DropForeignKey
ALTER TABLE "tournaments-fights" DROP CONSTRAINT "tournaments-fights_tournamentId_fkey";

-- DropForeignKey
ALTER TABLE "tournaments-scores" DROP CONSTRAINT "tournaments-scores_fighterId_fkey";

-- DropForeignKey
ALTER TABLE "tournaments-scores" DROP CONSTRAINT "tournaments-scores_tournamentId_fkey";

-- DropTable
DROP TABLE "tournaments-fights";

-- DropTable
DROP TABLE "tournaments-scores";

-- CreateTable
CREATE TABLE "scores" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "tournamentId" TEXT NOT NULL,
    "fighterId" TEXT NOT NULL,
    "ranking" INTEGER,
    "fights" INTEGER NOT NULL DEFAULT 0,
    "win" INTEGER NOT NULL DEFAULT 0,
    "lose" INTEGER NOT NULL DEFAULT 0,
    "draw" INTEGER NOT NULL DEFAULT 0,
    "firstRoundFinish" INTEGER NOT NULL DEFAULT 0,
    "secondRoundFinish" INTEGER NOT NULL DEFAULT 0,
    "thirdRoundFinish" INTEGER NOT NULL DEFAULT 0,
    "points" INTEGER NOT NULL DEFAULT 0,
    "positionIndex" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "scores_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "fights" (
    "id" TEXT NOT NULL,
    "tournamentId" TEXT NOT NULL,
    "level" "Level" NOT NULL,
    "redFighterId" TEXT,
    "blueFighterId" TEXT,
    "winner" "Winner",
    "method" "Method",
    "round" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "fighterId" TEXT,

    CONSTRAINT "fights_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "scores" ADD CONSTRAINT "scores_tournamentId_fkey" FOREIGN KEY ("tournamentId") REFERENCES "tournaments"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "scores" ADD CONSTRAINT "scores_fighterId_fkey" FOREIGN KEY ("fighterId") REFERENCES "fighters"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "fights" ADD CONSTRAINT "fights_tournamentId_fkey" FOREIGN KEY ("tournamentId") REFERENCES "tournaments"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "fights" ADD CONSTRAINT "fights_redFighterId_fkey" FOREIGN KEY ("redFighterId") REFERENCES "fighters"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "fights" ADD CONSTRAINT "fights_blueFighterId_fkey" FOREIGN KEY ("blueFighterId") REFERENCES "fighters"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "fights" ADD CONSTRAINT "fights_fighterId_fkey" FOREIGN KEY ("fighterId") REFERENCES "fighters"("id") ON DELETE SET NULL ON UPDATE CASCADE;
