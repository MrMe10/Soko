// src/App.tsx
import React, { Component, useState, useEffect } from 'react'
import type { ErrorInfo, ReactNode } from 'react'
import { LandingView } from './components/landing_page/LandingView'
import Sidebar from './components/dashboard/Sidebar'
import Header from './components/dashboard/Header'
import ProjectsView, { type Project } from './components/dashboard/project_view/ProjectsView'
import CreateProjectView from './components/dashboard/create/CreateProjectView'
import SettingsView from './components/dashboard/general_setting/SettingsView'

interface ErrorBoundaryProps {
  children: ReactNode
}

interface ErrorBoundaryState {
  hasError: boolean
  error: Error | null
}

export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  public state: ErrorBoundaryState = {
    hasError: false,
    error: null
  }

  public static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error }
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught render error:', error, errorInfo)
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen w-full flex flex-col items-center justify-center bg-black text-white p-6 font-mono">
          <div className="max-w-2xl w-full bg-zinc-900 border border-emerald-500/40 rounded-2xl p-6 shadow-2xl space-y-4">
            <div className="flex items-center gap-3 text-emerald-400">
              <span className="text-xl">⚠️</span>
              <h2 className="text-base font-bold">Runtime Error in View</h2>
            </div>
            <pre className="text-xs bg-black p-4 rounded-xl text-emerald-300 overflow-x-auto whitespace-pre-wrap leading-relaxed border border-zinc-800">
              {this.state.error?.stack || this.state.error?.message || 'Unknown error'}
            </pre>
            <div className="flex gap-3 pt-2">
              <button
                type="button"
                onClick={() => {
                  this.setState({ hasError: false, error: null })
                  window.location.href = '/'
                }}
                className="px-4 py-2 bg-emerald-500 hover:bg-emerald-400 text-black text-xs font-bold rounded-lg cursor-pointer transition-all shadow-md shadow-emerald-500/20"
              >
                Go to Landing
              </button>
              <button
                type="button"
                onClick={() => {
                  this.setState({ hasError: false, error: null })
                  window.location.reload()
                }}
                className="px-4 py-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs font-bold rounded-lg cursor-pointer transition-all border border-zinc-700"
              >
                Retry
              </button>
            </div>
          </div>
        </div>
      )
    }

    return this.props.children
  }
}

export default function App() {
  const getInitialRoute = () => {
    if (typeof window === 'undefined') return { initialView: 'landing' as const, initialTab: 'projects' }

    const pathname = window.location.pathname.toLowerCase()
    const hash = window.location.hash.toLowerCase()
    const search = window.location.search.toLowerCase()
    const raw = `${pathname} ${hash} ${search}`

    if (raw.includes('create')) {
      return { initialView: 'dashboard' as const, initialTab: 'create' }
    }
    if (raw.includes('settings')) {
      return { initialView: 'dashboard' as const, initialTab: 'settings' }
    }
    if (raw.includes('projects') || raw.includes('dashboard')) {
      return { initialView: 'dashboard' as const, initialTab: 'projects' }
    }
    return { initialView: 'landing' as const, initialTab: 'projects' }
  }

  const { initialView, initialTab } = getInitialRoute()
  const [view, setView] = useState<'landing' | 'dashboard'>(initialView)
  const [activeTab, setActiveTab] = useState<string>(initialTab)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  // Synchronize browser URL history with tab/view changes
  useEffect(() => {
    const handlePopState = () => {
      const { initialView: v, initialTab: t } = getInitialRoute()
      setView(v)
      setActiveTab(t)
    }
    window.addEventListener('popstate', handlePopState)
    return () => window.removeEventListener('popstate', handlePopState)
  }, [])

  const handleTabChange = (tab: string) => {
    setActiveTab(tab)
    window.history.pushState({}, '', `/${tab}`)
  }

  const handleEnterDashboard = (tab = 'projects') => {
    setView('dashboard')
    setActiveTab(tab)
    window.history.pushState({}, '', `/${tab}`)
  }

  const handleGoToLanding = () => {
    setView('landing')
    window.history.pushState({}, '', '/')
  }

  // Project state management
  const [projects] = useState<Project[]>([
    {
      id: 'soko-core',
      name: 'Soko Storehouse OS',
      description: 'Core warehouse management systems, database indices, and hardware replication loops.',
      type: 'fullstack',
      createdAt: '2026-07-03 12:00',
      status: 'active'
    }
  ])

  const handleCreateProject = (_newProj: { name: string; description: string; type: 'separate' | 'fullstack' }) => {
    // Ephemeral mode: Do not save or append new project to the list for now
    handleTabChange('projects')
  }

  // Render active view based on tab
  const renderActiveView = () => {
    switch (activeTab) {
      case 'projects':
        return (
          <ProjectsView
            projects={projects}
            onSelectProject={(project) => {
              console.log('Selected project:', project.name)
            }}
            onAddProjectClick={() => handleTabChange('create')}
          />
        )
      case 'create':
        return (
          <CreateProjectView
            onCreateProject={handleCreateProject}
            onCancel={() => handleTabChange('projects')}
          />
        )
      case 'settings':
        return <SettingsView />
      default:
        return (
          <ProjectsView
            projects={projects}
            onSelectProject={(project) => {
              console.log('Selected project:', project.name)
            }}
            onAddProjectClick={() => handleTabChange('create')}
          />
        )
    }
  }

  // ==========================================
  // 🏁 VIEW RENDERING SPACE 1: Public Landing Module
  // ==========================================
  if (view === 'landing') {
    return (
      <LandingView
        onEnterDashboard={() => handleEnterDashboard('projects')}
      />
    )
  }

  // ==========================================
  // 🏁 VIEW RENDERING SPACE 2: Cohesive Dashboard View
  // ==========================================
  return (
    <div className="flex h-screen w-screen bg-[#090d0b] text-zinc-100 font-sans overflow-hidden">

      {/* Sidebar Navigation */}
      <div className="hidden md:flex h-full">
        <Sidebar
          activeTab={activeTab}
          setActiveTab={handleTabChange}
          onLogoClick={handleGoToLanding}
        />
      </div>

      {/* Mobile Sidebar overlay/drawer */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-40 md:hidden flex">
          <div
            onClick={() => setMobileMenuOpen(false)}
            className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity duration-300"
          />
          <div className="relative flex flex-col h-full w-72 max-w-[80vw]">
            <Sidebar
              activeTab={activeTab}
              setActiveTab={(tab) => {
                handleTabChange(tab)
                setMobileMenuOpen(false)
              }}
              onLogoClick={() => {
                handleGoToLanding()
                setMobileMenuOpen(false)
              }}
            />
          </div>
        </div>
      )}

      {/* Main Content Frame */}
      <div className="flex-1 flex flex-col h-full overflow-hidden">

        {/* Header */}
        <Header
          activeTab={activeTab}
          onMenuToggle={() => setMobileMenuOpen(true)}
        />

        {/* Scrollable View Area */}
        <main className="flex-1 overflow-y-auto p-6 md:p-8 bg-[#090d0b] relative">

          {/* Geometric Grid Background Overlay */}
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#10b98110_1px,transparent_1px),linear-gradient(to_bottom,#10b98110_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] opacity-80 pointer-events-none" />

          {/* View Wrapper */}
          <div className="relative z-10">
            {renderActiveView()}
          </div>

        </main>
      </div>

    </div>
  )
}