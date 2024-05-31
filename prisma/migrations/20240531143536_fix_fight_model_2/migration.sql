/*
  Warnings:

  - The values [LAST_16] on the enum `Level` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "Level_new" AS ENUM ('ROUND_1', 'ROUND_2', 'QUARTERFINAL', 'SEMIFINAL', 'FINAL');
ALTER TABLE "fights" ALTER COLUMN "level" TYPE "Level_new" USING ("level"::text::"Level_new");
ALTER TABLE "knockouts" ALTER COLUMN "level" TYPE "Level_new" USING ("level"::text::"Level_new");
ALTER TYPE "Level" RENAME TO "Level_old";
ALTER TYPE "Level_new" RENAME TO "Level";
DROP TYPE "Level_old";
COMMIT;
