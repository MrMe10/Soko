import React from 'react'
import { ArrowRight, LogIn } from 'lucide-react'

interface LandingHeaderProps {
  onEnterDashboard: () => void
}

export const LandingHeader: React.FC<LandingHeaderProps> = ({ onEnterDashboard }) => {
  return (
    <header className="h-20 w-full flex items-center justify-between px-8 md:px-16 border-b border-slate-100 bg-white/70 backdrop-blur-md sticky top-0 z-50">
      <div className="flex items-center gap-3">
        <div className="relative w-9 h-9 flex items-center justify-center bg-black rounded-xl shadow-md">
          {/* Custom Isometric Box / Warehouse Logo */}
          <svg className="w-5 h-5 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
            <polyline points="3.27 6.96 12 12.01 20.73 6.96" />
            <line x1="12" y1="22.08" x2="12" y2="12" />
          </svg>
        </div>
        <div>
          <span className="text-lg font-display font-extrabold tracking-wider text-slate-900 leading-none">
            SOKO
          </span>
          <span className="text-[9px] font-mono tracking-widest text-slate-400 uppercase block leading-none mt-0.5">
            Storehouse
          </span>
        </div>
      </div>

      {/* Navigation Links */}
      <div className="flex items-center gap-8 text-xs font-semibold text-slate-600">
        <a href="#features" className="hover:text-slate-900 transition-colors">Features</a>
        <a href="#pricing" className="hover:text-slate-900 transition-colors">Pricing</a>
        <a href="#docs" className="hover:text-slate-900 transition-colors">Docs</a>
        <button
          onClick={onEnterDashboard}
          className="flex items-center gap-1.5 hover:text-slate-900 transition-colors cursor-pointer border-none bg-transparent font-semibold"
        >
          <LogIn className="w-3.5 h-3.5" />
          <span>Log In</span>
        </button>
        
        <button
          onClick={onEnterDashboard}
          className="bg-black hover:bg-slate-800 text-white rounded-full px-5 py-2.5 transition-all flex items-center gap-1.5 shadow-sm hover:shadow-md cursor-pointer border-none font-semibold"
        >
          <span>Book Demo</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </header>
  )
}
