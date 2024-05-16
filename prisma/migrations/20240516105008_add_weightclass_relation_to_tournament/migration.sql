-- AddForeignKey
ALTER TABLE "tournaments" ADD CONSTRAINT "tournaments_weightclassId_fkey" FOREIGN KEY ("weightclassId") REFERENCES "weightclasses"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
