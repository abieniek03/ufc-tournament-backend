-- CreateTable
CREATE TABLE "rankings" (
    "id" TEXT NOT NULL,
    "weightclassId" TEXT NOT NULL,
    "fighterId" TEXT NOT NULL,
    "position" INTEGER NOT NULL,
    "positionPrevious" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "rankings_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "rankings_id_key" ON "rankings"("id");

-- AddForeignKey
ALTER TABLE "rankings" ADD CONSTRAINT "rankings_fighterId_fkey" FOREIGN KEY ("fighterId") REFERENCES "fighters"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
