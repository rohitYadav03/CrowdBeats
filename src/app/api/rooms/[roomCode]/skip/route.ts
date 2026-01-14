import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { headers } from "next/headers";
import { NextResponse } from "next/server";

export async function POST(
  _req: Request,
  { params }: { params: Promise<{ roomCode: string }> }
) {
const { roomCode } = await params;
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

  const room = await prisma.room.findUnique({
    where: { roomCode:  roomCode  },
  });

  if (!room || room.host !== session.user.id) {
    return NextResponse.json({ message: "Forbidden" }, { status: 403 });
  }

  const nextSong = await prisma.song.findFirst({
    where: {
      roomId: room.id, // this condition I got it that roomId should match to current id 
      NOT: room.currentSongId ? { id: room.currentSongId } : undefined, // but I didnt understand this condition or check ?? what is this and why this ??
    },
    orderBy: [
      { vote: { _count: "desc" } },
      { createdAt: "asc" },
    ],
  });

  //  if no song then why we are setting it to null and all that ?? 
  if (!nextSong) {
    await prisma.room.update({
      where: { id: room.id },
      data: {
        currentSongId: null,
        startedAt: null,
        isPaused: false,
        pausedAt: null,
      },
    });
    return NextResponse.json({ success: true, empty: true });
  }

  // okay update the room tabel for the next song 
  await prisma.room.update({
    where: { id: room.id },
    data: {
      currentSongId: nextSong.id,
      startedAt: new Date(),
      isPaused: false,
      pausedAt: null,
    },
  });

  return NextResponse.json({ success: true });
}
