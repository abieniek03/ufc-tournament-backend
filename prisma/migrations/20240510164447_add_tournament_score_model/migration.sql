-- CreateTable
CREATE TABLE "tournaments-scores" (
    "id" TEXT NOT NULL,
    "tournamentId" TEXT NOT NULL,
    "fighterId" TEXT NOT NULL,
    "ranking" INTEGER NOT NULL,
    "win" INTEGER NOT NULL DEFAULT 0,
    "lose" INTEGER NOT NULL DEFAULT 0,
    "draw" INTEGER NOT NULL DEFAULT 0,
    "firstRoundFinish" INTEGER NOT NULL DEFAULT 0,
    "secondRoundFinish" INTEGER NOT NULL DEFAULT 0,
    "thirdRoundFinish" INTEGER NOT NULL DEFAULT 0,
    "points" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "tournaments-scores_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "tournaments-scores" ADD CONSTRAINT "tournaments-scores_tournamentId_fkey" FOREIGN KEY ("tournamentId") REFERENCES "tournaments"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tournaments-scores" ADD CONSTRAINT "tournaments-scores_fighterId_fkey" FOREIGN KEY ("fighterId") REFERENCES "fighters"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
