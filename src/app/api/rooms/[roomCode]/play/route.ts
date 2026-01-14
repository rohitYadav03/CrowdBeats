import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { headers } from "next/headers";
import { NextResponse } from "next/server";

export async function POST(
  _req: Request, 
  { params }: { params: { roomCode: string } }
) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });

  const room = await prisma.room.findUnique({
    where: { roomCode: params.roomCode },
  });

  if (!room || room.host !== session.user.id || !room.pausedAt ) { // I dont undestand this conditon of !room.pausedAt -> it is chacking 
    // becuse !mean two thing one to change true to false and second when this conding will be true , ?? 
    // okay okay got it , it is pausedAt and which will have time when it was paused and  if there is no time then return 
    return NextResponse.json({ message: "Forbidden" }, { status: 403 });
  }

  const pauseDuration = Date.now() - room.pausedAt.getTime();
  // what is happening here is Date.now() give current time in ms and this also give time in ms room.pausedAt.getTime()
  // so what is happening here is we are finding the time for how much the song was paused like if the current time is 2 : 30 PM 
  // and pausedAt is 2 : 15 PM so pause time is of 15 min for 15min the song was paused , this is what we are doing just in ms 

  // then after that we are updating the room for the sync that othr user song is also get sync 
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
