import React from 'react'
import { InteractiveHoneycomb } from './InteractiveHoneycomb'

interface LandingHeroProps {
  onEnterDashboard: () => void
}

export const LandingHero: React.FC<LandingHeroProps> = ({ onEnterDashboard }) => {
  return (
    // Changed from a Fragment (<>) to a relative container wrapping the hero area context
    <div className="w-full min-h-screen flex flex-col items-center justify-center relative px-6 overflow-hidden">

      {/* 🐝 THE INTERACTIVE HONEYCOMB BACKGROUND LAYER */}
      {/* Absolute positioning covers the whole screen behind text elements */}
      <div className="absolute inset-0 z-0 w-full h-full">
        <InteractiveHoneycomb />
      </div>

      {/* Hero Headline Content */}
      <div className="text-center max-w-3xl space-y-6 relative z-30 pt-16 pointer-events-auto">

        {/* Headline */}
        <h1 className="text-5xl md:text-6xl font-display font-extrabold tracking-tight text-white leading-[1.08] select-none">
          Organize your warehouse <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-green-300">
            in space.
          </span>
        </h1>

        {/* Subheading */}
        <p className="text-base md:text-lg text-zinc-400 max-w-xl mx-auto leading-relaxed font-normal">
          Every physical storage shelf, data block, and transfer log. Mapped geometrically in real-time.
        </p>

        {/* Start CTA Button */}
        <div className="pt-2">
          <button
            onClick={onEnterDashboard}
            className="bg-emerald-500 hover:bg-emerald-400 text-black rounded-full px-8 py-4 font-extrabold text-sm shadow-lg shadow-emerald-500/25 hover:shadow-emerald-500/50 transition-all inline-flex items-center gap-2.5 cursor-pointer relative group border-none pointer-events-auto active:scale-95"
          >
            {/* White indicator dot */}
            <span className="w-2 h-2 bg-black rounded-full animate-pulse" />
            <span>Launch Soko Console</span>
          </button>
        </div>

      </div>
    </div>
  )
}