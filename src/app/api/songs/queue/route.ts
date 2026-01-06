import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { headers } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import { success } from "zod";

// api/songs/queue -> in this we should get the queue of all the song, to show in the frontend 

export async function GET(req : NextRequest){
// now here 
// logic -> get the user session 
// -> get the roomCode in the payload -> check room exist then 
// -> get the roomDetils and check user is the member of the room 
// then get the songs with for that room and 

const session = await auth.api.getSession({
    headers : await headers()
});

if(!session){
    return NextResponse.json({
success: false,
message: "Anuthorized",
    }, { status : 401})
};

const body = await req.json();

if(!body.roomCode || body.roomCode.length != 8){
    return NextResponse.json({
        success : false,
        message : "Not a valid roomCode"
    }, { status : 400})
};

const roomDetails = await prisma.room.findUnique({
    where : {
         roomCode : body.roomCode
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

// now here user is logeed in , and member of the room now he should 
// able to get the queue 

const queueSongs = await prisma.song.findMany({
    where : {
        roomId : roomDetails.id,
    },
    include : {
        vote : true
    },
    orderBy : [
        
    ]
})


};