/**
 * TechStackDrawer.tsx
 * -------------------
 * Stage 3 component: Renders the left-side technology selection drawer card with category step tabs
 * (Frontend, Backend, Auth, Database), draggable tech tiles, and step navigation buttons.
 */

import React from 'react'
import { ArrowRight, ArrowLeft, Sparkles } from 'lucide-react'
import {
  getStepCategories,
  getStepNodeKeys,
  getTechSections,
  getTechDetails,
  PREVIEW_HEX_POINTS
} from './createProjectData'
import type { ArchitectureType } from './createProjectData'

interface TechStackDrawerProps {
  isStackGenerated: boolean
  isPushedOut: boolean
  activeStepIndex: number
  maxStepReached: number
  stepFadeStage: 'idle' | 'exiting' | 'entering'
  slideDirection: 'next' | 'prev'
  assignedTechs: Record<string, string>
  draggedTech: { name: string; category: string } | null
  returningTech: { name: string; category: string } | null
  selectedType: ArchitectureType
  onStepChange: (index: number) => void
  onStartDrag: (e: React.PointerEvent, name: string, category: string) => void
  onGenerate: () => void
}

export const TechStackDrawer: React.FC<TechStackDrawerProps> = ({
  isStackGenerated,
  isPushedOut,
  activeStepIndex,
  maxStepReached,
  stepFadeStage,
  slideDirection,
  assignedTechs,
  draggedTech,
  returningTech,
  selectedType,
  onStepChange,
  onStartDrag,
  onGenerate
}) => {
  const stepCategories = getStepCategories(selectedType)
  const stepNodeKeys = getStepNodeKeys(selectedType)
  const techSections = getTechSections(selectedType)

  const currentCategory = stepCategories[activeStepIndex] || stepCategories[0]
  const currentStepNodeKey = stepNodeKeys[activeStepIndex]
  const isCurrentStepFilled = currentStepNodeKey ? Boolean(assignedTechs[currentStepNodeKey]) : false
  const activeTechSection = techSections.find((s) => s.category === currentCategory) || techSections[0]

  return (
    <div
      className={`absolute left-4 md:left-10 lg:left-14 top-6 bottom-6 md:top-8 md:bottom-8 w-[360px] sm:w-[440px] bg-zinc-900/95 rounded-2xl border border-zinc-800 p-5 sm:p-6 shadow-2xl shadow-black/90 transition-all duration-700 ease-out z-30 flex flex-col justify-between ${
        isStackGenerated
          ? '-translate-x-32 opacity-0 pointer-events-none'
          : isPushedOut
          ? 'opacity-100 translate-x-0 translate-y-0'
          : 'opacity-0 translate-y-6 pointer-events-none'
      }`}
    >
      {/* Technology Stack Sections */}
      <div className="space-y-5 flex-1 flex flex-col min-h-0">
        <div className="pb-3 border-b border-zinc-800 shrink-0 space-y-2.5">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-black uppercase tracking-wider text-zinc-400 font-mono whitespace-nowrap">
              Technology Stack
            </span>
            <span className="text-[10.5px] font-extrabold text-emerald-400 bg-emerald-950/80 px-2.5 py-0.5 rounded-full font-mono border border-emerald-800/80">
              Step {activeStepIndex + 1} of {stepCategories.length}
            </span>
          </div>

          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar scrollbar-none py-0.5 -mx-1 px-1">
            {stepCategories.map((cat, idx) => {
              const isCurrent = activeStepIndex === idx
              const nodeKey = stepNodeKeys[idx]
              const isFilled = Boolean(assignedTechs[nodeKey])
              const displayLabel = cat === 'Email Service' ? 'Email' : cat === 'Fullstack Framework' ? 'Fullstack' : cat

              return (
                <button
                  key={cat}
                  type="button"
                  onClick={() => (isFilled || idx <= activeStepIndex || idx <= maxStepReached) && onStepChange(idx)}
                  className={`px-2.5 py-1 text-[10.5px] font-extrabold rounded-lg transition-all cursor-pointer whitespace-nowrap shrink-0 ${
                    isCurrent
                      ? 'bg-emerald-500 text-black shadow-xs font-black'
                      : isFilled
                      ? 'bg-emerald-950/70 text-emerald-400 hover:bg-emerald-900/60 border border-emerald-800/60'
                      : 'bg-zinc-800/60 text-zinc-500'
                  }`}
                >
                  {displayLabel}
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
                : 'translate-x-0 opacity-100 transition-all duration-250 ease-out'
            }`}
          >
            <div className="text-sm sm:text-base font-extrabold text-white flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-500" />
                <span>{activeTechSection.category} Technologies</span>
              </div>
              {isCurrentStepFilled && (
                <span className="text-[10.5px] font-extrabold text-emerald-400 bg-emerald-950/80 px-2 py-0.5 rounded-md border border-emerald-800/80">
                  Selected: {assignedTechs[currentStepNodeKey]}
                </span>
              )}
            </div>

            <div className="flex flex-wrap gap-3 pt-2">
              {activeTechSection.techs.map((tech) => {
                const isAssigned = Object.values(assignedTechs).includes(tech)
                const isBeingDragged = draggedTech?.name === tech
                const isReturning = returningTech?.name === tech
                const isUnavailable = isAssigned || isBeingDragged || isReturning
                const details = getTechDetails(tech)
                const LogoImg = details.logo
                const MockupIcon = details.mockupIcon

                return (
                  <div
                    key={tech}
                    data-tech-tile={tech}
                    onPointerDown={(e) => !isUnavailable && onStartDrag(e, tech, activeTechSection.category)}
                    className={`group relative w-[86px] h-[96px] sm:w-[94px] sm:h-[104px] flex flex-col items-center justify-center select-none transition-transform duration-200 shrink-0 ${
                      isUnavailable
                        ? 'opacity-40 cursor-not-allowed pointer-events-none'
                        : 'cursor-grab active:cursor-grabbing hover:scale-105 active:scale-95 opacity-100'
                    }`}
                  >
                    <svg viewBox="0 0 120 135" className="absolute inset-0 w-full h-full overflow-visible">
                      <polygon
                        points={PREVIEW_HEX_POINTS}
                        fill={isUnavailable ? '#18181b' : '#0f1311'}
                        stroke={isUnavailable ? '#27272a' : '#27272a'}
                        strokeWidth={isUnavailable ? '1.5' : '1.8'}
                        strokeDasharray={isUnavailable ? '4 3' : undefined}
                        className={isUnavailable ? '' : 'group-hover:stroke-emerald-400 group-hover:drop-shadow-md transition-colors'}
                      />
                    </svg>

                    <div className="relative z-10 flex flex-col items-center justify-center text-center p-1.5 space-y-1">
                      {LogoImg ? (
                        <img
                          src={LogoImg}
                          alt={tech}
                          className={`w-9 h-9 object-contain transition-all ${isUnavailable ? 'opacity-40 grayscale' : ''}`}
                        />
                      ) : (
                        <div
                          className={`w-9 h-9 rounded-xl flex items-center justify-center transition-all ${
                            isUnavailable
                              ? 'bg-zinc-900 border border-zinc-800 text-zinc-600'
                              : 'bg-zinc-800 border border-zinc-700 text-emerald-400'
                          }`}
                        >
                          {MockupIcon && <MockupIcon className="w-5 h-5" />}
                        </div>
                      )}
                      <span
                        className={`text-[10px] sm:text-[10.5px] leading-tight max-w-[74px] sm:max-w-[80px] text-center line-clamp-2 break-words ${
                          isUnavailable ? 'font-bold text-zinc-600' : 'font-extrabold text-zinc-100'
                        }`}
                      >
                        {tech}
                      </span>
                      {isUnavailable && (
                        <span className="text-[8.5px] font-extrabold uppercase font-mono text-zinc-500 tracking-wider">
                          {isAssigned ? 'Picked' : 'Dragging'}
                        </span>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>

        {/* Step Navigation Bar (Previous & Next/Generate Buttons) */}
        {(activeStepIndex > 0 || isCurrentStepFilled) && (
          <div className="pt-3 border-t border-zinc-800 flex items-center justify-between gap-2.5 animate-fade-in">
            {activeStepIndex > 0 ? (
              <button
                type="button"
                onClick={() => onStepChange(activeStepIndex - 1)}
                className="px-4 py-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 border border-zinc-700 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer shrink-0 active:scale-95"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Previous</span>
              </button>
            ) : (
              <div />
            )}

            {isCurrentStepFilled && (
              activeStepIndex < stepCategories.length - 1 ? (
                activeStepIndex < maxStepReached ? (
                  <button
                    type="button"
                    onClick={() => onStepChange(activeStepIndex + 1)}
                    className="flex-1 py-2 px-4 bg-emerald-500 hover:bg-emerald-400 active:scale-95 text-black rounded-xl text-xs sm:text-sm font-extrabold shadow-lg shadow-emerald-500/25 transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <span>Next: {stepCategories[activeStepIndex + 1] === 'Fullstack Framework' ? 'Fullstack' : stepCategories[activeStepIndex + 1]}</span>
                    <ArrowRight className="w-4 h-4 text-black" />
                  </button>
                ) : null
              ) : (
                <button
                  type="button"
                  onClick={onGenerate}
                  className={`flex-1 py-2 px-4 text-black rounded-xl text-xs sm:text-sm font-black shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer ${
                    isStackGenerated
                      ? 'bg-emerald-400 shadow-emerald-500/30'
                      : 'bg-gradient-to-r from-emerald-500 to-green-400 hover:from-emerald-400 hover:to-green-300 active:scale-95 shadow-emerald-500/30 hover:shadow-emerald-500/50 animate-pulse'
                  }`}
                >
                  <Sparkles className="w-4 h-4 text-black" />
                  <span>{isStackGenerated ? 'Stack Ready!' : 'Generate'}</span>
                </button>
              )
            )}
          </div>
        )}
      </div>
    </div>
  )
}

export default TechStackDrawer
