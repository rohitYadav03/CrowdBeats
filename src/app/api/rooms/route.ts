import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { headers } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import {v4 as uuidv4}  from "uuid";

export async function POST(_req : NextRequest){

const session = await auth.api.getSession({
        headers : await headers()
});

if(!session){
        return NextResponse.json({
            message : "Unauthorized"
        }, { status : 403})
}

const uuid = uuidv4()

const roomCode = uuid.slice(0,8);

const room = await prisma.room.create({
    data : {
host : session.user.id,
roomCode
    }
});

await prisma.roomMember.create({
    data : {
       userId : session.user.id,
       roomId : room.id,
       role : "host" 
    }
})

if(!room){
    return NextResponse.json({
        message : "Something went wrong"
    },{ status : 500})
}

return NextResponse.json({
    message : "Room created scuessfully",
    data : room.roomCode
}, { status : 201})

}

