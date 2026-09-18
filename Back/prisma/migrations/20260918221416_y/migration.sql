/*
  Warnings:

  - A unique constraint covering the columns `[steam_id]` on the table `users` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `price` to the `user_inventory` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "case_skins" ALTER COLUMN "drop_chance" DROP NOT NULL;

-- AlterTable
ALTER TABLE "cases" ADD COLUMN     "accent" TEXT DEFAULT '#ffd700',
ADD COLUMN     "code" TEXT,
ADD COLUMN     "type" TEXT DEFAULT 'default',
ADD COLUMN     "volatility" TEXT DEFAULT 'Mid';

-- AlterTable
ALTER TABLE "skins" ADD COLUMN     "weapon" TEXT;

-- AlterTable
ALTER TABLE "user_inventory" ADD COLUMN     "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "price" DECIMAL(10,2) NOT NULL,
ADD COLUMN     "source" TEXT DEFAULT 'case',
ADD COLUMN     "wear" TEXT DEFAULT 'Factory New';

-- AlterTable
ALTER TABLE "users" ADD COLUMN     "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "free_case_used" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "steam_id" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "users_steam_id_key" ON "users"("steam_id");
