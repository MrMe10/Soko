import React from 'react'
import { LandingHeader } from './LandingHeader'
import { LandingHero } from './LandingHero'
import { LandingMockup } from './LandingMockup'
import { LandingTechStack } from './LandingTechStack'
import { LandingFooter } from './LandingFooter'

interface LandingViewProps {
  onEnterDashboard: () => void
}

export const LandingView: React.FC<LandingViewProps> = ({ onEnterDashboard }) => {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 flex flex-col font-sans overflow-x-hidden selection:bg-indigo-100">
      
      {/* 🧩 Segment 1: Fixed Navigation Bar */}
      <LandingHeader onEnterDashboard={onEnterDashboard} />

      {/* Main Presentation Container */}
      <main className="flex-1 flex flex-col items-center px-6 relative">
        
        {/* 🧩 Segment 2: Hero Titles & Floating Pager Bubbles */}
        <LandingHero onEnterDashboard={onEnterDashboard} />

        {/* 🧩 Segment 3: Workspace Monitor Preview Frame */}
        <LandingMockup />

        {/* 🧩 Segment 4: Ecosystem Integration Grid */}
        <LandingTechStack />

      </main>

      {/* 🧩 Segment 5: Standard compliance footer */}
      <LandingFooter /> 

    </div>
  )
}