"use client"

import { useEffect, useState } from "react";

// currentSongId : "7e34d7bb-d6ee-4164-a977-7a93cb51155b"
// startedAt : "2026-01-13T01:28:14.555Z"
// videoId : "dXl2NdlmeIE"

export default function Host({ roomCode} : {roomCode : string}){
const [msg , setMsg] = useState("");
const [startedAt , setStartedAt] = useState<Date | null>(null);
const [ videoId , setVideoId] = useState("");

const currentSongDetils = async () => {
    // get the current song detisla and all that 
    const res = await fetch(`http://localhost:3000/api/rooms/${roomCode}/playback`, { method : "GET"});
    const data = await res.json();
    console.log("data from the playback api for host : ", data);
    
    if(!res.ok){
   setMsg(data.message)
    };
  setVideoId(data.data.videoId);
  setStartedAt(new Date(data.data.startedAt))
};

const getStartSeconds = () => {
  if (!startedAt) return 0;
  const diff = Math.floor((Date.now() - startedAt.getTime()) / 1000);
  return Math.max(0, diff); 
};

useEffect(() => {
 currentSongDetils();
}, [])

    return <div>
        <h1>Host component</h1>

 { 
    msg && <h1>{msg}</h1>
 }       

    </div>
}