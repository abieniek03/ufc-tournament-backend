-- DropForeignKey
ALTER TABLE "tournaments-scores" DROP CONSTRAINT "tournaments-scores_tournamentId_fkey";

-- AddForeignKey
ALTER TABLE "tournaments-scores" ADD CONSTRAINT "tournaments-scores_tournamentId_fkey" FOREIGN KEY ("tournamentId") REFERENCES "tournaments"("id") ON DELETE CASCADE ON UPDATE CASCADE;
