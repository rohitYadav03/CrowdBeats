"use client";
import { useEffect, useState } from "react";
import { useSession } from "@/lib/auth-client";
import { toast } from "sonner";
import Host from "./Host"; // Import the Host component
import Viewer from "./Viwer"; // Import the Viewer component
import socket from "./socketClinet";
import { RoomLoadingSkeleton } from "./RoomLoadingSkeleton";
import { useRouter } from "next/navigation";

// let understand this component -> deply
export default function RoomPageClient({ roomCode }: { roomCode: string }) {
  const router = useRouter();
  const { data : session } = useSession();
  const [role, setRole] = useState<"host" | "listener" | null>(null); // for storing the role of the user in the state variable
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // this function get the role of the user and set it in the state variable
  const fetchDetails = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch(`/api/rooms/${roomCode}`, { method : "GET"});
      const data = await res.json();

      if (!res.ok || !data.success) {
        setError(data.message || "Something went wrong");
        return;
      }

      setRole(data.data.role);
    } catch (err) {
      setError("Failed to load room");
    } finally {
      setLoading(false);
    }
  };


  useEffect(() => {
    fetchDetails();
  }, [roomCode]);

  // there in the roomPage which is bettween the dashboard -> the main componet host or viwer
  // we will join the room ,  
  useEffect(() => {
    if(!session?.user.id) return;

    // emit the join-room with data object
    socket.emit("join-room", {
      roomCode : roomCode,
      userId : session.user.id
    });

    socket.on("room-ended", (data : { message : string}) => {
      toast.error(data.message , { duration : 5000});
      setTimeout(() => {
   router.push("/dashboard")
      }, 2000)
    })

    return () => {
      socket.off("room-ended");
    };
  }, [roomCode, session, router]); // explain this depncy
  // now we have joined the room lets go to host componet and viwer componet to make it proper sync 

  if (loading) {
    return (
      <RoomLoadingSkeleton />
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-400 mb-2">Error</h1>
          <p className="text-gray-400">{error}</p>
        </div>
      </div>
    );
  }

  return role === "host" ? (
    <Host roomCode={roomCode} />
  ) : (
    <Viewer roomCode={roomCode} />
  );
}