/*
  Warnings:

  - You are about to drop the column `data_moviment` on the `ProdutoMovimento` table. All the data in the column will be lost.
  - You are about to drop the column `description` on the `ProdutoMovimento` table. All the data in the column will be lost.
  - You are about to drop the column `productId` on the `ProdutoMovimento` table. All the data in the column will be lost.
  - You are about to drop the column `product_name` on the `ProdutoMovimento` table. All the data in the column will be lost.
  - You are about to drop the column `quantity` on the `ProdutoMovimento` table. All the data in the column will be lost.
  - You are about to drop the column `type` on the `ProdutoMovimento` table. All the data in the column will be lost.
  - Added the required column `id_produto` to the `ProdutoMovimento` table without a default value. This is not possible if the table is not empty.
  - Added the required column `qtd` to the `ProdutoMovimento` table without a default value. This is not possible if the table is not empty.
  - Added the required column `tipo` to the `ProdutoMovimento` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "Type_Mov" AS ENUM ('entrada', 'saida');

-- DropForeignKey
ALTER TABLE "ProdutoMovimento" DROP CONSTRAINT "ProdutoMovimento_id_lote_fkey";

-- DropForeignKey
ALTER TABLE "ProdutoMovimento" DROP CONSTRAINT "ProdutoMovimento_productId_fkey";

-- DropIndex
DROP INDEX "ProdutoMovimento_productId_idx";

-- AlterTable
ALTER TABLE "ProdutoMovimento" DROP COLUMN "data_moviment",
DROP COLUMN "description",
DROP COLUMN "productId",
DROP COLUMN "product_name",
DROP COLUMN "quantity",
DROP COLUMN "type",
ADD COLUMN     "data_movimento" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "descricao" TEXT,
ADD COLUMN     "id_produto" TEXT NOT NULL,
ADD COLUMN     "id_tanque" TEXT,
ADD COLUMN     "qtd" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "tipo" "Type_Mov" NOT NULL,
ALTER COLUMN "id_lote" DROP NOT NULL;

-- CreateIndex
CREATE INDEX "ProdutoMovimento_id_tanque_idx" ON "ProdutoMovimento"("id_tanque");

-- CreateIndex
CREATE INDEX "ProdutoMovimento_id_produto_idx" ON "ProdutoMovimento"("id_produto");

-- AddForeignKey
ALTER TABLE "ProdutoMovimento" ADD CONSTRAINT "ProdutoMovimento_id_produto_fkey" FOREIGN KEY ("id_produto") REFERENCES "Produto"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProdutoMovimento" ADD CONSTRAINT "ProdutoMovimento_id_lote_fkey" FOREIGN KEY ("id_lote") REFERENCES "Lote"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProdutoMovimento" ADD CONSTRAINT "ProdutoMovimento_id_tanque_fkey" FOREIGN KEY ("id_tanque") REFERENCES "Tanque"("id") ON DELETE SET NULL ON UPDATE CASCADE;
