import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { headers } from "next/headers";
import { NextRequest, NextResponse } from "next/server";


export async function GET(req  : NextRequest , { params } : {params : Promise<{ roomCode : string}>}){
const { roomCode } = await params;

const session = await auth.api.getSession({
    headers : await headers()
});

if (!session) {
    return NextResponse.json({
        message : "Unauthroized bro"
    }, { status : 401})
};


const roomDetails = await prisma.room.findUnique({
    where : {
        roomCode
    }
});

if(!roomDetails){
    console.log("this room not found");
    
    return NextResponse.json({
        message : "No room found"
    }, { status : 404})
}

const isMember = await prisma.roomMember.findFirst({
  where : {
userId : session.user.id,
roomId : roomDetails.id
  }
});

if (!isMember) {
     return NextResponse.json({
        message : "unAuthrized"
    }, { status : 403})
};

if(!roomDetails.currentSongId){
    return NextResponse.json({
        message : "No current playing song"
    }, { status : 400})
}

const songDetils = await prisma.song.findUnique({
    where : {
        id : roomDetails.currentSongId
    }
});

if(!songDetils){
    return NextResponse.json({
        message : "Invalid songId"
    }, { status : 400})
}

return NextResponse.json({ 
     message : "Room detils and song fetch succesfully",
     data : {
       currentSongId : roomDetails.currentSongId,
       startedAt : roomDetails.startedAt,
       videoId : songDetils.videoId,
       isPaused : roomDetails.isPaused
     }
}, { status : 200})

};

