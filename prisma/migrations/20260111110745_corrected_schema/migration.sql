/*
  Warnings:

  - Added the required column `videoId` to the `RoomMember` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Room" ADD COLUMN     "currentSongId" TEXT,
ADD COLUMN     "startedAt" TIMESTAMP(3);

-- AlterTable
ALTER TABLE "RoomMember" ADD COLUMN     "videoId" TEXT NOT NULL;
