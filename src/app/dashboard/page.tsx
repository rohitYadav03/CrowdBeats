"use client";
import { toast } from "sonner"
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Plus, LogIn, Music2, Sparkles, Check } from "lucide-react";
import { useSession } from "@/lib/auth-client";
import { DashboardLoadingSkeleton } from "@/components/RoomLoadingSkeleton";

export default function DashboardPage() {
  const [inputCode, setInputCode] = useState(""); // roomCode enter by user
  const [error, setError] = useState("");
  const [isCreating, setIsCreating] = useState(false);
  const [isJoining, setIsJoining] = useState(false);

  const  {data , isPending} = useSession()

  useEffect(() => {
    console.log(data , isPending);
    
   if(!data && !isPending){
    window.location.href = "/"
   }
  }, [data, isPending]);

  const createRoom = async () => {
    setIsCreating(true);
    try {
      const res = await fetch("/api/rooms", {
        method: "POST",
      });
      const data = await res.json();


      if (!res.ok) {
        toast.error("Failed to create room")
      }

      window.location.href = `/room/${data.data}`;
    } catch (err) {
      toast.error("Failed to create room ")
    } finally {
      setIsCreating(false);
    }
  };

  const joinRoom = async () => {
    if (inputCode.length !== 8) {
      setError("Room code must be 8 characters");
      return;
    }

    setIsJoining(true);
    setError("");

    try {
      const res = await fetch("/api/rooms/join", {
        method: "POST",
        body: JSON.stringify({ roomCode: inputCode }),
      });

      if (res.ok) {
        window.location.href = `/room/${inputCode}`;
        return;
      }

      const data = await res.json();
      setError(data?.message || "Failed to join");
    } catch (err) {
      setError("Something went wrong");
    } finally {
      setIsJoining(false);
    }
  };

  if(isPending){
    return <DashboardLoadingSkeleton />
  }

  return (
    <div className="min-h-screen bg-black relative overflow-hidden">
      {/* Animated background orbs */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-yellow-500/20 rounded-full blur-3xl animate-pulse" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl animate-pulse delay-1000" />
      <div className="absolute top-1/2 left-1/2 w-72 h-72 bg-pink-500/10 rounded-full blur-3xl animate-pulse delay-1000" />

      {/* Header */}
      <header className="relative z-10 border-b border-white/10 bg-black/50 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-gradient-to-br from-purple-500/20 to-blue-500/20">
              <Music2 className="w-6 h-6 text-purple-400" />
            </div>
            <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-blue-400">
              Crowdbeat
            </span>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center text-white font-semibold shadow-lg shadow-purple-500/50">
              { data?.user.name.slice(0,1).toUpperCase()}
            </div>
          </div>
        </div>
      </header>

      {/* Main content */}
      <div className="relative z-10 max-w-6xl mx-auto px-6 py-16">
        {/* Welcome section */}
        <div className="text-center mb-16 space-y-4">
        
          <div className="inline-block">
            <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-purple-500/10 border border-purple-500/20 mb-4">
              <Sparkles className="w-4 h-4 text-purple-400" />
              <span className="text-sm text-purple-300 font-medium">Your music, your crowd</span>
            </div>
          </div>
          
          <h1 className="text-5xl md:text-6xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 mb-4">
            Ready to vibe?
          </h1>
          
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">
            Create your own room or join an existing party and control the music together
          </p>
        </div>

        {/* Cards grid */}
        <div className="grid md:grid-cols-2 gap-8 mb-12">
          {/* Create Room Card */}
          <Card className="relative group bg-gradient-to-br from-purple-950/40 via-purple-900/20 to-black border-purple-500/20 p-8 hover:border-purple-500/40 transition-all duration-500 overflow-hidden">
            {/* Animated gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-br from-purple-500/0 via-purple-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            
            <div className="relative flex flex-col items-center text-center space-y-6">
              {/* Icon container */}
              <div className="relative">
                <div className="absolute inset-0 bg-purple-500/20 rounded-3xl blur-xl group-hover:bg-purple-500/30 transition-all" />
                <div className="relative w-24 h-24 rounded-3xl bg-gradient-to-br from-purple-500/30 to-pink-500/30 flex items-center justify-center group-hover:scale-110 transition-transform duration-300 border border-purple-500/20">
                  <Plus className="w-12 h-12 text-purple-400" />
                </div>
              </div>

              {/* Text content */}
              <div className="space-y-2">
                <h2 className="text-3xl font-bold text-white">
                  Create Room
                </h2>
                <p className="text-gray-400">
                  Start a new session and invite your friends to join the party
                </p>
              </div>

              {/* Button */}
              <Button
                onClick={createRoom}
                disabled={isCreating}
                className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-semibold py-6 rounded-2xl transition-all hover:scale-105 hover:shadow-2xl hover:shadow-purple-500/50 disabled:opacity-50 disabled:hover:scale-100 border-0"
              >
                {isCreating ? ( 
                  <span className="flex items-center gap-2">
                    <Sparkles className="w-5 h-5 animate-spin" />
                    Creating your room...
                  </span>
                ) : (
                  <span className="flex items-center gap-2">
                    <Plus className="w-5 h-5" />
                    Create New Room
                  </span>
                )}
              </Button>

              {/* Subtle info */}
              <p className="text-xs text-gray-500">
                Get a shareable code instantly
              </p>
            </div>
          </Card>

          {/* Join Room Card */}
          <Card className="relative group bg-gradient-to-br from-blue-950/40 via-blue-900/20 to-black border-blue-500/20 p-8 hover:border-blue-500/40 transition-all duration-500 overflow-hidden">
            {/* Animated gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/0 via-blue-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            
            <div className="relative flex flex-col items-center text-center space-y-6">
              {/* Icon container */}
              <div className="relative">
                <div className="absolute inset-0 bg-blue-500/20 rounded-3xl blur-xl group-hover:bg-blue-500/30 transition-all" />
                <div className="relative w-24 h-24 rounded-3xl bg-gradient-to-br from-blue-500/30 to-cyan-500/30 flex items-center justify-center group-hover:scale-110 transition-transform duration-300 border border-blue-500/20">
                  <LogIn className="w-12 h-12 text-blue-400" />
                </div>
              </div>

              {/* Text content */}
              <div className="space-y-2">
                <h2 className="text-3xl font-bold text-white">
                  Join Room
                </h2>
                <p className="text-gray-400">
                  Enter a room code to jump into an existing session
                </p>
              </div>

              {/* Input and button */}
              <div className="w-full space-y-4">
                <div className="relative">
                  <Input
                    placeholder="XXXXXXXX"
                    value={inputCode}
                    onChange={(e) => {
                      setInputCode(e.target.value);
                      setError("");
                    }}
                    maxLength={8}
                    className="bg-white/5 border-white/20 text-white placeholder:text-gray-600 text-center text-xl tracking-[0.5em] font-mono py-7 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 rounded-2xl transition-all"
                  />
                  {inputCode.length === 8 && (
                    <div className="absolute right-4 top-1/2 -translate-y-1/2">
                      <Check className="w-5 h-5 text-green-400" />
                    </div>
                  )}
                </div>

                {error && (
                  <div className="flex items-center justify-center gap-2 p-3 rounded-xl bg-red-500/10 border border-red-500/20">
                    <div className="w-3 h-3 bg-red-400 rounded-full animate-pulse" />
                    <p className="text-sm text-red-400">{error}</p>
                  </div>
                )}

                <Button
                  onClick={joinRoom}
                  disabled={isJoining || inputCode.length !== 8}
                  className="w-full bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white font-semibold py-6 rounded-2xl transition-all hover:scale-105 hover:shadow-2xl hover:shadow-blue-500/50 disabled:opacity-50 disabled:hover:scale-100 disabled:cursor-not-allowed border-0"
                >
                  {isJoining ? (
                    <span className="flex items-center gap-2">
                      <Sparkles className="w-5 h-5 animate-spin" />
                      Joining room...
                    </span>
                  ) : (
                    <span className="flex items-center gap-2">
                      <LogIn className="w-5 h-5" />
                      Join Room
                    </span>
                  )}
                </Button>

                {/* Subtle info */}
                <p className="text-xs text-gray-500">
                  8-character code from your friend
                </p>
              </div>
            </div>
          </Card>
        </div>

        {/* Bottom tip with better styling */}
        <div className="flex items-center justify-center gap-3 p-6 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm max-w-2xl mx-auto">
          <div className=" w-10 h-10 rounded-full bg-gradient-to-br from-purple-500/20 to-blue-500/20 flex items-center justify-center">
            <Sparkles className="w-5 h-5 text-purple-400" />
          </div>
          <div className="text-left">
            <p className="text-sm font-medium text-white">Useless tip</p>
            <p className="text-sm text-gray-400">Share your room code with friends to listen together in perfect sync</p>
          </div>
        </div>
      </div>
    </div>
  );
}