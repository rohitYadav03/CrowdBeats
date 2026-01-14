import { Music, Radio, Users } from "lucide-react";
import SignInButton from "./signin";

export default function LandingPage() {
  return (
    <div className="relative min-h-screen overflow-hidden bg-black">
      {/* Animated gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br  from-purple-900/20 via-black to-blue-900/20" />
      
      {/* Animated orbs */}
      <div className="absolute top-20 left-20 w-72 h-72 bg-purple-500/30 rounded-full blur-3xl animate-pulse" />
      <div className="absolute bottom-20 right-20 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl animate-pulse delay-700" />

      {/* Content */}
      <div className="relative z-10 flex flex-col  items-center justify-center min-h-screen px-4">
        {/* Logo/Title */}
        <div className="flex items-center gap-3 mb-6">
          <Radio className="w-14 h-14 text-purple-400" />
          <h1 className="text-6xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-blue-400">
            Crowdbeat
          </h1>
        </div>

        {/* Subtitle */}
        <p className="text-xl text-gray-300 mb-12 text-center max-w-2xl">
          Listen together, vote together. Create synchronized music rooms where everyone controls the vibe.
        </p>

        {/* Features */}
        <div className="flex flex-wrap gap-6 mb-12 justify-center">
          <FeatureCard
            icon={<Music className="w-6 h-6" />}
            title="Synced Playback"
            description="Everyone hears the same beat"
          />
          <FeatureCard
            icon={<Users className="w-6 h-6" />}
            title="Democratic Queue"
            description="Vote for your favorite songs"
          />
          <FeatureCard
            icon={<Radio className="w-6 h-6" />}
            title="Real-time Rooms"
            description="Join instantly, no downloads"
          />
        </div>

        <SignInButton />

        {/* Footer note */}
        <p className="text-sm text-gray-500 mt-8">
          No need for Spotify Premium or Other Enjoy Free
        </p>
      </div>
    </div>
  );
}

function FeatureCard({ icon, title, description }: { icon: React.ReactNode; title: string; description: string }) {
  return (
    <div className="flex items-start gap-4 p-6 rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10 max-w-xs hover:bg-white/10 transition-colors">
      <div className="p-3 rounded-lg bg-purple-500/20 text-purple-400">
        {icon}
      </div>
      <div>
        <h3 className="font-semibold text-white mb-1">{title}</h3>
        <p className="text-sm text-gray-400">{description}</p>
      </div>
    </div>
  );
}