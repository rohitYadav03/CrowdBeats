"use client";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { ArrowUp, Music2, Crown, CheckCircle } from "lucide-react";
import { useSession } from "@/lib/auth-client";

interface Song {
  id: string;
  title: string;
  thumbnail: string;
  videoId: string;
  vote: Array<{ id: string; userId: string }>;
}

interface QueueProps {
  songs: Song[];
  currentSongId: string | null;
  onVote: (songId: string) => void;
  isVoting: boolean;
}

export default function QueueComponent({
  songs,
  currentSongId,
  onVote,
  isVoting,
}: QueueProps) {

  const { data: session } = useSession();
  const currentUserId = session?.user?.id;

  // Empty Queue Case
  if (songs.length === 0) {
    return (
      <Card className="bg-gradient-to-br from-gray-900 to-black border-white/10 p-8 sm:p-12">
        <div className="text-center">
          <Music2 className="w-12 h-12 sm:w-16 sm:h-16 text-gray-700 mx-auto mb-3 sm:mb-4" />
          <h3 className="text-xl sm:text-2xl font-semibold text-gray-400 mb-1 sm:mb-2">
            Queue is empty
          </h3>
          <p className="text-sm sm:text-base text-gray-600">Add songs to get started</p>
        </div>
      </Card>
    );
  }

  return (
    <Card className="bg-gradient-to-br  from-gray-900 to-black border-white/10 overflow-hidden">
      {/* Header */}
      <div className="px-3 sm:px-6 py-3 sm:py-4 border-b border-white/10 bg-white/5">
        <h2 className="text-sm sm:text-lg font-semibold text-white flex items-center gap-2">
          <Music2 className="w-4 h-4 sm:w-5 sm:h-5 text-cyan-400" />
          Queue ({songs.length})
        </h2>
      </div>

      {/* Song list */}
      <ScrollArea className="h-[400px] sm:h-[500px]">
       
       <div className="divide-y divide-white/5">
          {songs.map((song, index) => { // har song ke liye ui

            const isCurrentlyPlaying = song.id === currentSongId; // to highlist and crown and diable button
            const voteCount = song.vote.length;
            const hasUserVoted = currentUserId 
              ? song.vote.some(vote => vote.userId === currentUserId)
              : false;

            return (
              <div
                key={song.id}
                className={`p-2 sm:p-4 hover:bg-white/5 transition-colors ${
                  isCurrentlyPlaying ? "bg-cyan-500/15" : ""
                }`}
              >
        
                <div className="flex items-center gap-1.5 sm:gap-4 ">
                  
                  <div className="flex-shrink-0  w-4 sm:w-8 flex items-center justify-center">
                  
                    {isCurrentlyPlaying ? (
                      <Crown className="w-3 h-3 sm:w-5 sm:h-5 text-cyan-400" />
                    ) : (
                      <span className="text-gray-500 font-semibold text-[10px] sm:text-base">
                        {index + 1}
                      </span>
                    )}
                  </div>

                  {/* 2. Thumbnail - Fixed size becuse of flex-shrink-0, never shrinks */}
                  <div className="flex-shrink-0 relative">
                    <img
                      src={song.thumbnail}
                      alt={song.title}
                      className="w-12 h-9 sm:w-20 sm:h-14 object-cover rounded"
                    />
                    {isCurrentlyPlaying && (
                      <div className="absolute inset-0 bg-cyan-500/20 rounded flex items-center justify-center">
                        <div className="w-2 h-2 sm:w-3 sm:h-3 rounded-full animate-bounce bg-cyan-400" />
                      </div>
                    )}
                  </div>

                  {/* 3. Song Title - Grows to fill available space flex-1, truncates when needed */}
                  <div className="flex-1 min-w-0 overflow-hidden pr-1">
                    <h3
                      className={`font-medium truncate text-[4px] sm:text-base leading-tight ${
                        isCurrentlyPlaying ? "text-cyan-400" : "text-white"
                      }`}
                      title={song.title}
                    >
                      {song.title}
                    </h3>
                    
                    {/* Badges - Only show on small screens if there's something to show */}
                    {(isCurrentlyPlaying || hasUserVoted) && (
                      <div className="flex items-center gap-1 mt-0.5 sm:mt-1">
                        {isCurrentlyPlaying && (
                          <Badge
                            variant="outline"
                            className="text-[8px] sm:text-xs border-cyan-500/50 text-cyan-400 px-1 py-0 h-3.5 sm:h-auto leading-tight"
                          >
                            Playing
                          </Badge>
                        )}
                        {hasUserVoted && !isCurrentlyPlaying && (
                          <Badge
                            variant="outline"
                            className="text-[8px] sm:text-xs border-green-500/50 text-green-400 flex items-center gap-0.5 px-1 py-0 h-3.5 sm:h-auto leading-tight"
                          >
                            <CheckCircle className="w-2 h-2 sm:w-3 sm:h-3" />
                            <span className="hidden xs:inline">Voted</span>
                          </Badge>
                        )}
                      </div>
                    )}
                  </div>

                  {/* 4. Vote Section - Fixed width, never shrinks, always visible */}
                  <div className="flex-shrink-0 flex items-center gap-1 sm:gap-2">
                    
                    {/* Vote Count Display */}
                    <div className="text-right min-w-[26px] sm:min-w-[44px]">
                      
                      <div className={`text-sm sm:text-2xl font-bold leading-none ${
                        hasUserVoted ? "text-green-400" : "text-cyan-400"
                      }`}>
                        {voteCount}
                      </div>

                      <div className="text-[8px] sm:text-xs   text-gray-500 leading-tight mt-0.5 hidden sm:block ">
                        {voteCount === 1 ? "vote" : "votes"}
                      </div>
                      
                    </div>

                    {/* Vote Button */}
                    <Button
                      onClick={() => onVote(song.id)}
                      disabled={isVoting || isCurrentlyPlaying || hasUserVoted}
                      size="sm"
                      variant="outline"
                      className={`h-7 w-7 sm:h-10 sm:w-10 p-0 transition-all flex-shrink-0 ${
                        hasUserVoted
                          ? "border-green-500/50 text-green-400 bg-green-500/10 cursor-default"
                          : "border-cyan-500/50 text-cyan-400 hover:bg-cyan-500/20 hover:border-cyan-400 active:scale-95 cursor-pointer"
                      } disabled:opacity-50 disabled:cursor-not-allowed`}
                      aria-label={
                        isCurrentlyPlaying
                          ? "Cannot vote for currently playing song"
                          : hasUserVoted
                          ? "You've already voted for this song"
                          : "Vote for this song"
                      }
                    >
                      {hasUserVoted ? (
                        <CheckCircle className="w-3.5 h-3.5 sm:w-5 sm:h-5" />
                      ) : (
                        <ArrowUp className="w-3.5 h-3.5 sm:w-5 sm:h-5" />
                      )}
                    </Button>
                
                  </div>

                </div>

              </div>
            );
          })}
        </div>


      </ScrollArea>
    </Card>
  );
}