/*
  Warnings:

  - You are about to drop the `TournamentFights` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "TournamentFights" DROP CONSTRAINT "TournamentFights_tournamentId_fkey";

-- DropTable
DROP TABLE "TournamentFights";

-- CreateTable
CREATE TABLE "tournaments-fights" (
    "id" TEXT NOT NULL,
    "tournamentId" TEXT NOT NULL,
    "level" "Level" NOT NULL,
    "redFighterId" TEXT NOT NULL,
    "blueFighterId" TEXT NOT NULL,
    "winner" "Winner" NOT NULL,
    "method" "Method" NOT NULL,
    "round" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "tournaments-fights_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "tournaments-fights" ADD CONSTRAINT "tournaments-fights_tournamentId_fkey" FOREIGN KEY ("tournamentId") REFERENCES "tournaments"("id") ON DELETE CASCADE ON UPDATE CASCADE;
