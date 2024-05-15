/*
  Warnings:

  - The primary key for the `weightclasses` table will be changed. If it partially fails, the table could be left without primary key constraint.

*/
-- AlterTable
ALTER TABLE "weightclasses" DROP CONSTRAINT "weightclasses_pkey";
