import RoomPageClient from "@/components/RoomPage";

export default async function RoomPage({ params} : {params : Promise<{roomCode : string}>}){
const  {roomCode} = await params;

    return <RoomPageClient roomCode={roomCode} />
}