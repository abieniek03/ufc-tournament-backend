-- AlterTable
ALTER TABLE "tournaments-fights" ADD COLUMN     "fighterId" TEXT;

-- AddForeignKey
ALTER TABLE "tournaments-fights" ADD CONSTRAINT "tournaments-fights_redFighterId_fkey" FOREIGN KEY ("redFighterId") REFERENCES "fighters"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tournaments-fights" ADD CONSTRAINT "tournaments-fights_blueFighterId_fkey" FOREIGN KEY ("blueFighterId") REFERENCES "fighters"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tournaments-fights" ADD CONSTRAINT "tournaments-fights_fighterId_fkey" FOREIGN KEY ("fighterId") REFERENCES "fighters"("id") ON DELETE SET NULL ON UPDATE CASCADE;
