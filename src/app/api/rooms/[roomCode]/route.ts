import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { headers } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export async function GET(_req : Request, { params } : { params : Promise<{roomCode : string}>}){

const { roomCode } = await params;

const session = await auth.api.getSession({
    headers : await headers()
});

if(!session){
return NextResponse.json(
    { success : false, message :  "Unauthorized" },
    { status : 401}
)
};

const roomDetisls = await prisma.room.findUnique({
        where : {
            roomCode
        }
});

if(!roomDetisls){
        return NextResponse.json(
    { success : false, message :  "invalid room Code" },
    { status : 404}
)};

const memberOfRoom = await prisma.roomMember.findUnique({
    where : {
        userId_roomId : {
            userId : session.user.id,
            roomId : roomDetisls.id
        }
    }
});

if(!memberOfRoom){
        return NextResponse.json(
    { success : false, message :  "You have not the member of this room" },
    { status : 403}
)
}

return NextResponse.json(
    { success : true, 
        message : "user detils are valid",
        data : {
            role : memberOfRoom.role
        }
     },
    { status : 200}
)

}