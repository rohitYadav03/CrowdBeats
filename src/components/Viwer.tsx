"use client"

import { useEffect, useState } from "react"
import socket from "./socketClinet"

export default function Viwer({ roomCode} : { roomCode  : string}){
    const [showSearchModal, setYoutubeSerchModal] = useState(false)
    const [inputText , setInputText ] = useState("")
    const [youtubeData, setYoutubeData] = useState([])
    const [showSearchRes , setShowSearchRes] = useState(false) 
    const [queueData , setQueueData] = useState()
 
    const [videoId , setVideoId] = useState<string | null>(null);
    const [msg , setMesg] = useState("");
    const [startedAt, setStartedAt] = useState<Date | null>(null);

const fetchSongDetails = async() => {
const res = await fetch(`http://localhost:3000/api/youtube?q=${inputText}`, { method  : "GET"})
const data = await res.json();
setYoutubeData(data.data.items)
setShowSearchRes(true)
};

const addSong = async({ thumbnail , title , videoId} : { thumbnail : string, title : string, videoId : string}) => {
// we can call the post endpoint here and roomId is coming form the prop that should not be the problem at all 

if(!thumbnail || !title){
  return alert("Invalid data")
};


const res = await fetch("http://localhost:3000/api/songs", { method : "POST" ,
  body : JSON.stringify({
thumbnail,
roomCode,
title,
videoId
  })
});

if(!res.ok){
  return alert("Song not added")
};

const data = await res.json()
console.log("data from adding the song : ", data);
if(data.firstSong === true){
  socket.emit("firstSongAdded", roomCode);
  
}
setShowSearchRes(false);
setInputText("");
socket.emit("queue-changed", roomCode)
console.log("emit should have done successfully ??");
return setYoutubeSerchModal(false);
};

const fetchQueue = async() => {
   const allQueueSong = await fetch(`http://localhost:3000/api/songs/queue?roomCode=${roomCode}`, { method : "GET"});
   const data = await allQueueSong.json();
   setQueueData(data.data);
};

// for voteing the song and then through socket emit the event and then refetch thrugh calling the fetchQueue again
const upVote = async({ songId} : { songId : string}) => {
  const res = await fetch("http://localhost:3000/api/vote", {
    method : "POST",
    body : JSON.stringify({
      songId,
      roomCode
    })
  });

  const data = await res.json();
  // ideally we should set the error and then show it just for now I am avoiding it 
  console.log("data after vote : ", data);
  if(res.ok){
    console.log("vote should have done");   
    return socket.emit("queue-changed", roomCode);
  }
  return alert(data.message)
  
}

const getCurrentPlaying = async () => {
  const res = await fetch(
    `http://localhost:3000/api/rooms/${roomCode}/playback`,
    { method: "GET" }
  );
  const data = await res.json();
  
  if (!res.ok) {
    setMesg(data.message);
    return;
  }

  console.log("current playing song is : ", data);
  setVideoId(data.data.videoId);
  setStartedAt(new Date(data.data.startedAt))
};

const getStartSeconds = () => {
  if (!startedAt) return 0;
  const diff = Math.floor((Date.now() - startedAt.getTime()) / 1000);
  return Math.max(0, diff); // small buffer
};



useEffect(() => {
 fetchQueue();
 getCurrentPlaying();
}, []);

useEffect(() => {
  socket.on("queue-updated", () => {
  // means here song is added now we should refetch the data from the queue
 console.log("fetch queue should have been called");
  fetchQueue();
  });

  socket.on("playbackUpdated", () => {
    console.log("listen on the first song added");
     getCurrentPlaying();
  })

  return () => {
    socket.off("queue-updated");
    socket.off("playbackUpdated");
  };

}, [])


return <div>
        <h2>Viwer component</h2>

<button onClick={() => setYoutubeSerchModal(!showSearchModal)} className="border p-2 m-2 rounded-lg">
  AddSong
  </button>
  {
    msg && <div> 
      <h1 className="text-2xl font-bold text-red-300">{msg}</h1>
    </div>
  }

{videoId && startedAt && (
  <iframe
    key={`${videoId}-${startedAt.getTime()}`}
    width="560"
    height="315"
    src={`https://www.youtube.com/embed/${videoId}?autoplay=1&muted=0&start=${getStartSeconds()}`}
    allow="autoplay; encrypted-media"
    allowFullScreen
  />
)}


{
   queueData && <div>
    {
      // @ts-ignore
      queueData.map((eachSong) => {
        
        return <div key={eachSong.id} className="flex items-center justify-start gap-2">
          <img className="w-40" src={eachSong.thumbnail}/>
          <h3 className="w-80">{eachSong.title}</h3>
          
          <button onClick={() => upVote({songId : eachSong.id})} 
          className="border p-2 rounded-lg">
            Vote
            </button>

          <h1 className="font-bold text-2xl text-red-300">Vote : {eachSong.vote.length}</h1>
          </div>
      })
    }
     </div>
}
{
    showSearchModal && <div>
        <input className="m-2 p-3 border rounded-2xl" value={inputText} onChange={(e) => setInputText(e.target.value)}/>
        <button onClick={fetchSongDetails}
         className="m-2 p-3 border rounded-2xl"
         >Search Song
         </button>
        </div>
}
{
    showSearchRes && <div>
        {
            youtubeData.map((s) => {
                // @ts-ignore
              return <div key={s.id.videoId} className="flex items-center justify-start gap-4">
    {/*    @ts-ignore */}
      <img className="w-40" src={s.snippet.thumbnails.high.url}/>
        {/*    @ts-ignore */}
      <h3 className="w-80">{s.snippet.title}</h3>
      {/* what is the diffenct in passing the parsam in deiffent way like this and what is the corret and we cant direct give 
      like addSong() in the onClick becuse it means call it immdetly , so we have to pass it callback form  */}
      {/* @ts-ignore */}
      <button onClick={() => addSong({thumbnail: s.snippet.thumbnails.high.url, title :s.snippet.title, videoId : s.id.videoId})} 
      className="border p-2 text-2xl rounded-2xl cursor-pointer">
        ➕
        </button>
{/*  <button onClick={() => addSong(thumbnail: s.snippet.thumbnails.high.url, title :s.snippet.title)} className="border p-2 text-2xl rounded-2xl cursor-pointer">➕</button> */}
                </div> 
            })
        }
        </div>
}
    </div>
};


// lets understand the complete flow first 
//1. on the mount we are fetching the queue and showing it  
//2 and also calling the /playback api for on the mount , which is getting the current playing sond id and started at 
//3. and whenever there will be song added in the room there is condtion which we are checking is this firstSong which
// we are getting it from the backend true or false , and if it is true then we are sending the event , and backend will emit 
// the placback event to all the user in the room that first song is added call the getCurrentPlaying once again and then 
// start showin it , this is how my code is looking , 