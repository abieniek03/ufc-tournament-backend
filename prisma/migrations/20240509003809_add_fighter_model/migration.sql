-- AlterTable
ALTER TABLE "weightclasses" ADD CONSTRAINT "weightclasses_pkey" PRIMARY KEY ("id");

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

-- CreateIndex
CREATE UNIQUE INDEX "fighters_id_key" ON "fighters"("id");

-- AddForeignKey
ALTER TABLE "fighters" ADD CONSTRAINT "fighters_weightclassId_fkey" FOREIGN KEY ("weightclassId") REFERENCES "weightclasses"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
