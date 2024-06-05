-- RenameForeignKey
ALTER TABLE "fights" RENAME CONSTRAINT "blueFighterId_fkey" TO "fights_blueFighterId_fkey";

-- RenameForeignKey
ALTER TABLE "fights" RENAME CONSTRAINT "redFighterId_fkey" TO "fights_redFighterId_fkey";
