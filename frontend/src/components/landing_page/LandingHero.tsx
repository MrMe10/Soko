import React from 'react'
import { Activity } from 'lucide-react'

interface LandingHeroProps {
  onEnterDashboard: () => void
}

export const LandingHero: React.FC<LandingHeroProps> = ({ onEnterDashboard }) => {
  return (
    // Changed from a Fragment (<>) to a relative container wrapping the hero area context
    <div className="w-full min-h-[70vh] flex flex-col items-center justify-center relative px-6 overflow-hidden">
      
      {/* 🐝 THE HONEYCOMB BACKGROUND LAYER */}
      {/* Absolute positioning pushes it behind text elements, while the radial mask concentrates the texture around the content headings */}
      <div className="absolute inset-0 bg-beehive [mask-image:radial-gradient(ellipse_60%_60%_at_50%_50%,#000_50%,transparent_100%)] pointer-events-none z-0" />

      {/* Floating Items Container (Absolute Positioning around the hero) */}
      <div className="absolute inset-0 max-w-7xl mx-auto pointer-events-none z-20">
        
        {/* Floating Element 1: 3D Camera / Scanner Node (Top Left) */}
        <div className="absolute left-[8%] top-[12%] animate-float hidden lg:block bg-white p-4 rounded-2xl shadow-xl shadow-slate-200/50 border border-slate-100 w-32 flex flex-col items-center gap-2">
          <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center border border-slate-200">
            <svg className="w-6 h-6 text-slate-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" />
              <circle cx="12" cy="13" r="4" />
            </svg>
          </div>
          <span className="text-[10px] font-mono font-bold text-slate-500">SCANNER A9</span>
        </div>

        {/* Floating Element 2: Small Grid Shelf Block (Left Center) */}
        <div className="absolute left-[6%] top-[45%] animate-float-delayed hidden lg:block bg-white p-3 rounded-2xl shadow-lg shadow-slate-200/60 border border-slate-100 w-24 text-center">
          <div className="text-2xl font-bold font-mono text-slate-800">28</div>
          <div className="text-[8px] font-mono text-slate-400 mt-1 uppercase">Shelves Free</div>
        </div>

        {/* Floating Element 3: Active Status Pager Tag (Right Top) */}
        <div className="absolute right-[8%] top-[15%] animate-float hidden lg:block bg-white p-4 rounded-2xl shadow-xl shadow-slate-200/50 border border-slate-100 w-32 flex flex-col items-center gap-2">
          <div className="w-12 h-12 bg-slate-50 rounded-xl flex items-center justify-center border border-slate-200">
            <Activity className="w-6 h-6 text-indigo-500 animate-pulse" />
          </div>
          <span className="text-[9px] font-mono text-emerald-600 font-bold bg-emerald-50 border border-emerald-100 px-2 py-0.5 rounded-full">
            ONLINE
          </span>
        </div>

        {/* Floating Element 4: Digital Audit Bubble (Right Center) */}
        <div className="absolute right-[5%] top-[48%] animate-float-delayed hidden lg:block bg-white p-4 rounded-2xl shadow-xl shadow-slate-200/60 border border-slate-100 w-40 space-y-1.5">
          <div className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 bg-indigo-500 rounded-full" />
            <span className="text-[9px] font-mono font-bold text-slate-400 uppercase">AUDIT EVENT</span>
          </div>
          <p className="text-[10px] font-bold text-slate-800 leading-tight">GPU Shard registered at shelf A-04-F</p>
        </div>

      </div>

      {/* Hero Headline Content */}
      <div className="text-center max-w-3xl space-y-6 relative z-30 pt-10">
        
        {/* New Tag Pill */}
        <div className="inline-flex items-center gap-2 bg-yellow-100/70 border border-yellow-200 rounded-full px-3.5 py-1 text-[11px] font-semibold text-slate-800 shadow-xs">
          <span className="bg-yellow-400 text-yellow-950 px-1.5 py-0.5 rounded-full text-[9px] font-bold uppercase">New</span>
          <span className="text-slate-700">Introducing warehouse core OS v1.4</span>
        </div>

        {/* Headline */}
        <h1 className="text-5xl md:text-6xl font-display font-extrabold tracking-tight text-slate-900 leading-[1.08] select-none">
          Organize your warehouse <br />
          in <span className="bg-yellow-100 px-3.5 py-0.5 rounded-2xl border border-yellow-300 shadow-xs relative inline-block text-slate-950 font-bold">space.</span>
        </h1>

        {/* Subheading */}
        <p className="text-base md:text-lg text-slate-600 max-w-xl mx-auto leading-relaxed">
          Every physical storage shelf, data block, and transfer log. Mapped geometrically in real-time.
        </p>

        {/* Start CTA Button */}
        <div className="pt-2">
          <button
            onClick={onEnterDashboard}
            className="bg-black hover:bg-slate-800 text-white rounded-full px-8 py-4 font-semibold text-sm shadow-md hover:shadow-xl transition-all inline-flex items-center gap-2.5 cursor-pointer relative group border-none"
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