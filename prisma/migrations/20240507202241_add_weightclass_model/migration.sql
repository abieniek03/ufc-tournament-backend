-- CreateEnum
CREATE TYPE "Sex" AS ENUM ('MALE', 'FEMALE');

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

-- CreateIndex
CREATE UNIQUE INDEX "weightclasses_id_key" ON "weightclasses"("id");
