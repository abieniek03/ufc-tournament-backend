/*
  Warnings:

  - A unique constraint covering the columns `[fighterId]` on the table `scores` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "scores_fighterId_key" ON "scores"("fighterId");

-- RenameForeignKey
ALTER TABLE "fights" RENAME CONSTRAINT "fights_blueFighterId_fkey" TO "blueFighterId_fkey";

-- RenameForeignKey
ALTER TABLE "fights" RENAME CONSTRAINT "fights_redFighterId_fkey" TO "redFighterId_fkey";

-- AddForeignKey
ALTER TABLE "fights" ADD CONSTRAINT "redScoreId_fkey" FOREIGN KEY ("redFighterId") REFERENCES "scores"("fighterId") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "fights" ADD CONSTRAINT "blueScoreId_fkey" FOREIGN KEY ("blueFighterId") REFERENCES "scores"("fighterId") ON DELETE SET NULL ON UPDATE CASCADE;
