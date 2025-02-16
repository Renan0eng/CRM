-- CreateTable
CREATE TABLE "Lote" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "estagio" TEXT NOT NULL DEFAULT 'cria',
    "qtd" INTEGER,
    "kg" DOUBLE PRECISION,
    "id_father" INTEGER,
    "created" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "user_created_id" INTEGER NOT NULL,
    "updated" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "user_updated_id" INTEGER,
    "deleted" BOOLEAN NOT NULL DEFAULT false,
    "user_deleted_id" INTEGER,
    "close" TIMESTAMP(3),
    "user_close_id" INTEGER,
    "entrada" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Lote_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Tanque" (
    "id" SERIAL NOT NULL,
    "id_lote" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "kg" DOUBLE PRECISION NOT NULL,
    "qtd" DOUBLE PRECISION NOT NULL,
    "created" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "user_created_id" INTEGER NOT NULL,
    "updated" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "user_updated_id" INTEGER,
    "deleted" BOOLEAN NOT NULL DEFAULT false,
    "user_deleted_id" INTEGER,

    CONSTRAINT "Tanque_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Mortalidade" (
    "id" SERIAL NOT NULL,
    "id_lote" TEXT,
    "id_tanque" INTEGER,
    "description" TEXT,
    "qtd" DOUBLE PRECISION NOT NULL,
    "created" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "user_created_id" INTEGER NOT NULL,
    "updated" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "user_updated_id" INTEGER,
    "deleted" BOOLEAN NOT NULL DEFAULT false,
    "user_deleted_id" INTEGER,

    CONSTRAINT "Mortalidade_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Biometria" (
    "id" SERIAL NOT NULL,
    "id_tanque" INTEGER,
    "id_lote" TEXT,
    "description" TEXT,
    "kg" DOUBLE PRECISION,
    "qtd" DOUBLE PRECISION,
    "bio" DOUBLE PRECISION NOT NULL,
    "data_bio" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "user_created_id" INTEGER NOT NULL,
    "updated" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "user_updated_id" INTEGER,
    "deleted" BOOLEAN NOT NULL DEFAULT false,
    "user_deleted_id" INTEGER,

    CONSTRAINT "Biometria_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Product" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "price" DOUBLE PRECISION,
    "cost" DOUBLE PRECISION,
    "image_url" TEXT DEFAULT 'https://i.imgur.com/6VBx3io.png',
    "type_med" TEXT NOT NULL DEFAULT 'unidade',
    "visible" BOOLEAN NOT NULL DEFAULT true,
    "created" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "user_created_id" INTEGER NOT NULL,
    "updated" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "user_updated_id" INTEGER,
    "deleted" BOOLEAN NOT NULL DEFAULT false,
    "user_deleted_id" INTEGER,

    CONSTRAINT "Product_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Product_tag" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "Product_tag_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ProductMovement" (
    "id" SERIAL NOT NULL,
    "type" TEXT NOT NULL,
    "quantity" DOUBLE PRECISION NOT NULL,
    "productId" INTEGER NOT NULL,
    "id_lote" TEXT NOT NULL,
    "product_name" TEXT,
    "description" TEXT,
    "data_moviment" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "user_created_id" INTEGER NOT NULL,
    "updated" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "user_updated_id" INTEGER,
    "deleted" BOOLEAN NOT NULL DEFAULT false,
    "user_deleted_id" INTEGER,
    "closed" TIMESTAMP(3),

    CONSTRAINT "ProductMovement_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_ProductToProduct_tag" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL,

    CONSTRAINT "_ProductToProduct_tag_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE INDEX "Lote_id_idx" ON "Lote"("id");

-- CreateIndex
CREATE INDEX "Lote_user_created_id_idx" ON "Lote"("user_created_id");

-- CreateIndex
CREATE INDEX "Lote_user_updated_id_idx" ON "Lote"("user_updated_id");

-- CreateIndex
CREATE INDEX "Lote_user_deleted_id_idx" ON "Lote"("user_deleted_id");

-- CreateIndex
CREATE INDEX "Tanque_id_lote_idx" ON "Tanque"("id_lote");

-- CreateIndex
CREATE INDEX "Tanque_id_idx" ON "Tanque"("id");

-- CreateIndex
CREATE INDEX "Tanque_user_created_id_idx" ON "Tanque"("user_created_id");

-- CreateIndex
CREATE INDEX "Tanque_user_updated_id_idx" ON "Tanque"("user_updated_id");

-- CreateIndex
CREATE INDEX "Tanque_user_deleted_id_idx" ON "Tanque"("user_deleted_id");

-- CreateIndex
CREATE INDEX "Mortalidade_id_lote_idx" ON "Mortalidade"("id_lote");

-- CreateIndex
CREATE INDEX "Mortalidade_id_tanque_idx" ON "Mortalidade"("id_tanque");

-- CreateIndex
CREATE INDEX "Biometria_id_tanque_idx" ON "Biometria"("id_tanque");

-- CreateIndex
CREATE INDEX "Biometria_id_lote_idx" ON "Biometria"("id_lote");

-- CreateIndex
CREATE UNIQUE INDEX "Product_tag_name_key" ON "Product_tag"("name");

-- CreateIndex
CREATE INDEX "ProductMovement_id_lote_idx" ON "ProductMovement"("id_lote");

-- CreateIndex
CREATE INDEX "ProductMovement_productId_idx" ON "ProductMovement"("productId");

-- CreateIndex
CREATE INDEX "_ProductToProduct_tag_B_index" ON "_ProductToProduct_tag"("B");

-- CreateIndex
CREATE INDEX "Column_id_idx" ON "Column"("id");

-- CreateIndex
CREATE INDEX "Column_user_create_id_idx" ON "Column"("user_create_id");

-- CreateIndex
CREATE INDEX "Task_id_idx" ON "Task"("id");

-- CreateIndex
CREATE INDEX "Task_column_id_idx" ON "Task"("column_id");

-- CreateIndex
CREATE INDEX "Task_user_create_id_idx" ON "Task"("user_create_id");

-- CreateIndex
CREATE INDEX "User_id_idx" ON "User"("id");

-- CreateIndex
CREATE INDEX "User_user_id_create_idx" ON "User"("user_id_create");

-- CreateIndex
CREATE INDEX "User_user_id_update_idx" ON "User"("user_id_update");

-- CreateIndex
CREATE INDEX "User_user_id_delete_idx" ON "User"("user_id_delete");

-- AddForeignKey
ALTER TABLE "Tanque" ADD CONSTRAINT "Tanque_id_lote_fkey" FOREIGN KEY ("id_lote") REFERENCES "Lote"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Mortalidade" ADD CONSTRAINT "Mortalidade_id_lote_fkey" FOREIGN KEY ("id_lote") REFERENCES "Lote"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Mortalidade" ADD CONSTRAINT "Mortalidade_id_tanque_fkey" FOREIGN KEY ("id_tanque") REFERENCES "Tanque"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Biometria" ADD CONSTRAINT "Biometria_id_tanque_fkey" FOREIGN KEY ("id_tanque") REFERENCES "Tanque"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Biometria" ADD CONSTRAINT "Biometria_id_lote_fkey" FOREIGN KEY ("id_lote") REFERENCES "Lote"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProductMovement" ADD CONSTRAINT "ProductMovement_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProductMovement" ADD CONSTRAINT "ProductMovement_id_lote_fkey" FOREIGN KEY ("id_lote") REFERENCES "Lote"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ProductToProduct_tag" ADD CONSTRAINT "_ProductToProduct_tag_A_fkey" FOREIGN KEY ("A") REFERENCES "Product"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ProductToProduct_tag" ADD CONSTRAINT "_ProductToProduct_tag_B_fkey" FOREIGN KEY ("B") REFERENCES "Product_tag"("id") ON DELETE CASCADE ON UPDATE CASCADE;
