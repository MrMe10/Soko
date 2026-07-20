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

// Adjust ONLY the size of the single hexagon after pressing Continue here:
const CONFIRMED_HEXAGON_SCALE = 'scale-175 sm:scale-175'

// Step 1 Centering & Fade Speed, Step 2 Scaling Speed:
const CENTERING_SPEED_MS = 600

export default function CreateProjectView({ onCreateProject }: CreateProjectViewProps) {
  const [selectedType, setSelectedType] = useState<'separate' | 'fullstack'>('separate')
  const [isConfirmed, setIsConfirmed] = useState(false) // Step 1: Fade out elements & glide to center
  const [isScaled, setIsScaled] = useState(false)       // Step 2: Scale up in center

  const handleContinue = () => {
    // Step 1: Simultaneously fade out surrounding elements & glide selected card to center
    setIsConfirmed(true)

    // Step 2: Scale up & glow after centering completes (550ms delay)
    setTimeout(() => {
      setIsScaled(true)
    }, CENTERING_SPEED_MS - 50)
  }

  const handleFinishCreate = () => {
    onCreateProject({
      name: selectedType === 'separate' ? 'Decoupled Storehouse' : 'Fullstack Storehouse',
      description: '',
      type: selectedType
    })
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

          // Calculate precise GPU transform translation to dead center
          let transformClasses = 'translate-x-0 translate-y-0 scale-100'

          if (isConfirmed) {
            if (isSelected) {
              if (type === 'separate') {
                // Left card moves right to center
                transformClasses = `translate-y-[160px] md:translate-y-0 md:translate-x-[172px] ${
                  isScaled ? CONFIRMED_HEXAGON_SCALE : 'scale-100'
                }`
              } else {
                // Right card moves left to center
                transformClasses = `-translate-y-[160px] md:translate-y-0 md:-translate-x-[172px] ${
                  isScaled ? CONFIRMED_HEXAGON_SCALE : 'scale-100'
                }`
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
              onClick={() => !isConfirmed && setSelectedType(type)}
              className={`group relative flex flex-col items-center select-none shrink-0 transition-all ${
                isScaled ? 'duration-500' : 'duration-600'
              } ease-in-out ${visibilityClasses} ${interactionClasses} ${transformClasses}`}
            >
              <div className="relative w-64 h-72 sm:w-72 sm:h-80 flex items-center justify-center shrink-0">
                <svg
                  className={`absolute inset-0 w-full h-full overflow-visible transition-all duration-500 ease-in-out ${
                    isSelected ? (isScaled ? 'drop-shadow-[0_0_40px_rgba(99,102,241,0.65)]' : 'drop-shadow-[0_0_24px_rgba(99,102,241,0.45)]') : 'drop-shadow-md group-hover:drop-shadow-lg'
                  }`}
                  style={{ overflow: 'visible' }}
                  viewBox="0 0 240 270"
                  fill="none"
                >
                  <polygon
                    points="120,5 230,68 230,195 120,258 10,195 10,68"
                    fill="#ffffff"
                    stroke={isSelected ? '#6366f1' : '#e2e8f0'}
                    strokeWidth={isSelected ? (isScaled ? '5' : '4') : '2'}
                    className="transition-all duration-300 group-hover:stroke-indigo-400"
                  />
                </svg>

                <div className="relative z-10 flex flex-col items-center text-center p-6 space-y-3 max-w-[200px]">
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
