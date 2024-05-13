-- CreateEnum
CREATE TYPE "Level" AS ENUM ('ROUND_1', 'RONUD_2', 'QUARTERFINAL', 'SEMIFINAL', 'FINAL');

-- CreateEnum
CREATE TYPE "Winner" AS ENUM ('RED', 'BLUE', 'DRAW');

-- CreateEnum
CREATE TYPE "Method" AS ENUM ('KO', 'TKO', 'SUB', 'UD', 'SD', 'MD');

-- CreateTable
CREATE TABLE "TournamentFights" (
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

    CONSTRAINT "TournamentFights_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "TournamentFights" ADD CONSTRAINT "TournamentFights_tournamentId_fkey" FOREIGN KEY ("tournamentId") REFERENCES "tournaments"("id") ON DELETE CASCADE ON UPDATE CASCADE;
