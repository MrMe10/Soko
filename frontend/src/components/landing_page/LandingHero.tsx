import React from 'react'
import { InteractiveHoneycomb } from './InteractiveHoneycomb'

interface LandingHeroProps {
  onEnterDashboard: () => void
}

export const LandingHero: React.FC<LandingHeroProps> = ({ onEnterDashboard }) => {
  return (
    // Changed from a Fragment (<>) to a relative container wrapping the hero area context
    <div className="w-full min-h-[70vh] flex flex-col items-center justify-center relative px-6 overflow-hidden">
      
      {/* 🐝 THE INTERACTIVE HONEYCOMB BACKGROUND LAYER */}
      {/* Absolute positioning pushes it behind text elements, while the radial mask concentrates the texture around the content headings */}
      <div className="absolute inset-0 z-0">
        <InteractiveHoneycomb />
      </div>

      {/* Hero Headline Content */}
      <div className="text-center max-w-3xl space-y-6 relative z-30 pt-10 pointer-events-none">

        {/* Headline */}
        <h1 className="text-5xl md:text-6xl font-display font-extrabold tracking-tight text-slate-900 leading-[1.08] select-none">
          Organize your warehouse <br />
          in space.
        </h1>

        {/* Subheading */}
        <p className="text-base md:text-lg text-slate-600 max-w-xl mx-auto leading-relaxed">
          Every physical storage shelf, data block, and transfer log. Mapped geometrically in real-time.
        </p>

        {/* Start CTA Button */}
        <div className="pt-2">
          <button
            onClick={onEnterDashboard}
            className="bg-black hover:bg-slate-800 text-white rounded-full px-8 py-4 font-semibold text-sm shadow-md hover:shadow-xl transition-all inline-flex items-center gap-2.5 cursor-pointer relative group border-none pointer-events-auto"
          >
            {/* Green indicator dot */}
            <span className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
            <span>Launch Soko Console</span>
          </button>
        </div>

      </div>
    </div>
  )
}