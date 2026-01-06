import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { formatZodErrors } from "@/lib/validators/formatZodErrors";
import { headers } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod"

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

// here also check if he is the member of that room or not otherwise anyone can vote in the anyroom 
// and for that we also need the roomCode and get the roomId form the roomCode and then check for the 
// member and after all of this check then we should upvote it , so add the roomCode also in the body
  
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

// now it is member alos , signed in and all the check is done 
// we could check if the songId is valid or not , but we have realtion and 
// if the songId will not be valid then it will automicall not vote it song this is okay
//  becuse we should think about performance as well ??

try {
  await prisma.vote.create({
    data: {
      userId: session.user.id,
      songId
    }
  });
} catch (err) {
  return NextResponse.json(
    { success: false, message: "Already voted" },
    { status: 409 }
  );
}


}