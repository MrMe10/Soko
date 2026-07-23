import React, { useState, useEffect } from 'react'
import {
  Layers,
  Cpu,
  ArrowRight,
  ArrowLeft,
  Sparkles,
  Database,
  Shield,
  Plus,
  Zap,
  Code2,
  Terminal,
  Network,
  ShieldCheck,
  KeyRound,
  Lock,
  HardDrive,
  Boxes
} from 'lucide-react'

interface CreateProjectViewProps {
  onCreateProject: (project: { name: string; description: string; type: 'separate' | 'fullstack' }) => void
  onCancel: () => void
}

const OPTIONS = [
  {
    type: 'separate' as const,
    title: 'Separate / Decoupled',
    desc: 'Independent frontend & backend codebases with dedicated deployment targets.',
    Icon: Layers
  },
  {
    type: 'fullstack' as const,
    title: 'Fullstack / Monolith',
    desc: 'Unified repository containing full client & server code in a single project setup.',
    Icon: Cpu
  }
]

// 6 surrounding nodes pushing out to each adjacent side of the hexagon
const SURROUNDING_NODES = [
  { id: 'top-left', label: 'Frontend', category: 'Frontend', Icon: Layers, dx: -110, dy: -190 },
  { id: 'top-right', label: 'Backend', category: 'Backend', Icon: Cpu, dx: 110, dy: -190 },
  { id: 'right', label: 'Database', category: 'Database', Icon: Database, dx: 220, dy: 0 },
  { id: 'bottom-right', label: 'Extra Tech', category: 'Extra Tech', Icon: Plus, dx: 110, dy: 190 },
  { id: 'bottom-left', label: 'Extra Tech', category: 'Extra Tech', Icon: Plus, dx: -110, dy: 190 },
  { id: 'left', label: 'Auth', category: 'Auth', Icon: Shield, dx: -220, dy: 0 }
]

const TECH_SECTIONS = [
  {
    category: 'Frontend',
    techs: ['React', 'Next.js', 'Tailwind CSS', 'TypeScript', 'Vite']
  },
  {
    category: 'Backend',
    techs: ['Node.js', 'Express', 'Fastify', 'GraphQL', 'Python']
  },
  {
    category: 'Auth',
    techs: ['Clerk', 'NextAuth', 'Supabase Auth', 'OAuth 2.0', 'JWT']
  },
  {
    category: 'Database',
    techs: ['PostgreSQL', 'MongoDB', 'Redis', 'Prisma', 'Pinecone']
  }
]

const TECH_DETAILS: Record<string, { logo?: string; mockupIcon?: any }> = {
  'React': { logo: '/React-Logo.png' },
  'Next.js': { logo: '/nextjs7685.logowik.com.png' },
  'Tailwind CSS': { mockupIcon: Layers },
  'TypeScript': { mockupIcon: Code2 },
  'Vite': { mockupIcon: Zap },
  'Node.js': { logo: '/nodejs-icon.png' },
  'Express': { logo: '/express-js2119.logowik.com.png' },
  'Fastify': { mockupIcon: Cpu },
  'GraphQL': { mockupIcon: Network },
  'Python': { mockupIcon: Terminal },
  'Clerk': { mockupIcon: ShieldCheck },
  'NextAuth': { mockupIcon: KeyRound },
  'Supabase Auth': { logo: '/t_supabase-icon9119.logowik.com.png' },
  'OAuth 2.0': { mockupIcon: Lock },
  'JWT': { mockupIcon: Shield },
  'PostgreSQL': { mockupIcon: Database },
  'MongoDB': { logo: '/external-mongodb-a-cross-platform-document-oriented-database-program-logo-color-tal-revivo.png' },
  'Redis': { mockupIcon: HardDrive },
  'Prisma': { mockupIcon: Boxes },
  'Pinecone': { logo: '/t_pinecone-database4602.logowik.com.png' }
}

// 1. Initial size during selection & gliding to center (original size):
const INITIAL_HEXAGON_SCALE = 'scale-100'

// 2. Enlarged size for entering Title & Description textboxes:
const ENLARGED_HEXAGON_SCALE = 'scale-[1.8] sm:scale-[1.85]'

// 3. Third size (a little smaller than original) with Title in the center:
const FINAL_HEXAGON_SCALE = 'scale-[0.82] sm:scale-[0.70]'

// 4. Initial scale of the top-left hexagon before resizing to 1.0 (Adjust this value as needed):
const PRE_RESIZE_SCALE = 0.5

// Step 1 Centering & Fade Speed, Step 2 Scaling Speed:
const CENTERING_SPEED_MS = 600

export default function CreateProjectView({ onCreateProject }: CreateProjectViewProps) {
  const [selectedType, setSelectedType] = useState<'separate' | 'fullstack'>('separate')
  const [projectName, setProjectName] = useState('Decoupled Storehouse')
  const [projectDescription, setProjectDescription] = useState('')
  const [isConfirmed, setIsConfirmed] = useState(false) // Step 1: Fade out elements & glide to center
  const [isScaled, setIsScaled] = useState(false)       // Step 2: Scale up in center
  const [isContentFaded, setIsContentFaded] = useState(false) // Step 3: Fade out text after scale completes
  const [isSubmitted, setIsSubmitted] = useState(false)       // Step 4: Fade out form elements except project name
  const [isMovedRight, setIsMovedRight] = useState(false)     // Step 5: Glide small title hexagon to right side of screen
  const [isPushedOut, setIsPushedOut] = useState(false)       // Step 6a: Move outer small hexagons out to 6 sides
  const [isExpanded, setIsExpanded] = useState(false)         // Step 6b: Expand outer hexagons to full size

  // Draggable tech pill state
  const [draggedTech, setDraggedTech] = useState<{ name: string; category: string } | null>(null)
  const [dragPos, setDragPos] = useState<{ x: number; y: number } | null>(null)
  const [assignedTechs, setAssignedTechs] = useState<Record<string, string>>({})
  const [hoveredCellId, setHoveredCellId] = useState<string | null>(null)
  const [activeStepIndex, setActiveStepIndex] = useState<number>(0)
  const [slideDirection, setSlideDirection] = useState<'next' | 'prev'>('next')
  const [stepFadeStage, setStepFadeStage] = useState<'idle' | 'exiting' | 'entering'>('idle')
  const [isStackGenerated, setIsStackGenerated] = useState<boolean>(false)

  const handleStepChange = (targetStepIndex: number) => {
    if (targetStepIndex === activeStepIndex || stepFadeStage !== 'idle') return

    const direction = targetStepIndex > activeStepIndex ? 'next' : 'prev'
    setSlideDirection(direction)
    setStepFadeStage('exiting')

    setTimeout(() => {
      setActiveStepIndex(targetStepIndex)
      setStepFadeStage('entering')

      setTimeout(() => {
        setStepFadeStage('idle')
      }, 40)
    }, 180)
  }

  const handleStartDrag = (e: React.PointerEvent, name: string, category: string) => {
    e.preventDefault()
    setDraggedTech({ name, category })
    setDragPos({ x: e.clientX, y: e.clientY })
  }

  useEffect(() => {
    if (!draggedTech) return

    const handlePointerMove = (e: PointerEvent) => {
      setDragPos({ x: e.clientX, y: e.clientY })

      const targetEl = document.elementFromPoint(e.clientX, e.clientY)
      const cellId = targetEl?.closest('[data-cell-id]')?.getAttribute('data-cell-id')
      setHoveredCellId(cellId || null)
    }

    const handlePointerUp = (e: PointerEvent) => {
      const targetEl = document.elementFromPoint(e.clientX, e.clientY)
      const cellId = targetEl?.closest('[data-cell-id]')?.getAttribute('data-cell-id')

      if (cellId && draggedTech) {
        const targetNode = SURROUNDING_NODES.find((n) => n.id === cellId)
        const isFirst4Filled = Boolean(
          assignedTechs['top-left'] &&
          assignedTechs['top-right'] &&
          assignedTechs['left'] &&
          assignedTechs['right']
        )

        const isMatch = targetNode && (
          targetNode.category === draggedTech.category ||
          (targetNode.category === 'Extra Tech' && isFirst4Filled)
        )

        if (isMatch) {
          setAssignedTechs((prev) => ({
            ...prev,
            [cellId]: draggedTech.name
          }))
        }
      }

      setDraggedTech(null)
      setDragPos(null)
      setHoveredCellId(null)
    }

    window.addEventListener('pointermove', handlePointerMove)
    window.addEventListener('pointerup', handlePointerUp)

    return () => {
      window.removeEventListener('pointermove', handlePointerMove)
      window.removeEventListener('pointerup', handlePointerUp)
    }
  }, [draggedTech, assignedTechs])

  const handleSelectType = (type: 'separate' | 'fullstack') => {
    setSelectedType(type)
    setProjectName(type === 'separate' ? 'Decoupled Storehouse' : 'Fullstack Storehouse')
  }

  const handleContinue = () => {
    // Step 1: Simultaneously fade out surrounding elements & glide selected card to center
    setIsConfirmed(true)

    // Step 2: Scale up & glow after centering completes (550ms delay)
    setTimeout(() => {
      setIsScaled(true)
    }, CENTERING_SPEED_MS - 50)

    // Step 3: Fade out text & cell contents upwards AFTER scale animation completes (1050ms total delay)
    setTimeout(() => {
      setIsContentFaded(true)
    }, CENTERING_SPEED_MS + 450)
  }

  const handleResetAnimation = () => {
    setIsExpanded(false)
    setIsPushedOut(false)
    setIsMovedRight(false)
    setIsSubmitted(false)
    setIsContentFaded(false)
    setIsScaled(false)
    setIsConfirmed(false)
    setAssignedTechs({})
    setActiveStepIndex(0)
    setStepFadeStage('idle')
    setIsStackGenerated(false)
  }

  const handleFinishCreate = (e?: React.FormEvent) => {
    if (e) e.preventDefault()
    if (isSubmitted) return

    // Step 4: Fade away form elements inside the cell, leaving only the project name
    setIsSubmitted(true)

    // Step 5: Move hexagon to the right side of the screen after scaling down to small
    setTimeout(() => {
      setIsMovedRight(true)

      // Step 6a: Push out small hexagons to all 6 sides after arriving at the right side
      setTimeout(() => {
        setIsPushedOut(true)

        // Step 6b: Resize outer hexagons to full scale
        setTimeout(() => {
          setIsExpanded(true)
        }, 450)
      }, 600)
    }, 350)

    if (onCreateProject) {
      console.log('[TESTING MODE] Finished creation workflow for:', {
        name: projectName.trim() || (selectedType === 'separate' ? 'Decoupled Storehouse' : 'Fullstack Storehouse'),
        description: projectDescription.trim(),
        type: selectedType
      })
    }
  }

  const STEP_CATEGORIES = ['Frontend', 'Backend', 'Auth', 'Database']
  const STEP_NODE_KEYS = ['top-left', 'top-right', 'left', 'right']

  const currentCategory = STEP_CATEGORIES[activeStepIndex] || 'Frontend'
  const currentStepNodeKey = STEP_NODE_KEYS[activeStepIndex]
  const isCurrentStepFilled = currentStepNodeKey ? Boolean(assignedTechs[currentStepNodeKey]) : false

  const activeTechSection = TECH_SECTIONS.find(s => s.category === currentCategory) || TECH_SECTIONS[0]

  return (
    <div className="relative min-h-[75vh] w-full flex flex-col items-center justify-center py-6 px-4 overflow-x-clip">
      {/* Background Subtle Radial Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-indigo-500/5 blur-[120px] rounded-full pointer-events-none -z-10" />

      {/* Left-Side White Box (Spans top to bottom when outer cells push out) */}
      <div
        className={`absolute left-4 md:left-10 lg:left-14 top-6 bottom-6 md:top-8 md:bottom-8 w-[340px] sm:w-[400px] bg-white rounded-2xl border border-slate-200/90 p-5 sm:p-6 shadow-2xl shadow-slate-900/10 transition-all duration-700 ease-out z-30 flex flex-col justify-between ${
          isPushedOut
            ? 'opacity-100 translate-y-0'
            : 'opacity-0 translate-y-6 pointer-events-none'
        }`}
      >
        {/* Technology Stack Sections */}
        <div className="space-y-5 flex-1 flex flex-col min-h-0">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 shrink-0">
            <span className="text-xs font-black uppercase tracking-wider text-slate-400 font-mono">
              Technology Stack
            </span>
            <div className="flex items-center gap-1.5">
              {STEP_CATEGORIES.map((cat, idx) => {
                const isCurrent = activeStepIndex === idx
                const nodeKey = STEP_NODE_KEYS[idx]
                const isFilled = Boolean(assignedTechs[nodeKey])

                return (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => (isFilled || idx <= activeStepIndex) && handleStepChange(idx)}
                    className={`px-2.5 py-1 text-[10.5px] font-extrabold rounded-lg transition-all cursor-pointer ${
                      isCurrent
                        ? 'bg-indigo-600 text-white shadow-xs'
                        : isFilled
                        ? 'bg-indigo-50 text-indigo-700 hover:bg-indigo-100'
                        : 'bg-slate-100 text-slate-400 opacity-60'
                    }`}
                  >
                    {cat}
                  </button>
                )
              })}
            </div>
          </div>

          <div className="space-y-4 flex-1 overflow-y-auto pr-1 overflow-x-hidden">
            <div
              key={activeTechSection.category}
              className={`space-y-2 ${
                stepFadeStage === 'exiting'
                  ? slideDirection === 'next'
                    ? '-translate-x-14 opacity-0 transition-all duration-180 ease-in pointer-events-none'
                    : 'translate-x-14 opacity-0 transition-all duration-180 ease-in pointer-events-none'
                  : stepFadeStage === 'entering'
                  ? slideDirection === 'next'
                    ? 'translate-x-14 opacity-0 transition-none pointer-events-none'
                    : '-translate-x-14 opacity-0 transition-none pointer-events-none'
                  : 'translate-x-0 opacity-100 transition-all duration-250 ease-out'
              }`}
            >
              <div className="text-sm sm:text-base font-extrabold text-slate-800 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-indigo-500" />
                  <span>{activeTechSection.category} Technologies</span>
                </div>
                {isCurrentStepFilled && (
                  <span className="text-[10.5px] font-extrabold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200/80">
                    Selected: {assignedTechs[currentStepNodeKey]}
                  </span>
                )}
              </div>

              <div className="flex flex-wrap gap-3 pt-2">
                {activeTechSection.techs.map((tech) => {
                  const isAssigned = Object.values(assignedTechs).includes(tech)
                  const details = TECH_DETAILS[tech] || {}
                  const LogoImg = details.logo
                  const MockupIcon = details.mockupIcon || Layers

                  return (
                    <div
                      key={tech}
                      onPointerDown={(e) => handleStartDrag(e, tech, activeTechSection.category)}
                      className={`group relative w-[76px] h-[86px] sm:w-[82px] sm:h-[92px] flex flex-col items-center justify-center cursor-grab active:cursor-grabbing select-none transition-transform hover:scale-105 active:scale-95 shrink-0 ${
                        isAssigned ? 'opacity-90' : 'opacity-100'
                      }`}
                    >
                      <svg
                        viewBox="0 0 120 135"
                        className="absolute inset-0 w-full h-full overflow-visible transition-all duration-200"
                      >
                        <polygon
                          points="60,2.5 115,34 115,96 60,127.5 5,96 5,34"
                          fill={isAssigned ? '#e0e7ff' : '#ffffff'}
                          stroke={isAssigned ? '#6366f1' : '#cbd5e1'}
                          strokeWidth={isAssigned ? '3.5' : '1.8'}
                          className="group-hover:stroke-indigo-500 group-hover:drop-shadow-md transition-all"
                        />
                      </svg>

                      <div className="relative z-10 flex flex-col items-center justify-center text-center p-1.5 space-y-1">
                        {LogoImg ? (
                          <img src={LogoImg} alt={tech} className="w-6 h-6 object-contain" />
                        ) : (
                          <div className="w-6 h-6 rounded-lg bg-indigo-50 border border-indigo-100/80 text-indigo-600 flex items-center justify-center">
                            <MockupIcon className="w-3.5 h-3.5" />
                          </div>
                        )}
                        <span className="text-[10px] sm:text-[10.5px] font-extrabold text-slate-900 leading-tight max-w-[58px] truncate">
                          {tech}
                        </span>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          </div>

          {/* Step Navigation Bar (Previous & Next/Generate Buttons) */}
          {(activeStepIndex > 0 || isCurrentStepFilled) && (
            <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2.5 animate-fade-in">
              {activeStepIndex > 0 ? (
                <button
                  type="button"
                  onClick={() => handleStepChange(activeStepIndex - 1)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer shrink-0"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Previous</span>
                </button>
              ) : (
                <div />
              )}

              {isCurrentStepFilled && (
                activeStepIndex < 3 ? (
                  <button
                    type="button"
                    onClick={() => handleStepChange(activeStepIndex + 1)}
                    className="flex-1 py-2 px-4 bg-indigo-600 hover:bg-indigo-700 active:scale-95 text-white rounded-xl text-xs sm:text-sm font-extrabold shadow-lg shadow-indigo-600/30 transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <span>Next: {STEP_CATEGORIES[activeStepIndex + 1]}</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={() => {
                      setIsStackGenerated(true)
                      console.log('[PREVIEW MODE] Generate clicked - Stack configured without creating project:', {
                        name: projectName.trim() || (selectedType === 'separate' ? 'Decoupled Storehouse' : 'Fullstack Storehouse'),
                        description: projectDescription.trim(),
                        type: selectedType,
                        techs: assignedTechs
                      })
                    }}
                    className={`flex-1 py-2 px-4 text-white rounded-xl text-xs sm:text-sm font-black shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer ${
                      isStackGenerated
                        ? 'bg-emerald-600 shadow-emerald-600/30'
                        : 'bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 active:scale-95 shadow-indigo-600/35 hover:shadow-indigo-600/50 animate-pulse'
                    }`}
                  >
                    <Sparkles className="w-4 h-4" />
                    <span>{isStackGenerated ? 'Stack Ready!' : 'Generate'}</span>
                  </button>
                )
              )}
            </div>
          )}
        </div>
      </div>

      {/* Header (Step 1: Fades out & slides up simultaneously with centering) */}
      <div className={`text-center max-w-xl mx-auto space-y-2 mb-10 transition-all duration-600 ease-out ${
        isConfirmed ? 'opacity-0 -translate-y-6 pointer-events-none' : 'opacity-100 translate-y-0'
      }`}>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-display tracking-tight">
          Choose Your Project Setup
        </h2>
        <p className="text-xs sm:text-sm text-slate-500 max-w-md mx-auto">
          Select how you want to structure your repository and backend environment.
        </p>
      </div>

      {/* Hexagon Options Container */}
      <div className="flex flex-col md:flex-row items-center justify-center gap-8 md:gap-14 my-4 w-full max-w-4xl">
        {OPTIONS.map(({ type, title, desc, Icon }) => {
          const isSelected = selectedType === type
          const isUnselected = !isSelected

          let transformClasses = 'translate-x-0 translate-y-0 scale-100'

          // Determine hexagon scale for each phase:
          let currentScale = INITIAL_HEXAGON_SCALE
          if (isSubmitted) {
            currentScale = FINAL_HEXAGON_SCALE // Phase 3: Final title in center (little smaller than original)
          } else if (isScaled) {
            currentScale = ENLARGED_HEXAGON_SCALE // Phase 2: Form with title & description textboxes
          } else {
            currentScale = INITIAL_HEXAGON_SCALE // Phase 1: Selection & glide to center (original scale-100)
          }

          if (isConfirmed) {
            if (isSelected) {
              if (isMovedRight) {
                if (type === 'separate') {
                  // Left card moves to the right side of the screen
                  transformClasses = `translate-y-[180px] md:translate-y-0 md:translate-x-[450px] ${currentScale}`
                } else {
                  // Right card moves to the right side of the screen
                  transformClasses = `translate-y-[180px] md:translate-y-0 md:translate-x-[110px] ${currentScale}`
                }
              } else if (type === 'separate') {
                // Left card moves right to center
                transformClasses = `translate-y-[160px] md:translate-y-0 md:translate-x-[172px] ${currentScale}`
              } else {
                // Right card moves left to center
                transformClasses = `-translate-y-[160px] md:translate-y-0 md:-translate-x-[172px] ${currentScale}`
              }
            }
          }

          // Card Visibility & Z-Index
          const visibilityClasses = isConfirmed && isUnselected
            ? 'opacity-0 pointer-events-none'
            : 'opacity-100'

          const interactionClasses = isConfirmed
            ? isSelected ? 'z-20 cursor-default' : 'z-0 pointer-events-none'
            : 'z-10 cursor-pointer hover:-translate-y-1'

          return (
            <div
              key={type}
              onClick={() => !isConfirmed && handleSelectType(type)}
              className={`group relative flex flex-col items-center select-none shrink-0 transition-all ${
                isScaled ? 'duration-500' : 'duration-600'
              } ease-in-out ${visibilityClasses} ${interactionClasses} ${transformClasses}`}
            >
              <div className="relative w-64 h-72 sm:w-72 sm:h-80 flex items-center justify-center shrink-0">
                <svg
                  className={`absolute inset-0 w-full h-full overflow-visible transition-all duration-500 ease-in-out ${
                    isSelected ? (isScaled && !isSubmitted ? 'drop-shadow-[0_0_40px_rgba(99,102,241,0.65)]' : 'drop-shadow-[0_0_24px_rgba(99,102,241,0.45)]') : 'drop-shadow-md group-hover:drop-shadow-lg'
                  }`}
                  style={{ overflow: 'visible' }}
                  viewBox="0 0 240 270"
                  fill="none"
                >
                  {/* Behind Hexagons (Push out simultaneously to all 6 sides when title is submitted) */}
                  {isSelected && (() => {
                    const isFirstFourFilled = Boolean(
                      assignedTechs['top-left'] &&
                      assignedTechs['top-right'] &&
                      assignedTechs['left'] &&
                      assignedTechs['right']
                    )

                    const sortedNodes = [...SURROUNDING_NODES].sort((a, b) => {
                      const aAssigned = Boolean(assignedTechs[a.id])
                      const bAssigned = Boolean(assignedTechs[b.id])
                      const aHovered = hoveredCellId === a.id
                      const bHovered = hoveredCellId === b.id

                      const getWeight = (id: string, assigned: boolean, hovered: boolean) => {
                        if (hovered) return 3
                        if (assigned) return 2
                        const cat = SURROUNDING_NODES.find(n => n.id === id)?.category
                        const isComp = draggedTech
                          ? cat === 'Extra Tech' ? isFirstFourFilled : cat === draggedTech.category
                          : false
                        if (isComp) return 1
                        return 0
                      }

                      return getWeight(a.id, aAssigned, aHovered) - getWeight(b.id, bAssigned, bHovered)
                    })

                    return sortedNodes.map(({ id, label, category: nodeCategory, Icon: NodeIcon, dx, dy }) => {
                      const assignedTech = assignedTechs[id]
                      const isHoveredTarget = hoveredCellId === id
                      const isDraggingActive = Boolean(draggedTech)

                      const isCompatible = draggedTech
                        ? nodeCategory === 'Extra Tech'
                          ? isFirstFourFilled
                          : nodeCategory === draggedTech.category
                        : false

                      const isHoveredValid = isHoveredTarget && isCompatible
                      const isHoveredInvalid = isHoveredTarget && !isCompatible
                      const isTargetGlowing = isDraggingActive && isCompatible && !isHoveredTarget

                      const details = assignedTech ? TECH_DETAILS[assignedTech] : null
                      const AssignedLogo = details?.logo
                      const AssignedMockIcon = details?.mockupIcon || NodeIcon

                      return (
                        <g
                          key={id}
                          data-cell-id={id}
                          className="transition-all pointer-events-auto cursor-pointer"
                          style={{
                            transform: isExpanded
                              ? `translate(${dx}px, ${dy}px) scale(${isHoveredValid ? 1.1 : isHoveredInvalid ? 0.95 : isTargetGlowing ? 1.04 : 1})`
                              : isPushedOut
                              ? `translate(${dx}px, ${dy}px) scale(${PRE_RESIZE_SCALE})`
                              : `translate(0px, 0px) scale(${PRE_RESIZE_SCALE})`,
                            transformOrigin: '120px 131.5px',
                            opacity: isPushedOut ? (isDraggingActive && !isCompatible && !assignedTech ? 0.4 : 1) : 0,
                            transitionProperty: 'transform, opacity',
                            transitionDuration: isExpanded ? '300ms' : '450ms',
                            transitionTimingFunction: 'cubic-bezier(0.16, 1, 0.3, 1)'
                          }}
                        >
                          <polygon
                            points="120,5 230,68 230,195 120,258 10,195 10,68"
                            fill={
                              assignedTech
                                ? '#ffffff'
                                : isHoveredValid
                                ? '#e0e7ff'
                                : isHoveredInvalid
                                ? '#fef2f2'
                                : isTargetGlowing
                                ? '#f5f7ff'
                                : '#f1f5f9'
                            }
                            stroke={
                              assignedTech
                                ? '#6366f1'
                                : isHoveredValid
                                ? '#6366f1'
                                : isHoveredInvalid
                                ? '#ef4444'
                                : isTargetGlowing
                                ? '#818cf8'
                                : 'none'
                            }
                            strokeWidth={assignedTech ? '3.5' : isHoveredTarget ? '3' : isTargetGlowing ? '2.5' : '0'}
                            strokeDasharray={isHoveredValid && !assignedTech ? '6 4' : isHoveredInvalid ? '4 4' : isTargetGlowing ? '4 3' : undefined}
                            className={
                              assignedTech
                                ? 'drop-shadow-[0_0_18px_rgba(99,102,241,0.35)]'
                                : isHoveredValid
                                ? 'drop-shadow-md'
                                : isHoveredInvalid
                                ? 'drop-shadow-sm'
                                : isTargetGlowing
                                ? 'drop-shadow-[0_0_14px_rgba(99,102,241,0.45)]'
                                : 'drop-shadow-sm'
                            }
                          />
                          <foreignObject x="30" y="55" width="180" height="160">
                            <div className="w-full h-full flex flex-col items-center justify-center text-center p-2 space-y-1 select-none">
                              <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${
                                assignedTech
                                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                                  : isHoveredValid
                                  ? 'bg-indigo-100 text-indigo-600'
                                  : isHoveredInvalid
                                  ? 'bg-red-100 text-red-500'
                                  : isTargetGlowing
                                  ? 'bg-indigo-100/90 text-indigo-600 shadow-xs'
                                  : 'bg-slate-200/70 text-slate-400'
                              }`}>
                                {assignedTech && AssignedLogo ? (
                                  <img src={AssignedLogo} alt={assignedTech} className="w-5 h-5 object-contain" />
                                ) : (
                                  <AssignedMockIcon className="w-5 h-5" />
                                )}
                              </div>
                              <span className={`text-[11px] tracking-tight ${
                                assignedTech
                                  ? 'font-extrabold text-slate-900'
                                  : isHoveredInvalid
                                  ? 'font-bold text-red-500'
                                  : isTargetGlowing
                                  ? 'font-extrabold text-indigo-600'
                                  : 'font-semibold text-slate-400'
                              }`}>
                                {assignedTech || (isHoveredInvalid ? (nodeCategory === 'Extra Tech' && !isFirstFourFilled ? 'Fill 4 Primary Layers' : 'Mismatched Layer') : label)}
                              </span>
                              {assignedTech ? (
                                <span className="text-[9px] font-bold text-indigo-600 bg-indigo-50 px-1.5 py-0.2 rounded border border-indigo-100 uppercase font-mono">
                                  {label}
                                </span>
                              ) : isTargetGlowing ? (
                                <span className="text-[8.5px] font-extrabold text-indigo-500 tracking-wider uppercase font-mono animate-pulse">
                                  Drop Here
                                </span>
                              ) : null}
                            </div>
                          </foreignObject>
                        </g>
                      )
                    })
                  })()}

                  {/* Main Hexagon */}
                  <polygon
                    points="120,5 230,68 230,195 120,258 10,195 10,68"
                    fill="#ffffff"
                    stroke={isSelected ? '#6366f1' : '#e2e8f0'}
                    strokeWidth={isSelected ? (isScaled && !isSubmitted ? '5' : '4') : '2'}
                    className="transition-all duration-300 group-hover:stroke-indigo-400"
                  />
                </svg>

                {/* Initial Cell Content (Fades Out Upward) */}
                <div className={`relative z-10 flex flex-col items-center text-center p-6 space-y-3 max-w-[200px] transition-all duration-500 ease-out ${
                  isSelected && isContentFaded ? 'opacity-0 -translate-y-10 pointer-events-none' : 'opacity-100 translate-y-0'
                }`}>
                  <div className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-all duration-300 shadow-md ${
                    isSelected ? 'bg-indigo-600 text-white shadow-indigo-600/30 scale-110' : 'bg-indigo-50 text-indigo-600 group-hover:bg-indigo-100 group-hover:scale-105'
                  }`}>
                    <Icon className="w-7 h-7" />
                  </div>
                  <h3 className={`text-base font-bold transition-colors duration-300 ${isSelected ? 'text-indigo-600' : 'text-slate-900 group-hover:text-indigo-600'}`}>
                    {title}
                  </h3>
                  <p className="text-[11px] leading-relaxed text-slate-500">{desc}</p>
                </div>

                {/* Name & Description Form (Fades In From Below Upward, Fades Out on Submit) */}
                {isSelected && (
                  <form
                    onSubmit={handleFinishCreate}
                    className={`absolute z-20 flex flex-col items-center text-center px-1 w-[168px] space-y-1.5 transition-all duration-500 ease-out ${
                      isContentFaded && !isSubmitted ? 'opacity-100 translate-y-0 pointer-events-auto' : 'opacity-0 translate-y-8 pointer-events-none'
                    }`}
                  >
                    <div className="w-full text-left space-y-0.5">
                      <label className="text-[9px] font-extrabold text-slate-600 uppercase tracking-wider block pl-0.5">
                        Project Name
                      </label>
                      <input
                        type="text"
                        value={projectName}
                        onChange={(e) => setProjectName(e.target.value)}
                        placeholder="e.g. My Storehouse"
                        className="w-full text-[10.5px] px-2.5 py-1 rounded-md border border-slate-200 bg-slate-50/90 focus:bg-white focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/30 outline-none text-slate-800 font-semibold transition-all shadow-inner"
                      />
                    </div>

                    <div className="w-full text-left space-y-0.5">
                      <label className="text-[9px] font-extrabold text-slate-600 uppercase tracking-wider block pl-0.5">
                        Description
                      </label>
                      <textarea
                        rows={3}
                        value={projectDescription}
                        onChange={(e) => setProjectDescription(e.target.value)}
                        placeholder="What are you building?"
                        className="w-full text-[10px] px-2.5 py-1 rounded-md border border-slate-200 bg-slate-50/90 focus:bg-white focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/30 outline-none text-slate-700 resize-none transition-all shadow-inner leading-relaxed"
                      />
                    </div>

                    <button
                      type="submit"
                      className="mt-0.5 bg-indigo-600 hover:bg-indigo-700 active:scale-95 text-white rounded-md px-5 py-1 text-[10px] font-bold shadow-sm shadow-indigo-600/30 transition-all flex items-center justify-center gap-1 cursor-pointer"
                    >
                      <span>Create</span>
                      <ArrowRight className="w-2.5 h-2.5" />
                    </button>
                  </form>
                )}

                {/* Final Project Title Display (Fades In after Create is clicked) */}
                {isSelected && (
                  <div
                    className={`absolute z-30 flex flex-col items-center justify-center text-center px-4 max-w-[170px] transition-all duration-500 ease-out ${
                      isSubmitted ? 'opacity-100 scale-100' : 'opacity-0 scale-90 pointer-events-none'
                    }`}
                  >
                    <h3 className="text-base sm:text-[40px] font-bold text-slate-900 leading-snug tracking-tight font-display drop-shadow-sm">
                      {projectName.trim() || (selectedType === 'separate' ? 'Decoupled Storehouse' : 'Fullstack Storehouse')}
                    </h3>
                  </div>
                )}
              </div>
            </div>
          )
        })}
      </div>

      {/* Action Footer (Step 1: Fades out & slides down simultaneously with centering) */}
      <div className={`w-full max-w-md mt-6 flex justify-center items-center transition-all duration-600 ease-out ${
        isConfirmed ? 'opacity-0 translate-y-6 pointer-events-none' : 'opacity-100 translate-y-0'
      }`}>
        <button
          type="button"
          onClick={handleContinue}
          className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl px-6 py-2.5 text-xs font-semibold shadow-md shadow-indigo-600/20 hover:shadow-lg transition-all flex items-center gap-2 cursor-pointer"
        >
          <span>Continue with {selectedType === 'separate' ? 'Separate' : 'Fullstack'}</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>

      {/* Replay/Reset Controller when Submitted */}
      {isSubmitted && (
        <div className="mt-8 flex items-center justify-center z-30 animate-fade-in">
          <button
            type="button"
            onClick={handleResetAnimation}
            className="px-4 py-2 bg-slate-900/5 hover:bg-slate-900/10 text-slate-600 hover:text-slate-900 border border-slate-200/80 rounded-xl text-xs font-semibold transition-all shadow-sm flex items-center gap-2 cursor-pointer"
          >
            <span>Reset & Replay Animation</span>
          </button>
        </div>
      )}

      {/* Floating Dragged Hexagon Preview */}
      {draggedTech && dragPos && (() => {
        const hoveredNode = hoveredCellId ? SURROUNDING_NODES.find(n => n.id === hoveredCellId) : null
        const isHoveredInvalid = hoveredNode && (hoveredNode.category !== draggedTech.category && hoveredNode.category !== 'Extra Tech')
        const details = TECH_DETAILS[draggedTech.name] || {}
        const LogoImg = details.logo
        const MockupIcon = details.mockupIcon || Layers

        return (
          <div
            className="fixed pointer-events-none z-50 -translate-x-1/2 -translate-y-1/2 select-none"
            style={{ left: dragPos.x, top: dragPos.y }}
          >
            <div className="relative w-24 h-28 flex items-center justify-center">
              <svg
                viewBox="0 0 120 135"
                className={`w-full h-full overflow-visible ${
                  isHoveredInvalid
                    ? 'drop-shadow-[0_10px_25px_rgba(239,68,68,0.5)]'
                    : 'drop-shadow-[0_10px_25px_rgba(99,102,241,0.55)]'
                }`}
              >
                <polygon
                  points="60,2.5 115,34 115,96 60,127.5 5,96 5,34"
                  fill="#ffffff"
                  stroke={isHoveredInvalid ? '#ef4444' : '#6366f1'}
                  strokeWidth="4"
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center p-2 text-center pointer-events-none space-y-1">
                {LogoImg ? (
                  <img src={LogoImg} alt={draggedTech.name} className="w-6 h-6 object-contain" />
                ) : (
                  <div className={`w-6 h-6 rounded-lg flex items-center justify-center ${
                    isHoveredInvalid ? 'bg-red-50 text-red-500' : 'bg-indigo-50 text-indigo-600'
                  }`}>
                    <MockupIcon className="w-4 h-4" />
                  </div>
                )}
                <span className="text-[10.5px] font-extrabold text-slate-900 leading-tight max-w-[80px] break-words">
                  {draggedTech.name}
                </span>
                <span className={`text-[7.5px] font-extrabold uppercase tracking-wider font-mono ${
                  isHoveredInvalid ? 'text-red-500' : 'text-indigo-500'
                }`}>
                  {draggedTech.category}
                </span>
              </div>
            </div>
          </div>
        )
      })()}
    </div>
  )
}
