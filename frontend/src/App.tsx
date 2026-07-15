// src/App.tsx
import { useState } from 'react'
// 🔌 Import using curly braces to perfectly match your named export!
import { LandingView } from './components/landing_page/LandingView' 

export default function App() {
  const [view, setView] = useState<'landing' | 'dashboard'>('landing')
  const [activeTab, setActiveTab] = useState<string>('projects')

  // ==========================================
  // 🏁 VIEW RENDERING SPACE 1: Public Landing Module
  // ==========================================
  if (view === 'landing') {
    return (
      <LandingView
        onEnterDashboard={() => {
          setView('dashboard')
          setActiveTab('projects')
        }}
      />
    )
  }

  // ==========================================
  // 🏁 VIEW RENDERING SPACE 2: Cohesive Dashboard View
  // ==========================================
  return (
    <div className="flex h-screen w-screen bg-slate-50 text-slate-800 font-sans p-8 justify-center items-center">
      <div className="text-center">
        <h2 className="text-2xl font-bold">Soko Dashboard Framework Initialized</h2>
        <p className="text-slate-500 mt-2">Active Tab Context: {activeTab}</p>
      </div>
    </div>
  )
} 