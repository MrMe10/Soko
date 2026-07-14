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
    <aside className="w-72 bg-white border-r border-slate-200 flex flex-col h-full shrink-0">
      
      {/* Brand Header with Isometric Warehouse Logo */}
      <button
        onClick={onLogoClick}
        className="h-16 flex items-center px-6 border-b border-slate-200 gap-3 text-left w-full hover:bg-slate-50/50 transition-colors cursor-pointer"
      >
        <div className="relative w-8 h-8 shrink-0 flex items-center justify-center bg-black rounded-lg shadow-md">
          {/* Custom Isometric Box / Warehouse Logo in SVG */}
          <svg className="w-5 h-5 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
            <polyline points="3.27 6.96 12 12.01 20.73 6.96" />
            <line x1="12" y1="22.08" x2="12" y2="12" />
          </svg>
          {/* Subtle glow dot */}
          <span className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-emerald-500 rounded-full animate-ping" />
        </div>
        <div>
          <h1 className="text-lg font-display font-extrabold tracking-wider text-slate-900 m-0 leading-none">
            SOKO
          </h1>
          <span className="text-[10px] font-mono tracking-widest text-slate-400 uppercase leading-none block mt-1">
            Storehouse OS v1.4
          </span>
        </div>
      </button>

      {/* Navigation List */}
      <nav className="flex-1 px-4 py-6 space-y-1.5 overflow-y-auto">
        <div className="px-3 mb-2">
          <span className="text-[11px] font-mono tracking-wider text-slate-400 uppercase font-semibold">
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
                  ? 'bg-indigo-50 text-indigo-700 shadow-sm shadow-indigo-100/30 border-l-4 border-indigo-600 rounded-l-none pl-2.5'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              <IconComponent
                className={`w-4 h-4 transition-transform duration-200 group-hover:scale-110 ${
                  isActive ? 'text-indigo-600' : 'text-slate-500 group-hover:text-indigo-655'
                }`}
              />
              <span>{item.label}</span>
              {isActive && (
                <span className="ml-auto w-1.5 h-1.5 bg-indigo-500 rounded-full animate-pulse" />
              )}
            </button>
          )
        })}
      </nav>

      {/* Sidebar Footer with system health */}
      <div className="p-4 border-t border-slate-200 bg-slate-50/50 font-mono text-[11px] text-slate-600 space-y-3">
        <div className="flex items-center justify-between">
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            Core Status
          </span>
          <span className="text-emerald-600 font-bold">ACTIVE</span>
        </div>

        {/* Capacity Bar */}
        <div className="space-y-1">
          <div className="flex justify-between text-slate-500">
            <span>WHSE Storage</span>
            <span>73.2%</span>
          </div>
          <div className="h-1.5 bg-slate-200 rounded-full overflow-hidden">
            <div className="h-full bg-gradient-to-r from-indigo-500 to-emerald-500 rounded-full animate-pulse-slow" style={{ width: '73.2%' }} />
          </div>
        </div>

        <div className="flex items-center justify-between text-slate-455 text-[10px] pt-1">
          <span>ZONE: US-EAST-01</span>
          <span>NODE: #718</span>
        </div>
      </div>
    </aside>
  )
}
