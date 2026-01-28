import { Card } from "@/components/ui/card";
import { Music2 } from "lucide-react";

export function RoomLoadingSkeleton() {
  return (
    <div className="min-h-screen bg-black">
      {/* Header skeleton */}
      <header className="border-b border-white/10 bg-black/50 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 sm:py-4">
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <div className="w-5 h-5 sm:w-6 sm:h-6 bg-cyan-400/20 rounded animate-pulse" />
              <div className="w-24 h-6 bg-white/10 rounded animate-pulse" />
            </div>
            <div className="flex items-center gap-2">
              <div className="w-32 h-8 bg-white/10 rounded-lg animate-pulse" />
              <div className="w-20 h-8 bg-white/10 rounded animate-pulse" />
            </div>
          </div>
        </div>
      </header>

      {/* Main content skeleton */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
        <div className="space-y-6">
          {/* Video player skeleton */}
          <Card className="overflow-hidden border-white/10 bg-gradient-to-br from-gray-900 to-black">
            <div className="aspect-video bg-gradient-to-br from-gray-800 to-gray-900 flex items-center justify-center relative overflow-hidden">
              {/* Animated shimmer effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent animate-shimmer" />
              <Music2 className="w-20 h-20 text-gray-700 animate-pulse" />
            </div>
          </Card>

          {/* Controls skeleton */}
          <Card className="bg-gradient-to-br from-gray-900 to-black border-white/10 p-6">
            <div className="flex gap-4 justify-center">
              <div className="w-32 h-12 bg-white/10 rounded-xl animate-pulse" />
              <div className="w-32 h-12 bg-white/10 rounded-xl animate-pulse delay-75" />
              <div className="w-32 h-12 bg-white/10 rounded-xl animate-pulse delay-150" />
            </div>
          </Card>

          {/* Queue skeleton */}
          <Card className="bg-gradient-to-br from-gray-900 to-black border-white/10 overflow-hidden">
            <div className="px-6 py-4 border-b border-white/10 bg-white/5">
              <div className="w-32 h-6 bg-white/10 rounded animate-pulse" />
            </div>
            <div className="p-4 space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex items-center gap-4">
                  <div className="w-8 h-8 bg-white/10 rounded animate-pulse" />
                  <div className="w-20 h-14 bg-white/10 rounded-lg animate-pulse" />
                  <div className="flex-1 space-y-2">
                    <div className="w-3/4 h-4 bg-white/10 rounded animate-pulse" />
                    <div className="w-1/2 h-3 bg-white/10 rounded animate-pulse" />
                  </div>
                  <div className="w-16 h-9 bg-white/10 rounded animate-pulse" />
                </div>
              ))}
            </div>
          </Card>
        </div>
      </main>
    </div>
  );
}

export function DashboardLoadingSkeleton() {
  return (
    <div className="min-h-screen bg-black relative overflow-hidden">
      {/* Background orbs */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl animate-pulse" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl animate-pulse delay-700" />

      {/* Header */}
      <header className="relative z-10 border-b border-white/10 bg-black/50 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white/10 rounded-xl animate-pulse" />
            <div className="w-32 h-6 bg-white/10 rounded animate-pulse" />
          </div>
          <div className="w-10 h-10 bg-white/10 rounded-full animate-pulse" />
        </div>
      </header>

      {/* Main content */}
      <div className="relative z-10 max-w-6xl mx-auto px-6 py-16">
        {/* Title skeleton */}
        <div className="text-center mb-16 space-y-4">
          <div className="w-48 h-12 bg-white/10 rounded-full mx-auto animate-pulse" />
          <div className="w-96 h-16 bg-gradient-to-r from-purple-500/20 to-blue-500/20 rounded-2xl mx-auto animate-pulse" />
          <div className="w-80 h-6 bg-white/10 rounded mx-auto animate-pulse" />
        </div>

        {/* Cards skeleton */}
        <div className="grid md:grid-cols-2 gap-8 mb-12">
          {[1, 2].map((i) => (
            <Card
              key={i}
              className="bg-gradient-to-br from-purple-950/40 to-black border-purple-500/20 p-8"
            >
              <div className="flex flex-col items-center space-y-6">
                <div className="w-24 h-24 bg-white/10 rounded-3xl animate-pulse" />
                <div className="space-y-2 w-full">
                  <div className="w-48 h-8 bg-white/10 rounded mx-auto animate-pulse" />
                  <div className="w-64 h-4 bg-white/10 rounded mx-auto animate-pulse" />
                </div>
                <div className="w-full h-14 bg-white/10 rounded-2xl animate-pulse" />
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
