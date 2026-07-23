/**
 * TechStackDrawer.tsx
 * -------------------
 * Stage 3 component: Renders the left-side technology selection drawer card with category step tabs
 * (Frontend, Backend, Auth, Database), draggable tech tiles, and step navigation buttons.
 */

import React from 'react'
import { Layers, ArrowRight, ArrowLeft, Sparkles } from 'lucide-react'
import {
  STEP_CATEGORIES,
  STEP_NODE_KEYS,
  TECH_SECTIONS,
  TECH_DETAILS
} from './createProjectData'

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
  projectName: string
  projectDescription: string
  selectedType: 'separate' | 'fullstack'
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
  projectName,
  projectDescription,
  selectedType,
  onStepChange,
  onStartDrag,
  onGenerate
}) => {
  const currentCategory = STEP_CATEGORIES[activeStepIndex] || 'Frontend'
  const currentStepNodeKey = STEP_NODE_KEYS[activeStepIndex]
  const isCurrentStepFilled = currentStepNodeKey ? Boolean(assignedTechs[currentStepNodeKey]) : false
  const activeTechSection = TECH_SECTIONS.find((s) => s.category === currentCategory) || TECH_SECTIONS[0]

  return (
    <div
      className={`absolute left-4 md:left-10 lg:left-14 top-6 bottom-6 md:top-8 md:bottom-8 w-[340px] sm:w-[400px] bg-white rounded-2xl border border-slate-200/90 p-5 sm:p-6 shadow-2xl shadow-slate-900/10 transition-all duration-700 ease-out z-30 flex flex-col justify-between ${
        isStackGenerated
          ? '-translate-x-32 opacity-0 pointer-events-none'
          : isPushedOut
          ? 'opacity-100 translate-x-0 translate-y-0'
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
                  onClick={() => (isFilled || idx <= activeStepIndex || idx <= maxStepReached) && onStepChange(idx)}
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
                const isBeingDragged = draggedTech?.name === tech
                const isReturning = returningTech?.name === tech
                const isUnavailable = isAssigned || isBeingDragged || isReturning
                const details = TECH_DETAILS[tech] || {}
                const LogoImg = details.logo
                const MockupIcon = details.mockupIcon || Layers

                return (
                  <div
                    key={tech}
                    data-tech-tile={tech}
                    onPointerDown={(e) => !isUnavailable && onStartDrag(e, tech, activeTechSection.category)}
                    className={`group relative w-[76px] h-[86px] sm:w-[82px] sm:h-[92px] flex flex-col items-center justify-center select-none transition-transform duration-200 shrink-0 ${
                      isUnavailable
                        ? 'opacity-40 cursor-not-allowed pointer-events-none'
                        : 'cursor-grab active:cursor-grabbing hover:scale-105 active:scale-95 opacity-100'
                    }`}
                  >
                    <svg viewBox="0 0 120 135" className="absolute inset-0 w-full h-full overflow-visible">
                      <polygon
                        points="60,2.5 115,34 115,96 60,127.5 5,96 5,34"
                        fill={isUnavailable ? '#f1f5f9' : '#ffffff'}
                        stroke={isUnavailable ? '#cbd5e1' : '#cbd5e1'}
                        strokeWidth={isUnavailable ? '1.5' : '1.8'}
                        strokeDasharray={isUnavailable ? '4 3' : undefined}
                        className={isUnavailable ? '' : 'group-hover:stroke-indigo-500 group-hover:drop-shadow-md transition-colors'}
                      />
                    </svg>

                    <div className="relative z-10 flex flex-col items-center justify-center text-center p-1.5 space-y-1">
                      {LogoImg ? (
                        <img
                          src={LogoImg}
                          alt={tech}
                          className={`w-6 h-6 object-contain transition-all ${isUnavailable ? 'opacity-40 grayscale' : ''}`}
                        />
                      ) : (
                        <div
                          className={`w-6 h-6 rounded-lg flex items-center justify-center transition-all ${
                            isUnavailable
                              ? 'bg-slate-100 border border-slate-200 text-slate-400'
                              : 'bg-indigo-50 border border-indigo-100/80 text-indigo-600'
                          }`}
                        >
                          <MockupIcon className="w-3.5 h-3.5" />
                        </div>
                      )}
                      <span
                        className={`text-[10px] sm:text-[10.5px] leading-tight max-w-[58px] truncate ${
                          isUnavailable ? 'font-bold text-slate-400' : 'font-extrabold text-slate-900'
                        }`}
                      >
                        {tech}
                      </span>
                      {isUnavailable && (
                        <span className="text-[8px] font-extrabold uppercase font-mono text-slate-400 tracking-wider">
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
          <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2.5 animate-fade-in">
            {activeStepIndex > 0 ? (
              <button
                type="button"
                onClick={() => onStepChange(activeStepIndex - 1)}
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
                activeStepIndex < maxStepReached ? (
                  <button
                    type="button"
                    onClick={() => onStepChange(activeStepIndex + 1)}
                    className="flex-1 py-2 px-4 bg-indigo-600 hover:bg-indigo-700 active:scale-95 text-white rounded-xl text-xs sm:text-sm font-extrabold shadow-lg shadow-indigo-600/30 transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <span>Next: {STEP_CATEGORIES[activeStepIndex + 1]}</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                ) : null
              ) : (
                <button
                  type="button"
                  onClick={onGenerate}
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
  )
}

export default TechStackDrawer
