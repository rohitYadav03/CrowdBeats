"use client";

import { useState } from "react";
import { Copy, Check, Users, Music, Volume2 } from "lucide-react"; // 🔥 NEW: Added Volume2
import { Button } from "@/components/ui/button";

export default function RoomLayout({ 
  roomCode, 
  children,
}: {
  roomCode: string;
  children: React.ReactNode;
}) {
  const [copied, setCopied] = useState(false);

  const copyRoomCode = () => {
    navigator.clipboard.writeText(roomCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-black">
      {/* Header */}
      <header className="border-b border-white/10 bg-black/50 backdrop-blur-xl sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 sm:py-4">
          <div className="flex items-center justify-between gap-2">
            {/* Logo */}
            <div className="flex items-center gap-2">
              <Music className="w-5 h-5 sm:w-6 sm:h-6 text-cyan-400" />
              <span className="text-lg sm:text-xl font-bold text-white">Crowdbeat</span>
              
            </div>
            {/* 🔥 NEW: Sound hint badge */}
              <div className="hidden sm:flex items-center gap-1 px-2 py-0.5 rounded-full bg-cyan-500/10 border border-cyan-500/20">
                <Volume2 className="w-3 h-3 text-cyan-400" />
                <span className="text-[10px] text-cyan-400/80">Click unmute for sound, If not coming</span>
              </div>

            {/* Room Code */}
            <div className="flex items-center gap-2 sm:gap-3">
              <div className="flex items-center gap-1 sm:gap-2 px-2 sm:px-4 py-1.5 sm:py-2 rounded-lg bg-white/5 border border-white/10">
                <Users className="w-3 h-3 sm:w-4 sm:h-4 text-gray-400" />
                <span className="text-xs sm:text-sm text-gray-400 hidden sm:inline">Room:</span>
                <span className="font-mono text-cyan-400 font-semibold tracking-wide text-xs sm:text-sm">
                  {roomCode}
                </span>
              </div>

              <Button
                onClick={copyRoomCode}
                size="sm"
                variant="ghost"
                className="text-gray-400 hover:text-cyan-400 hover:bg-cyan-500/20 h-8 sm:h-10 px-2 sm:px-4"
              >
                {copied ? (
                  <>
                    <Check className="w-3 h-3 sm:w-4 sm:h-4 sm:mr-1 text-green-400" />
                    <span className="hidden sm:inline">Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3 h-3 sm:w-4 sm:h-4 sm:mr-1" />
                    <span className="hidden sm:inline">Copy</span>
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
        {children}
      </main>
    </div>
  );
}