import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { formatZodErrors } from "@/lib/validators/formatZodErrors";
import { headers } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import { z } from 'zod' 

const addSongSchema = z.object({
   thumbnail : z.string().url("Enter a valid url"),
   title : z.string().min(1, "Not the valid title"),
   roomCode : z.string().length(8, "RoomCode must be of 8 character long"),
   videoId : z.string().min(1, "VideoId is invalid ")
})

export async function POST(req : NextRequest){

const session = await auth.api.getSession({
    headers : await headers()
});

if(!session){
    return NextResponse.json({
success: false,
message: "Anuthorized",
    }, { status : 401})
};

const  body = await req.json();
const validatedData = addSongSchema.safeParse(body);

if(!validatedData.success) {
return NextResponse.json(
    {
    success: false,
    message: "Enter valid details",
    errors: formatZodErrors(validatedData.error),
    },
    { status: 400 }
  );
};

const { thumbnail, title, roomCode, videoId } = validatedData.data;

const roomDetails = await prisma.room.findUnique({
    where : {
        roomCode
    }
});

if(!roomDetails){
    return NextResponse.json({
     success : false,
     message : "Room not found"     
    }, { status : 404})
}

// we should also check if it member of that room or not 

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

// after checking all this we should also look for currentPlayinsongId
if(roomDetails.currentSongId === null){
// then create the room and then update the room Tabel 

const s = await prisma.song.create({
    data : {
        thumbnail,
        title,
        userId : session.user.id,
        roomId : roomDetails.id,
        videoId : videoId
    }
});

// then update the currentPlaying 
await prisma.room.update({
    where : {
        id : roomDetails.id
    },
    data : {
        currentSongId : s.id,
        startedAt : new Date()
    }
});


return NextResponse.json({
    firstSong : true,
    success : true,
    message : "SONG added successfully and first song added"
}, { status : 201})


}

const song = await prisma.song.create({
    data : {
        thumbnail,
        title,
        userId : session.user.id,
         roomId : roomDetails.id,
         videoId : videoId
    }
});

return NextResponse.json({
    firstSong : false,
    success : true,
    message : "SONG added successfully "
}, { status : 201})
}