/*
  Warnings:

  - The primary key for the `User` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - Added the required column `user_create_id` to the `Column` table without a default value. This is not possible if the table is not empty.
  - Added the required column `user_create_id` to the `Task` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Column" ADD COLUMN     "user_create_id" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Task" ADD COLUMN     "user_create_id" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "User" DROP CONSTRAINT "User_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ADD CONSTRAINT "User_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "User_id_seq";

-- AddForeignKey
ALTER TABLE "Task" ADD CONSTRAINT "Task_user_create_id_fkey" FOREIGN KEY ("user_create_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Column" ADD CONSTRAINT "Column_user_create_id_fkey" FOREIGN KEY ("user_create_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
