/*
  Warnings:

  - You are about to drop the `Product` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `ProductMovement` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Product_tag` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_ProductToProduct_tag` table. If the table is not empty, all the data it contains will be lost.

*/
-- CreateEnum
CREATE TYPE "Type_med" AS ENUM ('unidade', 'kg');

-- DropForeignKey
ALTER TABLE "ProductMovement" DROP CONSTRAINT "ProductMovement_id_lote_fkey";

-- DropForeignKey
ALTER TABLE "ProductMovement" DROP CONSTRAINT "ProductMovement_productId_fkey";

-- DropForeignKey
ALTER TABLE "_ProductToProduct_tag" DROP CONSTRAINT "_ProductToProduct_tag_A_fkey";

-- DropForeignKey
ALTER TABLE "_ProductToProduct_tag" DROP CONSTRAINT "_ProductToProduct_tag_B_fkey";

-- DropTable
DROP TABLE "Product";

-- DropTable
DROP TABLE "ProductMovement";

-- DropTable
DROP TABLE "Product_tag";

-- DropTable
DROP TABLE "_ProductToProduct_tag";

-- CreateTable
CREATE TABLE "Produto" (
    "id" TEXT NOT NULL,
    "nome" TEXT NOT NULL,
    "descricao" TEXT,
    "preco" DOUBLE PRECISION,
    "custo" DOUBLE PRECISION,
    "image_url" TEXT DEFAULT 'https://i.imgur.com/6VBx3io.png',
    "type_med" "Type_med" NOT NULL DEFAULT 'unidade',
    "visivel" BOOLEAN NOT NULL DEFAULT true,
    "created" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "user_created_id" TEXT NOT NULL,
    "updated" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "user_updated_id" TEXT,
    "deleted" BOOLEAN NOT NULL DEFAULT false,
    "user_deleted_id" TEXT,

    CONSTRAINT "Produto_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Produto_tag" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "Produto_tag_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ProdutoMovimento" (
    "id" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "quantity" DOUBLE PRECISION NOT NULL,
    "productId" TEXT NOT NULL,
    "id_lote" TEXT NOT NULL,
    "product_name" TEXT,
    "description" TEXT,
    "data_moviment" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "user_created_id" TEXT NOT NULL,
    "updated" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "user_updated_id" TEXT,
    "deleted" BOOLEAN NOT NULL DEFAULT false,
    "user_deleted_id" TEXT,
    "closed" TIMESTAMP(3),

    CONSTRAINT "ProdutoMovimento_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_ProdutoToProduto_tag" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_ProdutoToProduto_tag_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE INDEX "Produto_id_idx" ON "Produto"("id");

-- CreateIndex
CREATE INDEX "Produto_user_created_id_idx" ON "Produto"("user_created_id");

-- CreateIndex
CREATE INDEX "Produto_user_updated_id_idx" ON "Produto"("user_updated_id");

-- CreateIndex
CREATE INDEX "Produto_user_deleted_id_idx" ON "Produto"("user_deleted_id");

-- CreateIndex
CREATE UNIQUE INDEX "Produto_tag_name_key" ON "Produto_tag"("name");

-- CreateIndex
CREATE INDEX "ProdutoMovimento_id_idx" ON "ProdutoMovimento"("id");

-- CreateIndex
CREATE INDEX "ProdutoMovimento_id_lote_idx" ON "ProdutoMovimento"("id_lote");

-- CreateIndex
CREATE INDEX "ProdutoMovimento_productId_idx" ON "ProdutoMovimento"("productId");

-- CreateIndex
CREATE INDEX "ProdutoMovimento_user_created_id_idx" ON "ProdutoMovimento"("user_created_id");

-- CreateIndex
CREATE INDEX "ProdutoMovimento_user_updated_id_idx" ON "ProdutoMovimento"("user_updated_id");

-- CreateIndex
CREATE INDEX "ProdutoMovimento_user_deleted_id_idx" ON "ProdutoMovimento"("user_deleted_id");

-- CreateIndex
CREATE INDEX "_ProdutoToProduto_tag_B_index" ON "_ProdutoToProduto_tag"("B");

-- AddForeignKey
ALTER TABLE "ProdutoMovimento" ADD CONSTRAINT "ProdutoMovimento_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Produto"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProdutoMovimento" ADD CONSTRAINT "ProdutoMovimento_id_lote_fkey" FOREIGN KEY ("id_lote") REFERENCES "Lote"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ProdutoToProduto_tag" ADD CONSTRAINT "_ProdutoToProduto_tag_A_fkey" FOREIGN KEY ("A") REFERENCES "Produto"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ProdutoToProduto_tag" ADD CONSTRAINT "_ProdutoToProduto_tag_B_fkey" FOREIGN KEY ("B") REFERENCES "Produto_tag"("id") ON DELETE CASCADE ON UPDATE CASCADE;
