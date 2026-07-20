import React, { useState } from 'react'
import { Layers, Cpu, ArrowRight } from 'lucide-react'

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

// 1. Initial size during selection & gliding to center (original size):
const INITIAL_HEXAGON_SCALE = 'scale-100'

// 2. Enlarged size for entering Title & Description textboxes:
const ENLARGED_HEXAGON_SCALE = 'scale-[1.8] sm:scale-[1.85]'

// 3. Third size (a little smaller than original) with Title in the center:
const FINAL_HEXAGON_SCALE = 'scale-[0.82] sm:scale-[0.85]'

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
    setIsSubmitted(false)
    setIsContentFaded(false)
    setIsScaled(false)
    setIsConfirmed(false)
  }

  const handleFinishCreate = (e?: React.FormEvent) => {
    if (e) e.preventDefault()
    if (isSubmitted) return

    // Step 4: Fade away form elements inside the cell, leaving only the project name (Testing mode active)
    setIsSubmitted(true)

    if (onCreateProject) {
      console.log('[TESTING MODE] Finished creation workflow for:', {
        name: projectName.trim() || (selectedType === 'separate' ? 'Decoupled Storehouse' : 'Fullstack Storehouse'),
        description: projectDescription.trim(),
        type: selectedType
      })
    }
  }

  return (
    <div className="relative min-h-[75vh] w-full flex flex-col items-center justify-center py-6 px-4 overflow-x-clip">
      {/* Background Subtle Radial Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-indigo-500/5 blur-[120px] rounded-full pointer-events-none -z-10" />

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
              if (type === 'separate') {
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
    </div>
  )
}
