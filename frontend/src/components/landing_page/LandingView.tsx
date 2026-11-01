import React from 'react'
import { LandingHeader } from './LandingHeader'
import { LandingHero } from './LandingHero'
import { LandingProjectStack } from './LandingProjectStack'
import { LandingMockup } from './LandingMockup'
import { LandingTechStack } from './LandingTechStack'
import { LandingFooter } from './LandingFooter'

interface LandingViewProps {
  onEnterDashboard: (tab?: string) => void
}

export const LandingView: React.FC<LandingViewProps> = ({ onEnterDashboard }) => {
  return (
    <div className="min-h-screen bg-[#090d0b] text-white flex flex-col font-sans overflow-x-hidden selection:bg-emerald-500 selection:text-black">

      {/* 🧩 Segment 1: Fixed Navigation Bar */}
      <LandingHeader onEnterDashboard={onEnterDashboard} />

      {/* Main Presentation Container */}
      <main className="flex-1 flex flex-col items-center w-full relative">

        {/* 🧩 Segment 2: Hero Titles & Floating Pager Bubbles (Full-bleed screen) */}
        <LandingHero onEnterDashboard={onEnterDashboard} />

        {/* 🧩 Below-Hero Content Container with standard padding */}
        <div className="w-full flex flex-col items-center px-6">
          {/* 🧩 Segment 2.5: Architecture Blueprint & Honeycomb Cluster */}
          <LandingProjectStack onEnterDashboard={onEnterDashboard} />

          {/* 🧩 Segment 3: Workspace Monitor Preview Frame */}
          <LandingMockup />

          {/* 🧩 Segment 4: Ecosystem Integration Grid */}
          <LandingTechStack />
        </div>

      </main>

      {/* 🧩 Segment 5: Standard compliance footer */}
      <LandingFooter />

    </div>
  )
}