import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { headers } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export async function POST(
  _req: NextRequest, 
  { params }: { params: { roomCode: string } }
) {
  const session = await auth.api.getSession({ headers: await headers() }); // auth check 
  if (!session) return NextResponse.json({ message: "Unauthorized" }, { status: 401 }); // if not the return form here only

  const room = await prisma.room.findUnique({
    where: { roomCode: params.roomCode },
  });// find the room with the given roomCode which is found in the params

  if (!room || room.host !== session.user.id ) {
    return NextResponse.json({ message: "Forbidden" }, { status: 403 });
  }; // if room not found or the loggedIn user is not the host ther return

  // update the room , to make pause
  await prisma.room.update({
    where: { id: room.id },
    data: {
      isPaused: true, // set pause to true
      pausedAt: new Date(), // and current time when the video was paused at what time 
    },
  });

  return NextResponse.json({ success: true });
}
