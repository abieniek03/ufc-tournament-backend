-- AlterTable
ALTER TABLE "fighters" ADD COLUMN     "blueFighterId" TEXT,
ADD COLUMN     "redFighterId" TEXT;

-- DropEnum
DROP TYPE "Winner";
