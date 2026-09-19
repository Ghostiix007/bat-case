/*
  Warnings:

  - You are about to drop the column `drop_weight` on the `case_skins` table. All the data in the column will be lost.
  - You are about to drop the column `dropped_at` on the `user_inventory` table. All the data in the column will be lost.
  - You are about to drop the column `status` on the `user_inventory` table. All the data in the column will be lost.
  - Added the required column `drop_chanse` to the `case_skins` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "case_skins" DROP COLUMN "drop_weight",
ADD COLUMN     "drop_chanse" DOUBLE PRECISION NOT NULL;

-- AlterTable
ALTER TABLE "cases" ADD COLUMN     "collection_id" TEXT;

-- AlterTable
ALTER TABLE "user_inventory" DROP COLUMN "dropped_at",
DROP COLUMN "status",
ALTER COLUMN "skin_id" DROP NOT NULL;

-- DropEnum
DROP TYPE "ItemStatus";

-- CreateTable
CREATE TABLE "collections" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "imageUrl" TEXT NOT NULL,
    "descroption" TEXT,

    CONSTRAINT "collections_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "cases" ADD CONSTRAINT "cases_collection_id_fkey" FOREIGN KEY ("collection_id") REFERENCES "collections"("id") ON DELETE SET NULL ON UPDATE CASCADE;
