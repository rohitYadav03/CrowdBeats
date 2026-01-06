"use client"
import { useEffect, useState } from "react"
import Host from "./Host";
import Viwer from "./Viwer";


export default function RoomPageClient({ roomCode} : { roomCode : string}){
const [role , setRole] = useState<"host" | "listener" | null>(null);
const [loading , setLoading] = useState(true)
const [error , setError] = useState("")

const fetchDetails = async() => {
    console.log("function called");
    
setLoading(true);
setError("");
  const res = await fetch(`http://localhost:3000/api/rooms/${roomCode}`, { method : "GET"});
  const data = await res.json();
  console.log("data : ", data);

if(!res.ok || !data.success){
    setError(data.message || "Something went wrong");
    setLoading(false);
    return;
}

if(res.ok){
setRole(data.data.role)
setLoading(false)
}
  setLoading(false)
};

useEffect(() => {
   fetchDetails();
}, [roomCode]);

if(loading){
    return <h1>Loading...</h1>
}

if(error){
    return <h1 className="text-red-500">{error}</h1>
}

return <div>
   { role == "host" ? <Host /> : <Viwer roomCode={roomCode}/>}
</div>

}