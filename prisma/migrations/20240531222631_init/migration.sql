-- CreateEnum
CREATE TYPE "Sex" AS ENUM ('MALE', 'FEMALE');

-- CreateEnum
CREATE TYPE "Level" AS ENUM ('ROUND_1', 'ROUND_2', 'QUARTERFINAL', 'SEMIFINAL', 'FINAL');

-- CreateEnum
CREATE TYPE "Winner" AS ENUM ('RED', 'BLUE', 'DRAW');

-- CreateEnum
CREATE TYPE "Method" AS ENUM ('KO', 'TKO', 'SUB', 'UD', 'SD', 'MD');

-- CreateTable
CREATE TABLE "weightclasses" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "sex" "Sex" NOT NULL,
    "limit" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "weightclasses_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "fighters" (
    "id" TEXT NOT NULL,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "nickname" TEXT NOT NULL,
    "birthDate" TIMESTAMP(3) NOT NULL,
    "sex" "Sex" NOT NULL,
    "nationality" TEXT NOT NULL,
    "nationalityId" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "weightclassId" TEXT NOT NULL,
    "win" INTEGER NOT NULL,
    "lose" INTEGER NOT NULL,
    "draw" INTEGER NOT NULL,
    "noContest" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "fighters_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "rankings" (
    "fighterId" TEXT NOT NULL,
    "weightclassId" TEXT NOT NULL,
    "position" INTEGER NOT NULL,
    "positionPrevious" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "rankings_pkey" PRIMARY KEY ("fighterId")
);

-- CreateTable
CREATE TABLE "tournaments" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "weightclassId" TEXT NOT NULL,
    "fighters" INTEGER NOT NULL,
    "userId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "tournaments_pkey" PRIMARY KEY ("id")
);

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
    "winner" TEXT,
    "method" "Method",
    "round" INTEGER,
    "time" TEXT,
    "description" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "fights_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "brackets" (
    "id" TEXT NOT NULL,
    "tournamentId" TEXT NOT NULL,
    "fightId" TEXT NOT NULL,
    "level" "Level" NOT NULL,
    "position" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "brackets_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "weightclasses_id_key" ON "weightclasses"("id");

-- CreateIndex
CREATE UNIQUE INDEX "fighters_id_key" ON "fighters"("id");

-- CreateIndex
CREATE UNIQUE INDEX "rankings_fighterId_key" ON "rankings"("fighterId");

-- AddForeignKey
ALTER TABLE "fighters" ADD CONSTRAINT "fighters_weightclassId_fkey" FOREIGN KEY ("weightclassId") REFERENCES "weightclasses"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "rankings" ADD CONSTRAINT "rankings_fighterId_fkey" FOREIGN KEY ("fighterId") REFERENCES "fighters"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tournaments" ADD CONSTRAINT "tournaments_weightclassId_fkey" FOREIGN KEY ("weightclassId") REFERENCES "weightclasses"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "scores" ADD CONSTRAINT "scores_tournamentId_fkey" FOREIGN KEY ("tournamentId") REFERENCES "tournaments"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "scores" ADD CONSTRAINT "scores_fighterId_fkey" FOREIGN KEY ("fighterId") REFERENCES "fighters"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "fights" ADD CONSTRAINT "fights_tournamentId_fkey" FOREIGN KEY ("tournamentId") REFERENCES "tournaments"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "fights" ADD CONSTRAINT "redFighterId_fkey" FOREIGN KEY ("redFighterId") REFERENCES "fighters"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "fights" ADD CONSTRAINT "blueFighterId_fkey" FOREIGN KEY ("blueFighterId") REFERENCES "fighters"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "brackets" ADD CONSTRAINT "brackets_tournamentId_fkey" FOREIGN KEY ("tournamentId") REFERENCES "tournaments"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "brackets" ADD CONSTRAINT "brackets_fightId_fkey" FOREIGN KEY ("fightId") REFERENCES "fights"("id") ON DELETE CASCADE ON UPDATE CASCADE;
