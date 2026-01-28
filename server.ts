import { createServer } from "http";
import { Server } from "socket.io";
import next from "next";
import prisma from "@/lib/prisma";

const dev = process.env.NODE_ENV !== "production";
const app = next({ dev });
const handle = app.getRequestHandler();

app.prepare().then(() => {
  const nodeHttpServer = createServer((req, res) => handle(req, res));

  const io = new Server(nodeHttpServer, {
    cors: {
      origin: process.env.FRONTEND_URL || "http://localhost:3000",
      credentials: true
    }
  });

  io.on("connection", (socket) => {
    console.log(`${socket.id} connected`);

    socket.on("join-room", ({ roomCode, userId }: { roomCode: string; userId: string }) => {
      console.log(`User ${userId} joining room ${roomCode}`);

      // Store in socket.data for disconnect event
      socket.data.roomCode = roomCode;
      socket.data.userId = userId;

      // Join Socket.IO room
      socket.join(roomCode);

      // Emit user count
      const userCount = io.sockets.adapter.rooms.get(roomCode)?.size || 0;
      io.to(roomCode).emit("user-count", userCount);
    });

    socket.on("playbackUpdated", (roomCode: string) => {
      io.to(roomCode).emit("fetchPlayback");
    });

    socket.on("queueUpdated", (roomCode: string) => {
      io.to(roomCode).emit("fetchQueue");
    });

    // Disconnect event
    socket.on("disconnect", async () => {
      console.log("User disconnected:", socket.id);

      const roomCode = socket.data.roomCode;
      const userId = socket.data.userId;

      if (!roomCode || !userId) return;

      try {
        const room = await prisma.room.findUnique({
          where: { roomCode },
          include: { song: true, roomMember: true }
        });

        if (!room) return;

        if (room.host === userId) {
          // Host left - cleanup
          await prisma.song.deleteMany({ where: { roomId: room.id } });
          await prisma.roomMember.deleteMany({ where: { roomId: room.id } });
          await prisma.room.delete({ where: { id: room.id } });

          io.to(roomCode).emit("room-ended", {
            message: "Host left. Room ended."
          });

          const socketsInRoom = await io.in(roomCode).fetchSockets();
          socketsInRoom.forEach((s) => s.leave(roomCode));
        } else {
          // Member left - update count
          const userCount = io.sockets.adapter.rooms.get(roomCode)?.size || 0;
          io.to(roomCode).emit("user-count", userCount);
        }
      } catch (error) {
        console.error("Disconnect error:", error);
      }
    });
  });

  nodeHttpServer.listen(3000, () => {
    console.log("🚀 Server on port 3000");
  });
});