-- CreateIndex
CREATE INDEX "RoomMember_roomId_idx" ON "RoomMember"("roomId");

-- CreateIndex
CREATE INDEX "Song_roomId_idx" ON "Song"("roomId");

-- CreateIndex
CREATE INDEX "Song_roomId_createdAt_idx" ON "Song"("roomId", "createdAt");

-- CreateIndex
CREATE INDEX "Vote_songId_idx" ON "Vote"("songId");
