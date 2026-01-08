import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { headers } from "next/headers";
import { NextRequest, NextResponse } from "next/server";


export async function GET(req : NextRequest){

const session = await auth.api.getSession({
    headers : await headers()
});

if(!session){
    return NextResponse.json({
success: false,
message: "Anuthorized",
    }, { status : 401})
};

const roomCode = req.nextUrl.searchParams.get("roomCode")


if(!roomCode || roomCode.length !== 8){
    return NextResponse.json({
        success : false,
        message : "Not a valid roomCode"
    }, { status : 400})
};

const roomDetails = await prisma.room.findUnique({
    where : {
         roomCode : roomCode
    }
});

if(!roomDetails){
    return NextResponse.json({
     success : false,
     message : "Room not found"     
    }, { status : 404})
}


const isMember = await prisma.roomMember.findUnique({
    where : {
        userId_roomId : {
            userId : session.user.id,
            roomId : roomDetails.id
        }
    }
});

if(!isMember){
    return NextResponse.json({
  success : false,
  message : "You are not the member of this room"
    }, { status : 403});
}



const queueSongs = await prisma.song.findMany({
    where : {
        roomId : roomDetails.id,
    },
    include : {
  vote : true
    },
    orderBy : [
        {vote  : {  _count : "desc" } }, 
        { createdAt : "asc"} 
    ]
});

return NextResponse.json({
    success : true,
    message : "Queue fetched ",
    data : queueSongs
}, { status : 200})


};