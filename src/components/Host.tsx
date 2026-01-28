"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Play, Pause, SkipForward, Plus, Search, Loader2 } from "lucide-react";
import PlayerComponent from "./PlayerComponent"; // to show the playing video
import QueueComponent from "./QueueComponent"; // show the queue
import RoomLayout from "./RoomLayout"; // Wrapper we built
import socket from "./socketClinet"; // this only we will use in the client which is form the 
// socket.io-clinet package from sending or listing from bakcend in the forntnt 
import { toast } from "sonner";
interface HostProps {
  roomCode: string;
}

// let understd this compoent also in depth -> taking roomCode as a prop form the parent 
export default function Host({ roomCode }: HostProps) {
  
  // Playback state -> for the video which is currently playing in the room
  const [videoId, setVideoId] = useState<string | null>(null); // which Youtube video is playing
  const [startedAt, setStartedAt] = useState<Date | null>(null);
  const [isPaused, setIsPaused] = useState(false);
  const [currentSongId, setCurrentSongId] = useState<string | null>(null);// I think this is the 

  // Queue state -> all the song in the room
  const [queue, setQueue] = useState<any[]>([]);// all the song in the room -> queue 

  // Add song modal state
  const [isAddSongOpen, setIsAddSongOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState(""); // user search input
  const [searchResults, setSearchResults] = useState<any[]>([]); // youtube search result
  const [isSearching, setIsSearching] = useState(false);

  // Action loading states
  const [isPausing, setIsPausing] = useState(false);
  const [isSkipping, setIsSkipping] = useState(false);
  const [isVoting, setIsVoting] = useState(false);


  // Fetch playback state
  const fetchPlayback = async () => {
    try {
      const res = await fetch(`/api/rooms/${roomCode}/playback`);
      const data = await res.json();
console.log("playback api from host : ", data);

      if (res.ok) {
        setVideoId(data.data.videoId);
        setStartedAt(new Date(data.data.startedAt));
        setIsPaused(data.data.isPaused);
        setCurrentSongId(data.data.currentSongId);
      }
    } catch (err) {
      console.error("Failed to fetch playback:", err);
    }
  };

  // Fetch queue -> getting all the song 
  const fetchQueue = async () => {
    console.log("function called ");
    
    try {
      const res = await fetch(`/api/songs/queue?roomCode=${roomCode}`);
      const data = await res.json();
console.log("data from fetching queue from host : ",data);

      if (res.ok) {
        setQueue(data.data);
      }
    } catch (err) {
      console.error("Failed to fetch queue:", err);
    }
  };

   // so here in th host component we have joined the room in the RoomPage only so 
// here it is for the sync 
  useEffect(() => {
socket.on("fetchPlayback",fetchPlayback);
socket.on("fetchQueue", fetchQueue)

return () => {
socket.off("fetchPlayback");
socket.off("fetchQueue");
}
  }, []);

  // Initial fetch -> it will be there , intailly will we not call the function using socket.io event or all 
  // we will fetch intailly just by calling function to make it realtime we will use the socket.io and all that 
  useEffect(() => {
    fetchPlayback();
    fetchQueue();
  }, []);

  // Host actions
  const handlePause = async () => {
    setIsPausing(true); // for showing in the ui 
    try {
      const res = await fetch(`/api/rooms/${roomCode}/pause`, {
        method: "POST",
      });

      if (res.ok) {
        socket.emit("playbackUpdated", roomCode);
        setIsPaused(true);
      }
    } catch (err) {
      console.log("error from pause : ",err);
      
      toast.error("Failed to pause");
    } finally {
      setIsPausing(false); 
    }
  };

  const handlePlay = async () => {
    setIsPausing(true);
    try {
      const res = await fetch(`/api/rooms/${roomCode}/play`, {
        method: "POST",
      });

      if (res.ok) {
        socket.emit("playbackUpdated", roomCode);
      }
    } catch (err) {
      toast.error("Failed to play");
    } finally {
      setIsPausing(false); 
    }
  };

  const handleSkip = async () => {
    setIsSkipping(true);
    try {
      const res = await fetch(`/api/rooms/${roomCode}/skip`, {
        method: "POST",
      });

      if (res.ok) {
        socket.emit("playbackUpdated", roomCode);
        socket.emit("queueUpdated", roomCode)
      }
    } catch (err) {
      toast.error("Failed to skip");
    } finally {
      setIsSkipping(false);
    }
  };

  const handleSongEnd = () => {
    // Auto-skip when song ends
    handleSkip();
  };

  // Search songs
  const searchSongs = async () => {
    if (!searchQuery.trim()) return;

    setIsSearching(true);
    try {
      const res = await fetch(
        `/api/youtube?q=${searchQuery}`
      );
      const data = await res.json();
      if (res.ok) {
        setSearchResults(data.data.items || []); // the result from the youtube api
      }
    } catch (err) {
      toast.error("Search failed");
    } finally {
      setIsSearching(false);
    }
  };

const addSong = async (song: any) => {
    try {
      const res = await fetch("/api/songs", {
        method: "POST",
        body: JSON.stringify({
          thumbnail: song.snippet.thumbnails.high.url,
          title: song.snippet.title,
          roomCode,
          videoId: song.id.videoId,
        }),
      });

      const data = await res.json();

      if (res.ok) {
        if (data.firstSong) {
          // await fetchPlayback(); -> here will not call the function insted 
          // we will fire the event from here to the backend , and backend will send to 
          // all the users in the room to refetch it ,. no manually
          socket.emit("playbackUpdated", roomCode);
        }
        // await fetchQueue(); -> same here , and if it is not the first song we should send diffenct 
        // event becuse we need to only fetch the queue and not playback

        // this will hapeen even after first song of updated so we are not retuing after playback event 
        // so this should be working fine  
        socket.emit("queueUpdated", roomCode)

        // Close modal and reset
        setIsAddSongOpen(false);
        setSearchQuery("");
        setSearchResults([]);
      }

    } catch (err) {
      toast.error("Failed to add song");
    }
  };

  const handleVote = async (songId: string) => {
    setIsVoting(true);
    try {
      const res = await fetch("/api/vote", {
        method: "POST",
        body: JSON.stringify({ songId, roomCode }),
      });

      if (res.ok) {
    socket.emit("queueUpdated", roomCode)
      }
    } catch (err) {
      toast.error("Failed to vote");
    } finally {
      setIsVoting(false);
    }
  };

  return (
    // sirf Header and wrapper -> show logo and copy button in the header and the main component
    <RoomLayout roomCode={roomCode} > 
      
      <div className="space-y-6">
        {/* Player */}
      
      {/* Youtbe Player Componet */}
  <PlayerComponent
    videoId={videoId}
    startedAt={startedAt}
    isPaused={isPaused}
    onEnded={handleSongEnd}
  />

        {/* Host Controls */}
        {/* my main question here is why Card and what is card ?? and  */}
 <Card className="bg-gradient-to-br from-gray-700 to-black border-white/30 p-6">
         
<div className="flex flex-wrap  gap-5 justify-center">
            {/* Play/Pause */}
            {isPaused ? ( // means video is pause then show the option for play  
              
              <Button
                onClick={handlePlay}
                disabled={isPausing || !videoId}
                size="lg"
                className="bg-cyan-500 hover:bg-cyan-600 text-black font-semibold px-8"
              >
                {isPausing ? (
                  <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                ) : (
                  <Play className="w-5 h-5 mr-2 fill-current" />
                )}
                Play
              </Button>
            ) : (
              <Button
                onClick={handlePause}
                disabled={isPausing || !videoId}
                size="lg"
                className="bg-orange-500 hover:bg-orange-600 text-white font-semibold px-8"
              >
                {isPausing ? (
                  <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                ) : (
                  <Pause className="w-5 h-5 mr-1" />
                )}
                Pause
              </Button>
            )}

            {/* Skip */}
            <Button
              onClick={handleSkip}
              disabled={isSkipping  || !currentSongId || queue.length < 2}
              size="lg"
              variant="outline"
              className="border-white/20 text-black hover:bg-white/50 px-8 cursor-pointer"
            >
              {isSkipping ? (
                <Loader2 className="w-5 h-5 mr-2 animate-spin" />
              ) : (
                <SkipForward className="w-5 h-5 mr-2" />
              )}
              Skip
            </Button>

            {/* Add Song */}
            {/* what are this shadcn compoent and why this ?? */}
            <Dialog open={isAddSongOpen} onOpenChange={setIsAddSongOpen}>
              <DialogTrigger asChild>
                <Button
                  size="lg"
                  variant="outline"
                  className="border-teal-500/50 text-black-400 hover:bg-teal-700/70 px-6 bg-teal-300 transition-transform"
                >
                  <Plus className="w-5 h-5 mr-2" />
                  Add Song
                </Button>
              </DialogTrigger>

              <DialogContent className="bg-gray-900 border-white/20 text-white max-w-2xl max-h-[80vh] overflow-hidden flex flex-col">
                <DialogHeader>
                  <DialogTitle className="text-2xl">Add a Song</DialogTitle>
                </DialogHeader>

                {/* Search input */}
                <div className="flex gap-2">
                  <Input
                    placeholder="Search for a song..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && searchSongs()}
                    className="bg-white/10 border-white/20 text-white"
                  />
                  <Button
                    onClick={searchSongs}
                    disabled={isSearching}
                    className="bg-cyan-500 hover:bg-cyan-600 text-black"
                  >
                    {isSearching ? (
                      <Loader2 className="w-5 h-5 animate-spin" />
                    ) : (
                      <Search className="h-5 w-5 " />
                    )}
                  </Button>
                </div>

                {/* Search results */}
                <div className="flex-1 overflow-y-auto space-y-3 mt-4">
                  {searchResults.map((song) => (
                    <div
                      key={song.id.videoId}
                      className="flex items-center gap-3 p-3 rounded-lg bg-white/5 hover:bg-white/10 transition-colors"
                    >
                      <img
                        src={song.snippet.thumbnails.high.url}
                        alt={song.snippet.title}
                        className="w-24 h-16 object-cover rounded"
                      />
                      <div className="flex-1 min-w-0">
                        <p className="font-medium truncate">{song.snippet.title}</p>
                        <p className="text-sm text-gray-400 truncate">
                          {song.snippet.channelTitle}
                        </p>
                      </div>
                      <Button
                        onClick={() => addSong(song)}
                        size="sm"
                        className="bg-teal-500 hover:bg-teal-600 text-black"
                      >
                        <Plus className="w-6 h-6" />
                      </Button>
                    </div>
                  ))}
                </div>
              </DialogContent>
            </Dialog>
</div>
             
</Card>

        {/* Queue */}
        <QueueComponent
          songs={queue}
          currentSongId={currentSongId}
          onVote={handleVote}
          isVoting={isVoting}
        />
        
      </div>


    </RoomLayout>
  );
}