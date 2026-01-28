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
import { Plus, Search, Loader2, Info } from "lucide-react";
import PlayerComponent from "./PlayerComponent";
import QueueComponent from "./QueueComponent";
import RoomLayout from "./RoomLayout";
import socket from "./socketClinet";
import { toast } from "sonner";

interface ViewerProps {
  roomCode: string;
}

export default function Viewer({ roomCode }: ViewerProps) {
  // Playback state
  const [videoId, setVideoId] = useState<string | null>(null);
  const [startedAt, setStartedAt] = useState<Date | null>(null);
  const [isPaused, setIsPaused] = useState(false);
  const [currentSongId, setCurrentSongId] = useState<string | null>(null);

  // Queue state
  const [queue, setQueue] = useState<any[]>([]);

  // Add song modal state
  const [isAddSongOpen, setIsAddSongOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [isVoting, setIsVoting] = useState(false);

  // Socket setup
  useEffect(() => {
socket.on("fetchPlayback",fetchPlayback);
socket.on("fetchQueue",fetchQueue);

return () => {
socket.off("fetchPlayback");
socket.off("fetchQueue");
}
  }, []);

  // Fetch playback state
  const fetchPlayback = async () => {
    try {
      const res = await fetch(`/api/rooms/${roomCode}/playback`);
      const data = await res.json();

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

  // Fetch queue
  const fetchQueue = async () => {
    try {
      const res = await fetch(`/api/songs/queue?roomCode=${roomCode}`);
      const data = await res.json();

      if (res.ok) {
        setQueue(data.data);
      }
    } catch (err) {
      console.error("Failed to fetch queue:", err);
    }
  };

  // Initial fetch
  useEffect(() => {
    fetchPlayback();
    fetchQueue();
  }, []);

  // Search songs
  const searchSongs = async () => {
    if (!searchQuery.trim()) return;

    setIsSearching(true);
    try {
      const res = await fetch(
        `/api/youtube?q=${encodeURIComponent(searchQuery)}`
      );
      const data = await res.json();

      if (res.ok) {
        setSearchResults(data.data.items || []);
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
          socket.emit("playbackUpdated", roomCode);
        }
        socket.emit("queueUpdated", roomCode)
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
        socket.emit("queueUpdated", roomCode);
      } else {
        const data = await res.json();
        toast.error(data.message || "Failed to vote");
      }
    } catch (err) {
      toast.error("Failed to vote");
    } finally {
      setIsVoting(false);
    }
  };

  return (
    <RoomLayout roomCode={roomCode}>
      <div className="space-y-6">
        {/* Player */}
       
  <PlayerComponent
    videoId={videoId}
    startedAt={startedAt}
    isPaused={isPaused}
  />

        {/* Info banner - only host can control playback */}
        <Card className="bg-blue-500/10 border-blue-500/30 p-4">
          <div className="flex items-start gap-3">
            <Info className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-blue-400 font-medium">Viewer Mode</p>
              <p className="text-sm text-blue-300/70">
                Only the host can control playback. You can add songs and vote to influence the queue order.
              </p>
            </div>
          </div>
        </Card>

        {/* Add Song Button */}
        <div className="flex justify-center">
          <Dialog open={isAddSongOpen} onOpenChange={setIsAddSongOpen}>
            <DialogTrigger asChild>
              <Button
                size="lg"
                className="bg-gradient-to-r from-teal-500 to-cyan-500 hover:from-teal-600 hover:to-cyan-600 text-black font-semibold px-12 shadow-lg shadow-teal-500/30"
              >
                <Plus className="w-5 h-5 mr-2" />
                Add a Song
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
                  className="bg-white/5 border-white/10 text-white"
                />
                <Button
                  onClick={searchSongs}
                  disabled={isSearching}
                  className="bg-cyan-500 hover:bg-cyan-600 text-black"
                >
                  {isSearching ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    <Search className="w-5 h-5" />
                  )}
                </Button>
              </div>

              {/* Search results */}
              <div className="flex-1 overflow-y-auto space-y-3 mt-4">
                {searchResults.length === 0 && searchQuery && !isSearching && (
                  <div className="text-center py-12 text-gray-500">
                    No results found
                  </div>
                )}

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
                      <Plus className="w-4 h-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </DialogContent>
          </Dialog>
        </div>

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