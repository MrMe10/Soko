import { useState } from 'react'
import Sidebar from './components/Sidebar'
import Header from './components/Header'
import SettingsView from './components/SettingsView'
import LandingPage from './components/LandingPage'
import ProjectsView from './components/ProjectsView'
import CreateProjectView from './components/CreateProjectView'

interface Project {
  id: string
  name: string
  description: string
  type: 'separate' | 'fullstack'
  createdAt: string
  status: 'active' | 'synced' | 'inactive'
}

export default function App() {
  const [view, setView] = useState<'landing' | 'dashboard'>('landing')
  const [activeTab, setActiveTab] = useState<string>('projects')
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  // Project state management
  const [projects, setProjects] = useState<Project[]>([
    {
      id: 'soko-core',
      name: 'Soko Storehouse OS',
      description: 'Core warehouse management systems, database indices, and hardware replication loops.',
      type: 'fullstack',
      createdAt: '2026-07-03 12:00',
      status: 'active'
    }
  ])

  const handleCreateProject = (newProj: { name: string; description: string; type: 'separate' | 'fullstack' }) => {
    const projectToAdd: Project = {
      id: `proj-${Date.now()}`,
      name: newProj.name,
      description: newProj.description,
      type: newProj.type,
      createdAt: new Date().toISOString().slice(0, 16).replace('T', ' '),
      status: 'synced'
    }
    setProjects(prev => [...prev, projectToAdd])
    setActiveTab('projects')
  }

  // Render correct view based on active tab
  const renderActiveView = () => {
    switch (activeTab) {
      case 'projects':
        return (
          <ProjectsView
            projects={projects}
            onSelectProject={(project) => {
              console.log('Selected project:', project.name)
            }}
            onAddProjectClick={() => setActiveTab('create')}
          />
        )
      case 'create':
        return (
          <CreateProjectView
            onCreateProject={handleCreateProject}
            onCancel={() => setActiveTab('projects')}
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
            onAddProjectClick={() => setActiveTab('create')}
          />
        )
    }
  }

  // 1. Render Public Landing Page
  if (view === 'landing') {
    return (
      <LandingPage
        onEnterDashboard={() => {
          setView('dashboard')
          setActiveTab('projects')
        }}
      />
    )
  }

  // 2. Render Light Dashboard View
  return (
    <div className="flex h-screen w-screen bg-slate-50 text-slate-800 font-sans overflow-hidden">
      
      {/* Sidebar Navigation */}
      {/* Desktop Sidebar (hidden on mobile) */}
      <div className="hidden md:flex h-full">
        <Sidebar
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          onLogoClick={() => {
            setView('landing')
            setActiveTab('projects')
          }}
        />
      </div>

      {/* Mobile Sidebar overlay/drawer */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-40 md:hidden flex">
          {/* Backdrop */}
          <div
            onClick={() => setMobileMenuOpen(false)}
            className="fixed inset-0 bg-slate-950/40 backdrop-blur-xs transition-opacity duration-300"
          />
          {/* Drawer content */}
          <div className="relative flex flex-col h-full w-72 max-w-[80vw] animate-slide-in">
            <Sidebar
              activeTab={activeTab}
              setActiveTab={(tab) => {
                setActiveTab(tab)
                setMobileMenuOpen(false)
              }}
              onLogoClick={() => {
                setView('landing')
                setActiveTab('projects')
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
        <main className="flex-1 overflow-y-auto p-6 md:p-8 bg-slate-50 relative">
          
          {/* Geometric Grid Background Overlay for light theme aesthetics */}
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#e2e8f0_1px,transparent_1px),linear-gradient(to_bottom,#e2e8f0_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] opacity-[0.4] pointer-events-none" />
          
          {/* View Wrapper */}
          <div className="relative z-10">
            {renderActiveView()}
          </div>

        </main>
      </div>

    </div>
  )
}
