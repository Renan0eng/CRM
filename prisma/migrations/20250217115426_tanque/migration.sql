/*
  Warnings:

  - You are about to drop the column `description` on the `Tanque` table. All the data in the column will be lost.
  - You are about to drop the column `name` on the `Tanque` table. All the data in the column will be lost.
  - Added the required column `nome` to the `Tanque` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Tanque" DROP COLUMN "description",
DROP COLUMN "name",
ADD COLUMN     "area" DOUBLE PRECISION NOT NULL DEFAULT 0,
ADD COLUMN     "descricao" TEXT,
ADD COLUMN     "nome" TEXT NOT NULL;
