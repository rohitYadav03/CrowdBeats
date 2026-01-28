import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { headers } from "next/headers";
import { NextResponse } from "next/server";

export async function POST( _req : Request , { params } : { params : Promise<{ roomCode : string}>}){

  const { roomCode } = await params;
  const session = await auth.api.getSession({
    headers  : await headers()
  });

  if(!session){
    return NextResponse.json({
      message : 'Unauthorized'
    }, { status : 401})
  };

  const room = await prisma.room.findUnique({
    where : {
      roomCode 
    }
  })

  if(!room || room.host !== session.user.id){
    return NextResponse.json({
      message : 'Forbidden'
    } , { status : 403})
  };

// NOTE: Ideally this logic should be wrapped in a DB transaction
// to ensure atomicity. Will refactor after studying ACID properties.

  if(room.currentSongId){
    await prisma.song.delete({
      where : {
        id : room.currentSongId
      }
    })
  };
 
  const nextsong = await prisma.song.findFirst({
    where : {
      roomId : room.id
    },
    orderBy  : [
      { vote : { _count : "desc"}},
      { createdAt : "asc"}
    ]
  })

  if (!nextsong) {
    await prisma.room.update({
      where: { id: room.id },
      data: {
        currentSongId: null,
        startedAt: null,
        isPaused: false,
        pausedAt: null,
      },
    });
return NextResponse.json({ empty : true})
  }
await prisma.room.update({
  where : {
    id : room.id
  },
  data : {
    currentSongId : nextsong.id,
    startedAt : new Date(),
    isPaused : false,
    pausedAt : null
  }
});
return NextResponse.json({ success: true });

}