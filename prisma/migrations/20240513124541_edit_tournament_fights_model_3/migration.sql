-- AlterTable
ALTER TABLE "tournaments-fights" ALTER COLUMN "winner" DROP NOT NULL,
ALTER COLUMN "method" DROP NOT NULL,
ALTER COLUMN "round" DROP NOT NULL;
