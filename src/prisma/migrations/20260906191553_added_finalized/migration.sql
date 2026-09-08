-- AlterTable
ALTER TABLE `idempotencykey` ADD COLUMN `finalized` BOOLEAN NOT NULL DEFAULT false;
