import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { formatZodErrors } from "@/lib/validators/formatZodErrors";
import { headers } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import { z} from "zod"

const joinRoomSchema = z.object({
    roomCode : z.string().min(8 , "Room code is must of 8 character !")
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

const result = joinRoomSchema.safeParse(body);

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

const { roomCode } = result.data

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
}

const alredyRoomJoined = await prisma.roomMember.findUnique({
    where : {
        userId_roomId : {
        userId : session.user.id,
        roomId : roomDetils.id
        }
    }
});

if(alredyRoomJoined){
  return NextResponse.json({
    success : true,
    message : "Already joined the room",
  }, { status : 200})
}
    await prisma.roomMember.create({
        data : {
            userId : session.user.id,
            roomId : roomDetils.id
        }
    });

return NextResponse.json({
        success : true,
        message : "Room joined"
    }, { status : 201})

}