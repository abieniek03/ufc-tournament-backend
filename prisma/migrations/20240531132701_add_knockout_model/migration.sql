-- AlterEnum
ALTER TYPE "Level" ADD VALUE 'LAST_16';

-- CreateTable
CREATE TABLE "knockouts" (
    "id" TEXT NOT NULL,
    "tournamentId" TEXT NOT NULL,
    "fightId" TEXT NOT NULL,
    "level" "Level" NOT NULL,
    "position" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "knockouts_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "knockouts" ADD CONSTRAINT "knockouts_tournamentId_fkey" FOREIGN KEY ("tournamentId") REFERENCES "tournaments"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "knockouts" ADD CONSTRAINT "knockouts_fightId_fkey" FOREIGN KEY ("fightId") REFERENCES "fights"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
