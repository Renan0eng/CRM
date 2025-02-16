/*
  Warnings:

  - You are about to drop the column `description` on the `Lote` table. All the data in the column will be lost.
  - You are about to drop the column `name` on the `Lote` table. All the data in the column will be lost.
  - Added the required column `nome` to the `Lote` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Lote" DROP COLUMN "description",
DROP COLUMN "name",
ADD COLUMN     "descricao" TEXT,
ADD COLUMN     "nome" TEXT NOT NULL;
