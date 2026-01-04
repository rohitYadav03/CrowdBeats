"use client"

import { useSession } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react"

interface createRoomApiData {
    message : string,
    data : string
}

export default function Dashboard(){
    const router = useRouter()
   const [inputCode , setInputCode] = useState("");

   const { data , isPending } = useSession();

   // now side effect during render -> pure function call -> so redirect only on useEffect
   useEffect(() => {
if(!data && !isPending){
    router.push("/")
}
   }, [data, isPending]);

   if(isPending){
    return <h1>Loading....</h1>
   }

   const name = data?.user.name;

   const createRoom = async() => {
  const res = await fetch('http://localhost:3000/api/rooms', { method : "POST"});
  const data : createRoomApiData = await res.json();
  if(!res.ok){
    return alert("Room not created")
  }
// here it come means that user click on on the create room button and we hit the api and the room is 
// created now we should redirect the user to that room 
return router.push(`/room/${data.data}`)
   }

   return <div className="flex flex-col w-2/4 items-center justify-center mt-10">
    <h1 className="text-lg font-extrabold">Dashboard Page</h1>
    <h1>Welcome ,{ name} </h1>
<button onClick={createRoom} className="border p-3 rounded-lg m-4">Create Room</button>
<input className="border p-2 rounded-2xl m-4" value={inputCode} onChange={(e) => setInputCode(e.target.value)}/>
<button>Join Room</button>
    </div>
}