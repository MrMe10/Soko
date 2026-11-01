import {
  Folder,
  PlusCircle,
  Settings
} from 'lucide-react'

interface SidebarProps {
  activeTab: string
  setActiveTab: (tab: string) => void
  onLogoClick?: () => void
}

export default function Sidebar({
  activeTab,
  setActiveTab,
  onLogoClick
}: SidebarProps) {
  
  const menuItems = [
    { id: 'projects', label: 'Projects Overview', icon: Folder },
    { id: 'create', label: 'Create Project', icon: PlusCircle },
    { id: 'settings', label: 'General Settings', icon: Settings },
  ]

  const headerTitle = 'Management Panel'

  return (
    <aside className="w-72 bg-zinc-950 border-r border-zinc-800/80 flex flex-col h-full shrink-0">
      
      {/* Brand Header with Isometric Warehouse Logo */}
      <button
        onClick={onLogoClick}
        className="h-16 flex items-center px-6 border-b border-zinc-800/80 gap-3 text-left w-full hover:bg-zinc-900/50 transition-colors cursor-pointer"
      >
        <div className="relative w-8 h-8 shrink-0 flex items-center justify-center bg-emerald-500 rounded-lg shadow-md shadow-emerald-500/20">
          {/* Custom Isometric Box / Warehouse Logo in SVG */}
          <svg className="w-5 h-5 text-black" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
            <polyline points="3.27 6.96 12 12.01 20.73 6.96" />
            <line x1="12" y1="22.08" x2="12" y2="12" />
          </svg>
          {/* Subtle glow dot */}
          <span className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-white rounded-full animate-ping" />
        </div>
        <div>
          <h1 className="text-lg font-display font-extrabold tracking-wider text-white m-0 leading-none">
            SOKO
          </h1>
          <span className="text-[10px] font-mono tracking-widest text-emerald-400 uppercase leading-none block mt-1 font-semibold">
            Storehouse OS v1.4
          </span>
        </div>
      </button>

      {/* Navigation List */}
      <nav className="flex-1 px-4 py-6 space-y-1.5 overflow-y-auto">
        <div className="px-3 mb-2">
          <span className="text-[11px] font-mono tracking-wider text-zinc-500 uppercase font-semibold">
            {headerTitle}
          </span>
        </div>
        {menuItems.map((item) => {
          const IconComponent = item.icon
          const isActive = activeTab === item.id

          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-semibold transition-all duration-200 group text-left cursor-pointer ${
                isActive
                  ? 'bg-emerald-500/10 text-emerald-400 shadow-sm shadow-emerald-950/40 border-l-4 border-emerald-500 rounded-l-none pl-2.5'
                  : 'text-zinc-400 hover:text-white hover:bg-zinc-900'
              }`}
            >
              <IconComponent
                className={`w-4 h-4 transition-transform duration-200 group-hover:scale-110 ${
                  isActive ? 'text-emerald-400' : 'text-zinc-400 group-hover:text-emerald-400'
                }`}
              />
              <span>{item.label}</span>
              {isActive && (
                <span className="ml-auto w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse" />
              )}
            </button>
          )
        })}
      </nav>    
    </aside>
  )
}
