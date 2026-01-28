"use client";

import { useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";
import { Card } from "@/components/ui/card";
import { Music, Pause, Volume2, VolumeX } from "lucide-react";
import { Button } from "@/components/ui/button";

// what is this and why this , why it is need cant we remove it ??
const YouTube = dynamic(() => import("react-youtube"), {
  ssr: false,
  loading: () => (
    <div className="aspect-video bg-black flex items-center justify-center">
      <div className="text-gray-500">Loading player...</div>
    </div>
  ),
});

import type { YouTubeProps, YouTubePlayer } from "react-youtube";
import { toast } from "sonner";

interface PlayerProps {
  videoId: string | null;
  startedAt: Date | null;
  isPaused: boolean;
  onEnded?: () => void;
}

export default function PlayerComponent({
  videoId,
  startedAt,
  isPaused,
  onEnded,
}: PlayerProps) {
  
  const playerRef = useRef<YouTubePlayer | null>(null);
  const [isReady, setIsReady] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const [showUnmuteHint, setShowUnmuteHint] = useState(true);

  const getStartSeconds = () => {
    if (!startedAt) return 0;
    const elapsed = Math.floor((Date.now() - new Date(startedAt).getTime()) / 1000);
    return Math.max(0, elapsed);
  };

  const onPlayerReady: YouTubeProps["onReady"] = (event) => {
    playerRef.current = event.target;
    
    const start = getStartSeconds();
    event.target.seekTo(start, true);

    // Start muted for autoplay to work
    event.target.mute();

    if (isPaused) {
      event.target.pauseVideo();
    } else {
      event.target.playVideo();
    }

    setIsReady(true);
  };

  // Handle pause/play changes - FIXED: Now properly syncs with isPaused prop
  useEffect(() => {
    if (!isReady || !playerRef.current) return;

    const timer = setTimeout(() => {
      if (!playerRef.current) return;
     
      if (isPaused) {
        playerRef.current.pauseVideo();
      } else {
        playerRef.current.playVideo();
      }
    }, 100);

    return () => clearTimeout(timer);
  }, [isPaused, isReady]);

  useEffect(() => {
// only run when player is ready and song is playing
  if(!isReady || !playerRef.current || isPaused || !startedAt ) return;

  // check every 30 sec
  const syncInterval = setInterval(() => {
     if (!playerRef.current || !startedAt) return;

     // where player should be currently
     const expectedTime = getStartSeconds();

     // where player actually is 
     const actualTime = playerRef.current.getCurrentTime();
    const drift = Math.abs(expectedTime - actualTime);
    console.log(`Expected: ${expectedTime}s, Actual: ${actualTime}s, Drift: ${drift}s`);

    if (drift > 1) {
      console.log("⚡ Re-syncing player...");
      playerRef.current.seekTo(expectedTime, true);
      toast.info("Playback synced");
    }
    },30000)

      return () => clearInterval(syncInterval);

  }, [isReady, startedAt, isPaused])
 
  // Handle mute/unmute
  const toggleMute = () => {
    if (!playerRef.current) return;
    
    if (isMuted) {
      playerRef.current.unMute();
      setIsMuted(false);
      setShowUnmuteHint(false);
    } else {
      playerRef.current.mute();
      setIsMuted(true);
    }
  };

  const opts: YouTubeProps["opts"] = {
    height: "100%",
    width: "100%",
    playerVars: {
      autoplay: 1,
      controls: 0,
      disablekb: 1,
      modestbranding: 1,
      rel: 0,
      fs: 0,
      iv_load_policy: 3,
    },
  };

  if (!videoId) {
    return (
      <Card className="aspect-video bg-gradient-to-br from-gray-900 to-black border-white/10 flex flex-col items-center justify-center">
        <Music className="w-20 h-20 text-gray-700 mb-4" />
        <p className="text-gray-500 text-lg">No song playing</p>
        <p className="text-gray-600 text-sm">Add a song to start the party</p>
      </Card>
    );
  }

  return (
    <Card className="overflow-hidden border-cyan-500/20 shadow-xl shadow-cyan-500/10">
      <div className="aspect-video bg-black relative">
        <YouTube
          videoId={videoId}
          opts={opts}
          onReady={onPlayerReady}
          onEnd={onEnded}
          className="absolute inset-0 w-full h-full"
        />

        {/* Mute/Unmute button - always visible when playing */}
        {isReady && !isPaused && (
          <Button
            onClick={toggleMute}
            size="sm"
            variant="ghost"
            className="absolute top-4 right-4 bg-black/50 hover:bg-black/70 text-white backdrop-blur-sm z-10"
            title={isMuted ? "Unmute" : "Mute"}
          >
            {isMuted ? (
              <VolumeX className="w-5 h-5" />
            ) : (
              <Volume2 className="w-5 h-5" />
            )}
          </Button>
        )}

        {/* Paused overlay */}
        {isPaused && (
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-10">
            <div className="w-20 h-20 rounded-full bg-white/10 border-2 border-white/30 flex items-center justify-center">
              <Pause className="w-10 h-10 text-white" />
            </div>
          </div>
        )}

        {/* Muted indicator - shows when muted and playing */}
        {isMuted && isReady && !isPaused && showUnmuteHint && (
          <div 
            className="absolute bottom-4 left-4 px-3 py-1.5 bg-black/50 backdrop-blur-sm rounded-full border border-white/20 z-10 cursor-pointer hover:bg-black/70 transition-colors"
            onClick={toggleMute}
          >
            <div className="flex items-center gap-2">
              <VolumeX className="w-4 h-4 text-red-400" />
              <span className="text-xs text-white">Muted - Click to unmute</span>
            </div>
          </div>
        )}
      </div>
    </Card>
  );
}