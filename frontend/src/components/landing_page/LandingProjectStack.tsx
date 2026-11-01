import React, { useState } from 'react'
import {
  Layers,
  Cpu,
  Database,
  Shield,
  Mail,
  Server,
  Boxes,
  ArrowRight,
  Sparkles,
  Zap,
  CheckCircle2
} from 'lucide-react'

// Hexagon geometry from create menu
const HEX_POINTS = '120,5 230,68 230,195 120,258 10,195 10,68'

type ArchitectureType = 'separate' | 'fullstack'

interface TechNode {
  id: string
  label: string
  category: string
  name: string
  options: string[]
  logo?: string
  Icon: React.ComponentType<{ className?: string }>
  dx: number
  dy: number
}

const DECOUPLED_NODES: TechNode[] = [
  {
    id: 'top-left',
    label: 'Frontend',
    category: 'Client Interface',
    name: 'React 19',
    options: ['React 19', 'Next.js', 'Vite + TS'],
    logo: '/React-Logo.png',
    Icon: Layers,
    dx: -110,
    dy: -190
  },
  {
    id: 'top-right',
    label: 'Backend',
    category: 'API Engine',
    name: 'Express / Node',
    options: ['Express / Node', 'Fastify', 'NestJS'],
    logo: '/express-js2119.logowik.com.png',
    Icon: Cpu,
    dx: 110,
    dy: -190
  },
  {
    id: 'right',
    label: 'Database',
    category: 'Persistence',
    name: 'Supabase DB',
    options: ['Supabase DB', 'MongoDB', 'Pinecone Vector'],
    logo: '/t_supabase-icon9119.logowik.com.png',
    Icon: Database,
    dx: 220,
    dy: 0
  },
  {
    id: 'bottom-right',
    label: 'Hosting',
    category: 'Cloud Deployment',
    name: 'Vercel Edge',
    options: ['Vercel Edge', 'Docker / AWS', 'Render'],
    Icon: Server,
    dx: 110,
    dy: 190
  },
  {
    id: 'bottom-left',
    label: 'Email',
    category: 'Notifications',
    name: 'Resend',
    options: ['Resend', 'SendGrid', 'Postmark'],
    Icon: Mail,
    dx: -110,
    dy: 190
  },
  {
    id: 'left',
    label: 'Auth',
    category: 'Access Control',
    name: 'Supabase Auth',
    options: ['Supabase Auth', 'OAuth 2.0', 'JWT Session'],
    logo: '/t_supabase-icon9119.logowik.com.png',
    Icon: Shield,
    dx: -220,
    dy: 0
  }
]

const FULLSTACK_NODES: TechNode[] = [
  {
    id: 'top-left',
    label: 'Framework',
    category: 'Fullstack Monolith',
    name: 'Next.js App Router',
    options: ['Next.js App Router', 'Remix', 'Astro'],
    logo: '/nextjs7685.logowik.com.png',
    Icon: Layers,
    dx: -110,
    dy: -190
  },
  {
    id: 'top-right',
    label: 'Server Runtime',
    category: 'Unified Engine',
    name: 'Node.js LTS',
    options: ['Node.js LTS', 'Bun', 'Edge Runtime'],
    logo: '/nodejs-icon.png',
    Icon: Cpu,
    dx: 110,
    dy: -190
  },
  {
    id: 'right',
    label: 'Database',
    category: 'Persistence',
    name: 'MongoDB Atlas',
    options: ['MongoDB Atlas', 'Supabase DB', 'Pinecone'],
    logo: '/external-mongodb-a-cross-platform-document-oriented-database-program-logo-color-tal-revivo.png',
    Icon: Database,
    dx: 220,
    dy: 0
  },
  {
    id: 'bottom-right',
    label: 'Hosting',
    category: 'Cloud Deployment',
    name: 'Vercel Edge',
    options: ['Vercel Edge', 'AWS ECS', 'Docker'],
    Icon: Server,
    dx: 110,
    dy: 190
  },
  {
    id: 'bottom-left',
    label: 'Email',
    category: 'Notifications',
    name: 'Resend',
    options: ['Resend', 'AWS SES', 'SendGrid'],
    Icon: Mail,
    dx: -110,
    dy: 190
  },
  {
    id: 'left',
    label: 'Auth',
    category: 'Access Control',
    name: 'Clerk / NextAuth',
    options: ['Clerk / NextAuth', 'Supabase Auth', 'OAuth 2.0'],
    Icon: Shield,
    dx: -220,
    dy: 0
  }
]

interface LandingProjectStackProps {
  onEnterDashboard?: (tab?: string) => void
}

export const LandingProjectStack: React.FC<LandingProjectStackProps> = ({ onEnterDashboard }) => {
  const [archType, setArchType] = useState<ArchitectureType>('separate')
  const [hoveredNodeId, setHoveredNodeId] = useState<string | null>(null)
  const [selectedTechs, setSelectedTechs] = useState<Record<string, string>>({})

  const currentNodes = archType === 'separate' ? DECOUPLED_NODES : FULLSTACK_NODES

  const handleCycleTech = (nodeId: string) => {
    const node = currentNodes.find((n) => n.id === nodeId)
    if (!node || node.options.length <= 1) return

    const current = selectedTechs[nodeId] || node.name
    const currentIndex = node.options.indexOf(current)
    const nextIndex = (currentIndex + 1) % node.options.length
    setSelectedTechs((prev) => ({
      ...prev,
      [nodeId]: node.options[nextIndex]
    }))
  }

  const activeHoveredNode = currentNodes.find((n) => n.id === hoveredNodeId)

  return (
    <section className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-14 relative z-25">
      {/* 2-Column Responsive Layout directly relative to the screen */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-stretch">

        {/* ======================================================== */}
        {/* 📦 LEFT COLUMN: TOP BOX (TITLES) + BOTTOM BOX (DESCRIPTION) */}
        {/* ======================================================== */}
        <div className="lg:col-span-5 flex flex-col gap-6">

          {/* 🟢 TOP BOX: "YOUR PROJECT" & "YOUR STACK" (no outer box) */}
          <div className="flex flex-col justify-center relative">
            {/* Ambient subtle emerald glow */}
            <div className="absolute -top-16 -left-16 w-48 h-48 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

            <div className="space-y-4 relative z-10">


              {/* Both titles stacked together exactly as in the user's sketch */}
              <div className="space-y-4 font-display font-black tracking-tight select-none pt-1">
                <div className="leading-[0.9]">
                  <span className="text-4xl sm:text-5xl lg:text-6xl text-white block">
                    YOUR
                  </span>
                  <span className="text-4xl sm:text-5xl lg:text-6xl text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-green-300 block">
                    PROJECT
                  </span>
                </div>

                <div className="leading-[0.9] pt-2">
                  <span className="text-4xl sm:text-5xl lg:text-6xl text-white block">
                    YOUR
                  </span>
                  <span className="text-4xl sm:text-5xl lg:text-6xl text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-emerald-300 to-green-200 block">
                    STACK
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* 🟢 BOTTOM: "description" (no outer box) */}
          <div className="flex flex-col justify-between relative space-y-6 pt-4">
            <div className="space-y-4 relative z-10">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-mono tracking-widest uppercase text-emerald-400 font-bold bg-emerald-950/60 border border-emerald-800/50 px-3 py-1 rounded-full">
                  Description & Specs
                </span>

                {/* Architecture Toggle */}
                <div className="flex bg-zinc-900/90 border border-zinc-800 p-0.5 rounded-lg text-xs font-mono">
                  <button
                    onClick={() => setArchType('separate')}
                    className={`px-3 py-1 rounded-md transition-all cursor-pointer ${archType === 'separate'
                      ? 'bg-emerald-500 text-black font-extrabold shadow-sm'
                      : 'text-zinc-400 hover:text-white'
                      }`}
                  >
                    Decoupled
                  </button>
                  <button
                    onClick={() => setArchType('fullstack')}
                    className={`px-3 py-1 rounded-md transition-all cursor-pointer ${archType === 'fullstack'
                      ? 'bg-emerald-500 text-black font-extrabold shadow-sm'
                      : 'text-zinc-400 hover:text-white'
                      }`}
                  >
                    Fullstack
                  </button>
                </div>
              </div>

              {/* Description Paragraph */}
              <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed font-normal">
                {archType === 'separate'
                  ? 'Decoupled frontend client & distributed micro-runtimes with dedicated deployment targets, optimal cache invalidation, and custom edge routing.'
                  : 'Unified monorepo housing both frontend client views and full server routes with shared TypeScript types and zero serialization overhead.'}
              </p>

              {/* Active Inspection / Connected Status */}
              <div className="bg-zinc-900/60 border border-zinc-800/80 rounded-xl p-3.5 space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-zinc-400 font-mono flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    {activeHoveredNode ? `Inspecting ${activeHoveredNode.label}` : 'Ecosystem Status'}
                  </span>
                  <span className="text-[10px] font-mono text-zinc-400">Click node to cycle</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-bold text-white truncate max-w-[200px]">
                    {activeHoveredNode
                      ? (selectedTechs[activeHoveredNode.id] || activeHoveredNode.name)
                      : `${currentNodes.length} Satellite Services Connected`}
                  </span>
                  <span className="text-xs font-mono text-emerald-400 font-semibold shrink-0">
                    {archType === 'separate' ? 'Decoupled OS' : 'Fullstack Hub'}
                  </span>
                </div>
              </div>
            </div>

            {/* Launch CTA Action Button */}
            <div className="pt-2 relative z-10">
              <button
                type="button"
                onClick={() => onEnterDashboard?.('create')}
                className="w-full py-3.5 px-6 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black font-extrabold text-sm shadow-lg shadow-emerald-500/20 hover:shadow-emerald-500/40 transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-[0.99]"
              >
                <Sparkles className="w-4 h-4" />
                <span>Configure in Create Wizard</span>
                <ArrowRight className="w-4 h-4 ml-1" />
              </button>
            </div>
          </div>

        </div>

        {/* ======================================================== */}
        {/* 🐝 RIGHT COLUMN: HONEY COMB (borderless, directly on screen) */}
        {/* ======================================================== */}
        <div className="lg:col-span-7 relative flex flex-col items-center justify-center min-h-[560px] lg:min-h-full">
          {/* Ambient Green Halo behind the honeycomb */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-emerald-500/10 blur-[100px] rounded-full pointer-events-none" />

          {/* Decorative circuit corner accents */}
          <div className="absolute top-6 right-6 flex items-center gap-2 text-[10px] font-mono text-zinc-400 bg-zinc-900/80 px-2.5 py-1 rounded-md border border-zinc-800">
            <Zap className="w-3 h-3 text-emerald-400 animate-pulse" />
            <span>LIVE CLUSTER GRAPH</span>
          </div>

          {/* Honeycomb Cluster SVG */}
          <div className="w-full h-full max-w-[560px] flex items-center justify-center relative py-2">
            <svg
              viewBox="-270 -245 780 750"
              className="w-full h-full max-h-[580px] overflow-visible select-none"
            >
              <defs>
                {/* Subtle radial glow filter for hovered nodes */}
                <filter id="hex-glow" x="-30%" y="-30%" width="160%" height="160%">
                  <feDropShadow dx="0" dy="0" stdDeviation="8" floodColor="#10b981" floodOpacity="0.5" />
                </filter>
                <filter id="core-glow" x="-30%" y="-30%" width="160%" height="160%">
                  <feDropShadow dx="0" dy="0" stdDeviation="12" floodColor="#10b981" floodOpacity="0.35" />
                </filter>
              </defs>

              {/* Connecting circuit lines from central hexagon to 6 satellites */}
              {currentNodes.map(({ id, dx, dy }) => {
                const isHovered = hoveredNodeId === id
                return (
                  <line
                    key={`line-${id}`}
                    x1={120}
                    y1={131.5}
                    x2={120 + dx}
                    y2={131.5 + dy}
                    stroke={isHovered ? '#10b981' : '#27272a'}
                    strokeWidth={isHovered ? 2.5 : 1.5}
                    strokeDasharray={isHovered ? 'none' : '4 4'}
                    className="transition-colors duration-300"
                  />
                )
              })}

              {/* 1. CENTRAL PROJECT HEXAGON (Soko Core) */}
              <g className="cursor-pointer transition-all duration-300">
                <polygon
                  points={HEX_POINTS}
                  fill="#121214"
                  stroke="#10b981"
                  strokeWidth="4"
                  filter="url(#core-glow)"
                  className="transition-all duration-300 hover:stroke-emerald-300"
                />
                <foreignObject x="30" y="45" width="180" height="175">
                  <div className="w-full h-full flex flex-col items-center justify-center text-center p-3 space-y-1.5 select-none pointer-events-none">
                    <div className="w-12 h-12 rounded-2xl bg-emerald-500 text-black flex items-center justify-center shadow-lg shadow-emerald-500/40">
                      <Boxes className="w-6 h-6 stroke-[2.2]" />
                    </div>
                    <div className="text-sm font-extrabold text-white tracking-tight">
                      SOKO STOREHOUSE
                    </div>
                    <div className="text-[10px] font-mono text-emerald-400 font-bold uppercase tracking-widest bg-emerald-950/80 px-2 py-0.5 rounded-full border border-emerald-800/60">
                      {archType === 'separate' ? 'Decoupled Core' : 'Monolith Hub'}
                    </div>
                    <div className="flex items-center gap-1.5 text-[9px] font-mono text-zinc-400 pt-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                      <span>SYNCHRONIZED</span>
                    </div>
                  </div>
                </foreignObject>
              </g>

              {/* 2. SIX SATELLITE HEXAGONS (Identical to SurroundingHexNodes in create menu) */}
              {currentNodes.map(({ id, label, name, options, Icon, logo, dx, dy }) => {
                const activeName = selectedTechs[id] || name
                const isHovered = hoveredNodeId === id
                const scale = isHovered ? 1.08 : 1

                return (
                  <g
                    key={id}
                    onClick={() => handleCycleTech(id)}
                    onMouseEnter={() => setHoveredNodeId(id)}
                    onMouseLeave={() => setHoveredNodeId(null)}
                    className="cursor-pointer transition-all duration-200"
                    style={{
                      transform: `translate(${dx}px, ${dy}px) scale(${scale})`,
                      transformOrigin: '120px 131.5px',
                      filter: isHovered ? 'url(#hex-glow)' : undefined
                    }}
                  >
                    {/* Satellite Hexagon Path */}
                    <polygon
                      points={HEX_POINTS}
                      fill={isHovered ? '#064e3b' : '#0f1311'}
                      stroke={isHovered ? '#10b981' : '#27272a'}
                      strokeWidth={isHovered ? '3.5' : '1.8'}
                      strokeDasharray={isHovered ? undefined : '5 4'}
                      className="transition-colors duration-200"
                    />

                    {/* Satellite Node Content */}
                    <foreignObject x="30" y="55" width="180" height="160">
                      <div className="w-full h-full flex flex-col items-center justify-center text-center p-2 space-y-1 select-none pointer-events-none">
                        <div
                          className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all ${isHovered
                            ? 'bg-emerald-500 text-black shadow-md shadow-emerald-500/40'
                            : 'bg-zinc-900 border border-zinc-800 text-zinc-300'
                            }`}
                        >
                          {logo ? (
                            <img
                              src={logo}
                              alt={label}
                              className={`w-5 h-5 object-contain transition-all ${isHovered ? 'brightness-0' : 'brightness-100'
                                }`}
                            />
                          ) : (
                            <Icon className="w-5 h-5" />
                          )}
                        </div>

                        <div className="text-[10px] font-mono uppercase tracking-wider text-zinc-400 font-semibold">
                          {label}
                        </div>

                        <div
                          className={`text-xs font-bold leading-tight truncate max-w-[130px] ${isHovered ? 'text-emerald-200' : 'text-zinc-200'
                            }`}
                        >
                          {activeName}
                        </div>

                        <div className="text-[8px] font-mono text-emerald-400/90 pt-0.5 flex items-center gap-1">
                          <CheckCircle2 className="w-2.5 h-2.5" />
                          <span>CLICK TO CYCLE</span>
                        </div>
                      </div>
                    </foreignObject>
                  </g>
                )
              })}
            </svg>
          </div>

          {/* Bottom Status Tip */}
          <div className="pt-2 text-center text-[11px] font-mono text-zinc-400 select-none">
            {activeHoveredNode ? (
              <span className="text-emerald-400">
                Inspecting <strong className="text-white">{activeHoveredNode.label}</strong>: {selectedTechs[activeHoveredNode.id] || activeHoveredNode.name}
              </span>
            ) : (
              <span>Hover or click any satellite node to interact with the stack</span>
            )}
          </div>
        </div>

      </div>
    </section>
  )
}
