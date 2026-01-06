"use client"

import { useState } from "react"

export default function Viwer({ roomCode} : { roomCode  : string}){
    const [showSearchModal, setYoutubeSerchModal] = useState(false)
    const [inputText , setInputText ] = useState("")
    const [youtubeData, setYoutubeData] = useState([])
    const [showSearchRes , setShowSearchRes] = useState(false) 

const fetchSongDetails = async() => {
// here we should cann the youtube api and get the detisla and then show it . 
const res = await fetch(`http://localhost:3000/api/youtube?q=${inputText}`, { method  : "GET"})
const data = await res.json();
console.log("data is  : ", data);
setYoutubeData(data.data.items)
setShowSearchRes(true)
};

const addSong = async({ thumbnail , title } : { thumbnail : string, title : string}) => {
// we can call the post endpoint here and roomId is coming form the prop that should not be the problem at all 

if(!thumbnail || !title){
  return alert("Invalid data")
};


const res = await fetch("http://localhost:3000/api/songs", { method : "POST" ,
  body : JSON.stringify({
thumbnail,
roomCode,
title
  })
});

if(!res.ok){
  return alert("Song not added")
};

const data = await res.json()
console.log("data : ", data);
setShowSearchRes(false);
setInputText("")
return;
};


const fetchQueue = async() => {
  
}


    return <div>
        <h2>Viwer component</h2>
<div>
    {/* for shoign the yputube emmed for later */}
</div>
{/* this condion setYoutubeSerchModal(!showSearchModal) -> I started by mistakly but It working as expecy how -> intalit it is false clicking it seeting it true and on the next click it is true !true is false and then clicking it setting it to false
  thats why it is working fine and as expected ??  */}
<button onClick={() => setYoutubeSerchModal(!showSearchModal)} className="border p-2 m-2 rounded-lg">AddSong</button>
{
    showSearchModal && <div>
        <input className="m-2 p-3 border rounded-2xl" value={inputText} onChange={(e) => setInputText(e.target.value)}/>
        <button onClick={fetchSongDetails} className="m-2 p-3 border rounded-2xl">Search Song</button>
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
      <button onClick={() => addSong({thumbnail: s.snippet.thumbnails.high.url, title :s.snippet.title})} className="border p-2 text-2xl rounded-2xl cursor-pointer">➕</button>
{/*  <button onClick={() => addSong(thumbnail: s.snippet.thumbnails.high.url, title :s.snippet.title)} className="border p-2 text-2xl rounded-2xl cursor-pointer">➕</button> */}
                </div> 
            })
        }
         </div>
}
    </div>
}
