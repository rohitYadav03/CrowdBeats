"use client"
import { useEffect, useState } from "react"
import Host from "./Host";
import Viwer from "./Viwer";


export default function RoomPageClient({ roomCode} : { roomCode : string}){
const [role , setRole] = useState("");
const [loading , setLoading] = useState(true)

const fetchDetails = async() => {
  console.log("function called"); 
  const res = await fetch(`http://localhost:3000/api/rooms/${roomCode}`, { method : "GET"});
  const data = await res.json();
  console.log("data : ", data);
  setRole(data.data.role)
  setLoading(false)
};

useEffect(() => {
   fetchDetails();
}, []);

if(loading){
    return <h1>Loading...</h1>
}

return <div>
   { role == "host" ? <Host /> : <Viwer />}
</div>

}