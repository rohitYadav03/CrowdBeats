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
    where: { roomCode}
  });

  if (!room || room.host !== session.user.id || !room.pausedAt ) { 
    return NextResponse.json({ message: "Forbidden" }, { status: 403 });
  }

  const pauseDuration = Date.now() - room.pausedAt.getTime(); // get the time for how much time it was paused

  // then after that we are updating the room for the sync that othr user song is also get sync 
  // we are changing the startedAt 
  await prisma.room.update({
    where: { id: room.id },
    data: {
      isPaused: false,
      pausedAt: null, // seting it to null again after play ??
      startedAt: new Date(room.startedAt!.getTime() + pauseDuration),
    },
  });

  return NextResponse.json({ success: true });
}
