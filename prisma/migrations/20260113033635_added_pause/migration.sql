-- AlterTable
ALTER TABLE "Room" ADD COLUMN     "isPaused" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "pausedAt" TIMESTAMP(3);
