import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { formatZodErrors } from "@/lib/validators/formatZodErrors";
import { headers } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import { success, z } from "zod"

const voteSchema = z.object({
    songId : z.string().min(1, "Invalid song"),
    roomCode : z.string().length(8, "not a valid room Code")
})

export async function POST(req : NextRequest){

const session  = await auth.api.getSession({
      headers : await headers()
});
  
if(!session) {
      return NextResponse.json(
          {
          success: false,
          message: "Unauthorized"
              }, { status: 401 });
}
  
const body = await req.json();
  
const result = voteSchema.safeParse(body);
  
if (!result.success) {
    return NextResponse.json(
      {
      success: false,
      message: "Invalid room Code",
      errors: formatZodErrors(result.error),
      },
      { status: 400 }
    );
}

  const { songId , roomCode } = result.data
  
  const roomDetils = await prisma.room.findUnique({
      where : {
          roomCode 
      }
  });
  
if(!roomDetils){
      return NextResponse.json({
          success : false,
          message : "Room not found",
      }, { status : 404})
};

const song = await prisma.song.findUnique({
  where: { id: songId }
});

if (!song || song.roomId !== roomDetils.id) {
  return NextResponse.json(
    { success: false, message: "Invalid song for this room" },
    { status: 400 }
  );
}

  const isMember = await prisma.roomMember.findUnique({
    where : {
        userId_roomId : {
            userId : session.user.id,
            roomId : roomDetils.id
        }
    }
  });

  if(!isMember){
    return NextResponse.json({
          success : false,
          message : "Not the member of this room",
      }, { status : 403})
  };

try {
  await prisma.vote.create({
    data: {
      userId: session.user.id,
      songId
    }
  });

  return NextResponse.json({
    success : true , 
    message : "VOTED SUCCESSFULLY"
  } , { status : 200})
} catch (err : any) {
  if(err.code === 'P2002'){
    return NextResponse.json({
      success : false ,
      message : "alredy voted"
    }, { status : 409})
  };
  console.error("Vote error:", err);
  return NextResponse.json({ success: false, message: "Failed to vote" }, { status: 500 });

}


}