/*
  Warnings:

  - You are about to drop the column `drop_chanse` on the `case_skins` table. All the data in the column will be lost.
  - You are about to drop the column `descroption` on the `collections` table. All the data in the column will be lost.
  - You are about to drop the column `case_id` on the `user_inventory` table. All the data in the column will be lost.
  - Added the required column `drop_chance` to the `case_skins` table without a default value. This is not possible if the table is not empty.
  - Made the column `skin_id` on table `user_inventory` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "user_inventory" DROP CONSTRAINT "user_inventory_case_id_fkey";

-- AlterTable
ALTER TABLE "case_skins" DROP COLUMN "drop_chanse",
ADD COLUMN     "drop_chance" DOUBLE PRECISION NOT NULL;

-- AlterTable
ALTER TABLE "collections" DROP COLUMN "descroption",
ADD COLUMN     "description" TEXT;

-- AlterTable
ALTER TABLE "user_inventory" DROP COLUMN "case_id",
ALTER COLUMN "skin_id" SET NOT NULL;
