/*
  Warnings:

  - The `estagio` column on the `Lote` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- CreateEnum
CREATE TYPE "Estagio" AS ENUM ('cria', 'recria', 'engorda', 'abate');

-- AlterTable
ALTER TABLE "Lote" DROP COLUMN "estagio",
ADD COLUMN     "estagio" "Estagio" NOT NULL DEFAULT 'cria';
