/**
 * BuildingStatusOverlay.tsx
 * -------------------------
 * Stage 4 component: Renders environment synthesis status messages, progress indicator, launch project button,
 * AI setup roadmap generator modal launcher, and reset animation controller.
 */

import React, { useState } from 'react'
import { ArrowRight, CheckCircle2, Sparkles } from 'lucide-react'
import { LOADING_MESSAGES } from './createProjectData'
import AIRoadmapModal from './AIRoadmapModal'

interface BuildingStatusOverlayProps {
  isStackShrunk: boolean
  isSubmitted: boolean
  loadingMessageIndex: number
  isBuildComplete: boolean
  onResetAnimation: () => void
  onCompleteProject: () => void
  projectName?: string
  projectDescription?: string
  selectedType?: 'separate' | 'fullstack'
  assignedTechs?: Record<string, string>
}

export const BuildingStatusOverlay: React.FC<BuildingStatusOverlayProps> = ({
  isStackShrunk,
  isSubmitted,
  loadingMessageIndex,
  isBuildComplete,
  onResetAnimation,
  onCompleteProject,
  projectName = 'Decoupled Storehouse',
  projectDescription = '',
  selectedType = 'separate',
  assignedTechs = {}
}) => {
  const [showRoadmapModal, setShowRoadmapModal] = useState(false)

  return (
    <>
      {/* Small Dynamic Loading Status Text Right Below Micro-Icon (Unscaled 100%) */}
      {isStackShrunk && (
        <div className="absolute top-[56%] sm:top-[57%] left-1/2 -translate-x-1/2 flex flex-col items-center justify-center text-center space-y-2.5 w-full max-w-sm z-40 pointer-events-auto transition-all duration-500 ease-out animate-fade-in px-4">
          {isBuildComplete ? (
            <div className="space-y-3 flex flex-col items-center animate-fade-in">
              <div className="flex items-center gap-2 text-emerald-600 font-extrabold text-sm sm:text-base font-mono">
                <CheckCircle2 className="w-5 h-5 text-emerald-500 animate-bounce" />
                <span>Environment Ready & Synthesized!</span>
              </div>

              <div className="flex items-center gap-2 flex-wrap justify-center pt-1">
                {/* Finish & Return Button */}
                <button
                  type="button"
                  onClick={onCompleteProject}
                  className="bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white px-5 py-2.5 rounded-xl font-black text-xs sm:text-sm shadow-lg shadow-emerald-600/30 transition-all flex items-center gap-2 cursor-pointer"
                >
                  <span>Finish & Return</span>
                  <ArrowRight className="w-4 h-4" />
                </button>

                {/* Generate AI Roadmap Button */}
                <button
                  type="button"
                  onClick={() => setShowRoadmapModal(true)}
                  className="bg-indigo-600 hover:bg-indigo-700 active:scale-95 text-white px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm shadow-lg shadow-indigo-600/25 transition-all flex items-center gap-2 cursor-pointer"
                >
                  <Sparkles className="w-4 h-4 text-indigo-200" />
                  <span>Generate AI Roadmap</span>
                </button>
              </div>
            </div>
          ) : (
            <>
              <p
                key={loadingMessageIndex}
                className="text-xs sm:text-sm font-extrabold text-slate-800 font-mono tracking-tight animate-fade-in transition-all duration-300"
              >
                {LOADING_MESSAGES[loadingMessageIndex]}
              </p>
              <div className="flex items-center gap-1.5 pt-0.5">
                <span className="w-1.5 h-1.5 rounded-full bg-indigo-600 animate-ping shrink-0" />
                <span className="text-[10px] font-extrabold text-indigo-600 uppercase tracking-widest font-mono">
                  Building Environment ({Math.min(100, Math.round(((loadingMessageIndex + 1) / LOADING_MESSAGES.length) * 100))}%)
                </span>
              </div>
            </>
          )}
        </div>
      )}

      {/* Replay/Reset Controller when Submitted */}
      {isSubmitted && (
        <div className="mt-8 flex items-center justify-center z-30 animate-fade-in gap-3">
          <button
            type="button"
            onClick={onResetAnimation}
            className="px-4 py-2 bg-slate-900/5 hover:bg-slate-900/10 text-slate-600 hover:text-slate-900 border border-slate-200/80 rounded-xl text-xs font-semibold transition-all shadow-sm flex items-center gap-2 cursor-pointer"
          >
            <span>Reset & Replay Animation</span>
          </button>
        </div>
      )}

      {/* Interactive AI Roadmap Response Modal */}
      <AIRoadmapModal
        isOpen={showRoadmapModal}
        onClose={() => setShowRoadmapModal(false)}
        projectName={projectName}
        projectDescription={projectDescription}
        selectedType={selectedType}
        assignedTechs={assignedTechs}
      />
    </>
  )
}

export default BuildingStatusOverlay
