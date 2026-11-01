import { useState, useRef, useEffect } from 'react'
import {
  Search,
  Bell,
  ChevronDown,
  User,
  Settings,
  LogOut,
  Sliders,
  Menu,
  Database
} from 'lucide-react'

interface HeaderProps {
  activeTab: string
  onMenuToggle?: () => void
}

export default function Header({ activeTab, onMenuToggle }: HeaderProps) {
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  const tabNames: Record<string, string> = {
    projects: 'Projects Overview',
    create: 'Create Project',
    settings: 'System Settings',
  }

  // Close dropdown on click outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  return (
    <header className="h-16 bg-zinc-950 border-b border-zinc-800/80 flex items-center justify-between px-6 shrink-0 relative z-30">
      {/* Left side: Hamburger menu & Path */}
      <div className="flex items-center gap-3">
        {onMenuToggle && (
          <button
            onClick={onMenuToggle}
            className="md:hidden p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-900 transition-colors"
          >
            <Menu className="w-5 h-5" />
          </button>
        )}
        
        <div className="flex items-center gap-2">
          {/* Mobile Isometric Logo */}
          <div className="w-6 h-6 bg-emerald-500 rounded flex items-center justify-center md:hidden shadow">
            <Database className="w-3.5 h-3.5 text-black" />
          </div>
          <span className="text-xs font-mono text-zinc-500 hidden sm:inline font-bold">SOKO</span>
          <span className="text-xs font-mono text-zinc-600 hidden sm:inline font-bold">/</span>
          <span className="text-sm font-bold text-white font-display">
            {tabNames[activeTab] || 'Soko'}
          </span>
        </div>
      </div>

      {/* Center: Search Bar */}
      <div className="hidden md:flex items-center w-96 relative">
        <Search className="w-4 h-4 text-zinc-500 absolute left-3 pointer-events-none" />
        <input
          type="text"
          placeholder="Search items, shelves, or blocks... (Press / to search)"
          className="w-full bg-zinc-900 border border-zinc-800 rounded-lg py-1.5 pl-10 pr-12 text-xs text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500/30 transition-all font-sans"
        />
        <div className="absolute right-3 top-2 px-1.5 py-0.5 bg-zinc-800 rounded border border-zinc-700 text-[10px] font-mono text-zinc-400 select-none">
          /
        </div>
      </div>

      {/* Right side: Actions & User Info */}
      <div className="flex items-center gap-4">
        {/* Search button for mobile */}
        <button className="md:hidden p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-900 transition-colors">
          <Search className="w-4 h-4" />
        </button>

        {/* Notifications */}
        <button className="p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-900 transition-all relative group">
          <Bell className="w-4 h-4" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-emerald-500 rounded-full border border-zinc-950" />
        </button>

        <div className="h-6 w-px bg-zinc-800" />

        {/* User Profile Dropdown */}
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className="flex items-center gap-2.5 p-1 rounded-lg hover:bg-zinc-900 transition-all text-left cursor-pointer"
          >
            <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-emerald-600 to-green-400 p-0.5 shadow">
              <div className="w-full h-full bg-black rounded-[6px] flex items-center justify-center overflow-hidden">
                <span className="text-[11px] font-mono text-emerald-400 font-bold">JD</span>
              </div>
            </div>
            <div className="hidden lg:block select-none">
              <div className="text-xs font-semibold text-zinc-200 leading-tight">John Doe</div>
              <div className="text-[10px] text-zinc-500 leading-none mt-0.5">WHSE Supervisor</div>
            </div>
            <ChevronDown className={`w-3.5 h-3.5 text-zinc-400 transition-transform duration-200 ${dropdownOpen ? 'rotate-180' : ''}`} />
          </button>

          {/* Dropdown Menu */}
          {dropdownOpen && (
            <div className="absolute right-0 mt-2.5 w-52 bg-zinc-900 border border-zinc-800 rounded-lg shadow-xl shadow-black/80 py-1.5 font-sans z-50">
              <div className="px-3.5 py-2 border-b border-zinc-800">
                <p className="text-xs font-bold text-white">John Doe</p>
                <p className="text-[10px] text-zinc-400 mt-0.5">j.doe@soko.internal</p>
              </div>

              <div className="py-1">
                <a
                  href="#profile"
                  className="flex items-center gap-2.5 px-3.5 py-2 text-xs text-zinc-300 hover:bg-zinc-800 hover:text-white transition-colors"
                >
                  <User className="w-3.5 h-3.5 text-zinc-400" />
                  My Profile
                </a>
                <a
                  href="#settings"
                  className="flex items-center gap-2.5 px-3.5 py-2 text-xs text-zinc-300 hover:bg-zinc-800 hover:text-white transition-colors"
                >
                  <Sliders className="w-3.5 h-3.5 text-zinc-400" />
                  Preferences
                </a>
                <a
                  href="#system"
                  className="flex items-center gap-2.5 px-3.5 py-2 text-xs text-zinc-300 hover:bg-zinc-800 hover:text-white transition-colors"
                >
                  <Settings className="w-3.5 h-3.5 text-zinc-400" />
                  System Admin
                </a>
              </div>

              <div className="border-t border-zinc-800 my-1" />

              <div className="py-1">
                <button
                  onClick={() => alert('Logging out...')}
                  className="w-full flex items-center gap-2.5 px-3.5 py-2 text-xs text-rose-400 hover:bg-rose-950/30 hover:text-rose-300 transition-colors text-left cursor-pointer font-semibold"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  Sign Out
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}
