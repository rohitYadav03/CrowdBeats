export default async function RoomPage({ params} : {params : Promise<{roomId : string}>}){
    const   {roomId} = await params;
    return <div>
<h1>{roomId}</h1>
    </div>
}