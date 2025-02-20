/*
  Warnings:

  - You are about to drop the column `name` on the `Produto_tag` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[nome]` on the table `Produto_tag` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `nome` to the `Produto_tag` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "Produto_tag_name_key";

-- AlterTable
ALTER TABLE "Produto_tag" DROP COLUMN "name",
ADD COLUMN     "nome" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Produto_tag_nome_key" ON "Produto_tag"("nome");
