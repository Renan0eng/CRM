/*
  Warnings:

  - The primary key for the `Biometria` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `Mortalidade` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `Product` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `ProductMovement` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `Product_tag` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `Tanque` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `_ProductToProduct_tag` table will be changed. If it partially fails, the table could be left without primary key constraint.

*/
-- DropForeignKey
ALTER TABLE "Biometria" DROP CONSTRAINT "Biometria_id_tanque_fkey";

-- DropForeignKey
ALTER TABLE "Mortalidade" DROP CONSTRAINT "Mortalidade_id_tanque_fkey";

-- DropForeignKey
ALTER TABLE "ProductMovement" DROP CONSTRAINT "ProductMovement_productId_fkey";

-- DropForeignKey
ALTER TABLE "_ProductToProduct_tag" DROP CONSTRAINT "_ProductToProduct_tag_A_fkey";

-- DropForeignKey
ALTER TABLE "_ProductToProduct_tag" DROP CONSTRAINT "_ProductToProduct_tag_B_fkey";

-- AlterTable
ALTER TABLE "Biometria" DROP CONSTRAINT "Biometria_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ALTER COLUMN "id_tanque" SET DATA TYPE TEXT,
ALTER COLUMN "user_created_id" SET DATA TYPE TEXT,
ALTER COLUMN "user_updated_id" SET DATA TYPE TEXT,
ALTER COLUMN "user_deleted_id" SET DATA TYPE TEXT,
ADD CONSTRAINT "Biometria_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "Biometria_id_seq";

-- AlterTable
ALTER TABLE "Lote" ALTER COLUMN "user_created_id" SET DATA TYPE TEXT,
ALTER COLUMN "user_updated_id" SET DATA TYPE TEXT,
ALTER COLUMN "user_deleted_id" SET DATA TYPE TEXT;

-- AlterTable
ALTER TABLE "Mortalidade" DROP CONSTRAINT "Mortalidade_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ALTER COLUMN "id_tanque" SET DATA TYPE TEXT,
ALTER COLUMN "user_created_id" SET DATA TYPE TEXT,
ALTER COLUMN "user_updated_id" SET DATA TYPE TEXT,
ALTER COLUMN "user_deleted_id" SET DATA TYPE TEXT,
ADD CONSTRAINT "Mortalidade_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "Mortalidade_id_seq";

-- AlterTable
ALTER TABLE "Product" DROP CONSTRAINT "Product_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ALTER COLUMN "user_created_id" SET DATA TYPE TEXT,
ALTER COLUMN "user_updated_id" SET DATA TYPE TEXT,
ALTER COLUMN "user_deleted_id" SET DATA TYPE TEXT,
ADD CONSTRAINT "Product_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "Product_id_seq";

-- AlterTable
ALTER TABLE "ProductMovement" DROP CONSTRAINT "ProductMovement_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ALTER COLUMN "productId" SET DATA TYPE TEXT,
ALTER COLUMN "user_created_id" SET DATA TYPE TEXT,
ALTER COLUMN "user_updated_id" SET DATA TYPE TEXT,
ALTER COLUMN "user_deleted_id" SET DATA TYPE TEXT,
ADD CONSTRAINT "ProductMovement_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "ProductMovement_id_seq";

-- AlterTable
ALTER TABLE "Product_tag" DROP CONSTRAINT "Product_tag_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ADD CONSTRAINT "Product_tag_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "Product_tag_id_seq";

-- AlterTable
ALTER TABLE "Tanque" DROP CONSTRAINT "Tanque_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ALTER COLUMN "user_created_id" SET DATA TYPE TEXT,
ALTER COLUMN "user_updated_id" SET DATA TYPE TEXT,
ALTER COLUMN "user_deleted_id" SET DATA TYPE TEXT,
ADD CONSTRAINT "Tanque_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "Tanque_id_seq";

-- AlterTable
ALTER TABLE "_ProductToProduct_tag" DROP CONSTRAINT "_ProductToProduct_tag_AB_pkey",
ALTER COLUMN "A" SET DATA TYPE TEXT,
ALTER COLUMN "B" SET DATA TYPE TEXT,
ADD CONSTRAINT "_ProductToProduct_tag_AB_pkey" PRIMARY KEY ("A", "B");

-- AddForeignKey
ALTER TABLE "Mortalidade" ADD CONSTRAINT "Mortalidade_id_tanque_fkey" FOREIGN KEY ("id_tanque") REFERENCES "Tanque"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Biometria" ADD CONSTRAINT "Biometria_id_tanque_fkey" FOREIGN KEY ("id_tanque") REFERENCES "Tanque"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProductMovement" ADD CONSTRAINT "ProductMovement_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ProductToProduct_tag" ADD CONSTRAINT "_ProductToProduct_tag_A_fkey" FOREIGN KEY ("A") REFERENCES "Product"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ProductToProduct_tag" ADD CONSTRAINT "_ProductToProduct_tag_B_fkey" FOREIGN KEY ("B") REFERENCES "Product_tag"("id") ON DELETE CASCADE ON UPDATE CASCADE;
