/**
 * BuildingStatusOverlay.tsx
 * -------------------------
 * Stage 4 component: Renders environment synthesis progress and directly presents
 * the AI-generated project setup roadmap in-tab once the build completes, with copy
 * and project completion actions.
 */

import React, { useState, useEffect } from 'react'
import {
  ArrowRight,
  CheckCircle2,
  Copy,
  Check,
  RotateCcw,
  BookOpen,
  Cpu,
  Terminal,
  RefreshCw
} from 'lucide-react'
import { LOADING_MESSAGES } from './createProjectData'
import type { ArchitectureType } from './createProjectData'
import { copyPromptToClipboard, generateFallbackRoadmap } from '../../../utils/aiPromptTemplate'

interface BuildingStatusOverlayProps {
  isStackShrunk: boolean
  isSubmitted: boolean
  loadingMessageIndex: number
  isBuildComplete: boolean
  onBuildComplete?: () => void
  onResetAnimation: () => void
  onCompleteProject: () => void
  projectName?: string
  projectDescription?: string
  selectedType?: ArchitectureType
  assignedTechs?: Record<string, string>
}

export const BuildingStatusOverlay: React.FC<BuildingStatusOverlayProps> = ({
  isStackShrunk,
  isSubmitted,
  loadingMessageIndex,
  isBuildComplete,
  onBuildComplete,
  onResetAnimation,
  onCompleteProject,
  projectName = 'Decoupled Storehouse',
  projectDescription = '',
  selectedType = 'separate',
  assignedTechs = {}
}) => {
  const [roadmapText, setRoadmapText] = useState('')
  const [source, setSource] = useState<string>('')
  const [roadmapLoading, setRoadmapLoading] = useState(false)
  const [roadmapError, setRoadmapError] = useState<string | null>(null)
  const [copied, setCopied] = useState(false)

  const fetchAIRoadmap = async () => {
    setRoadmapLoading(true)
    setRoadmapError(null)
    const startTime = Date.now()

    try {
      const response = await fetch('http://localhost:5000/api/ai/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: projectName,
          description: projectDescription,
          type: selectedType,
          assignedTechs
        })
      })

      if (!response.ok) {
        throw new Error(`Server returned status ${response.status}`)
      }

      const data = await response.json()
      if (data.success && data.roadmap) {
        setRoadmapText(data.roadmap)
        setSource(data.source === 'gemini-api' ? 'Gemini 1.5 Flash API' : data.source || 'Soko AI Architecture Engine')
      } else {
        throw new Error(data.message || 'Failed to parse AI response')
      }
    } catch (err: any) {
      console.warn('Backend API unreachable. Generating setup roadmap client-side:', err.message)
      const fallbackText = generateFallbackRoadmap({
        name: projectName,
        description: projectDescription,
        type: selectedType,
        assignedTechs
      })
      setRoadmapText(fallbackText)
      setSource('Soko AI Architecture Engine')
    } finally {
      setRoadmapLoading(false)
      const elapsed = Date.now() - startTime
      const minAnimationBuffer = 600
      const remainingDelay = Math.max(0, minAnimationBuffer - elapsed)

      setTimeout(() => {
        onBuildComplete?.()
      }, remainingDelay)
    }
  }

  // Fetch roadmap as soon as build phase begins and dynamically transition on completion
  useEffect(() => {
    if (isStackShrunk) {
      fetchAIRoadmap()
    } else {
      setRoadmapText('')
      setSource('')
      setRoadmapError(null)
    }
  }, [isStackShrunk, projectName, selectedType, assignedTechs])

  const handleCopy = async () => {
    if (!roadmapText) return
    const success = await copyPromptToClipboard(roadmapText)
    if (success) {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  return (
    <>
      {/* Loading & Direct Background Roadmap Stage */}
      {isStackShrunk && (
        <div
          className={`transition-all duration-700 ease-out z-40 pointer-events-auto w-full flex flex-col ${
            isBuildComplete
              ? 'items-start max-w-4xl mt-0 pt-0 px-0 text-left animate-fade-in'
              : 'items-center px-2 sm:px-4 absolute top-[56%] sm:top-[57%] left-1/2 -translate-x-1/2 max-w-sm justify-center text-center space-y-2.5 animate-fade-in'
          }`}
        >
          {isBuildComplete ? (
            /* Direct In-Background AI Roadmap with Staggered Line Fade-In */
            <div className="w-full flex flex-col space-y-6 animate-fade-in">
              <style>{`
                @keyframes lineFadeInUp {
                  0% {
                    opacity: 0;
                    transform: translateY(18px);
                  }
                  100% {
                    opacity: 1;
                    transform: translateY(0);
                  }
                }
              `}</style>

              {/* Action Toolbar directly on background */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-zinc-800 w-full animate-[lineFadeInUp_0.4s_ease-out_forwards]">
                <div>
                  <div className="flex items-center gap-2.5 flex-wrap">
                    <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">
                      {projectName || 'Decoupled Storehouse'} Blueprint
                    </h2>
                    <span className="text-[10.5px] px-2.5 py-0.5 rounded-full bg-emerald-950/80 text-emerald-400 border border-emerald-800/80 font-mono font-bold flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                      <span>Ready</span>
                    </span>
                    {source && (
                      <span className="text-[10.5px] px-2.5 py-0.5 rounded-full bg-zinc-800 text-zinc-300 border border-zinc-700 font-mono font-bold">
                        {source}
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-zinc-400 font-medium pt-0.5">
                    Step-by-step setup instructions for your chosen architecture
                  </p>
                </div>

                {/* Primary Action Buttons */}
                <div className="flex items-center gap-2.5 self-end sm:self-auto shrink-0">
                  <button
                    type="button"
                    onClick={onResetAnimation}
                    className="px-3 py-2 text-zinc-400 hover:text-white text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>Reset</span>
                  </button>

                  <button
                    type="button"
                    disabled={roadmapLoading || Boolean(roadmapError) || !roadmapText}
                    onClick={handleCopy}
                    className="px-4 py-2 bg-zinc-900 hover:bg-zinc-800 disabled:opacity-50 text-zinc-100 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 border border-zinc-700 shadow-xs cursor-pointer active:scale-95"
                  >
                    {copied ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-400" />
                        <span className="text-emerald-400 font-bold">Copied!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5 text-zinc-400" />
                        <span>Copy Plan</span>
                      </>
                    )}
                  </button>

                  <button
                    type="button"
                    onClick={onCompleteProject}
                    className="px-5 py-2 bg-emerald-500 hover:bg-emerald-400 active:scale-95 text-black rounded-xl text-xs font-extrabold shadow-lg shadow-emerald-500/25 transition-all flex items-center gap-1.5 cursor-pointer"
                  >
                    <span>Finish & Return</span>
                    <ArrowRight className="w-3.5 h-3.5 text-black" />
                  </button>
                </div>
              </div>

              {/* Staggered Line-by-Line Content directly over background */}
              {roadmapLoading ? (
                <div className="min-h-[260px] flex flex-col items-center justify-center space-y-3 py-10">
                  <div className="relative">
                    <div className="w-12 h-12 rounded-full border-3 border-zinc-800 border-t-emerald-500 animate-spin" />
                    <Cpu className="w-5 h-5 text-emerald-400 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
                  </div>
                  <div className="text-center space-y-1">
                    <h4 className="text-sm font-bold text-white font-mono">Synthesizing Project Blueprint...</h4>
                    <p className="text-xs text-zinc-400">Compiling setup instructions from architecture engine</p>
                  </div>
                </div>
              ) : roadmapError ? (
                <div className="min-h-[200px] flex flex-col items-center justify-center space-y-3 py-6 text-center">
                  <div className="p-3 bg-red-950/50 border border-red-800/80 rounded-xl text-red-400">
                    <Terminal className="w-5 h-5" />
                  </div>
                  <p className="text-xs font-semibold text-red-400">{roadmapError}</p>
                  <button
                    onClick={fetchAIRoadmap}
                    className="px-4 py-2 bg-zinc-800 hover:bg-zinc-700 text-xs font-bold rounded-lg flex items-center gap-2 transition-all cursor-pointer text-zinc-100 border border-zinc-700"
                  >
                    <RefreshCw className="w-3.5 h-3.5" />
                    <span>Retry Request</span>
                  </button>
                </div>
              ) : (
                <div className="w-full flex flex-col space-y-0.5 text-zinc-100 select-text pb-12">
                  {(() => {
                    const lines = roadmapText.split('\n')
                    let inCodeBlock = false

                    return lines.map((line, index) => {
                      const animDelay = `${Math.min(index * 22, 2200)}ms`

                      if (line.trim().startsWith('```')) {
                        inCodeBlock = !inCodeBlock
                        return (
                          <div
                            key={index}
                            style={{
                              animation: 'lineFadeInUp 0.35s cubic-bezier(0.16, 1, 0.3, 1) forwards',
                              animationDelay: animDelay,
                              opacity: 0
                            }}
                            className="h-1"
                          />
                        )
                      }

                      if (inCodeBlock) {
                        return (
                          <div
                            key={index}
                            style={{
                              animation: 'lineFadeInUp 0.35s cubic-bezier(0.16, 1, 0.3, 1) forwards',
                              animationDelay: animDelay,
                              opacity: 0
                            }}
                            className="bg-zinc-950 text-emerald-300 font-mono text-[12px] font-semibold px-3 py-1.5 rounded border border-zinc-800 my-0.5 select-all overflow-x-auto shadow-2xs"
                          >
                            {line || ' '}
                          </div>
                        )
                      }

                      if (line.startsWith('# ')) {
                        return (
                          <h1
                            key={index}
                            style={{
                              animation: 'lineFadeInUp 0.35s cubic-bezier(0.16, 1, 0.3, 1) forwards',
                              animationDelay: animDelay,
                              opacity: 0
                            }}
                            className="text-xl sm:text-2xl font-black text-white tracking-tight pt-4 pb-1"
                          >
                            {line.replace(/^#\s+/, '')}
                          </h1>
                        )
                      }

                      if (line.startsWith('## ')) {
                        return (
                          <h2
                            key={index}
                            style={{
                              animation: 'lineFadeInUp 0.35s cubic-bezier(0.16, 1, 0.3, 1) forwards',
                              animationDelay: animDelay,
                              opacity: 0
                            }}
                            className="text-base sm:text-lg font-extrabold text-emerald-400 tracking-tight pt-5 pb-1 border-b border-zinc-800 mb-1"
                          >
                            {line.replace(/^##\s+/, '')}
                          </h2>
                        )
                      }

                      if (line.startsWith('### ')) {
                        return (
                          <h3
                            key={index}
                            style={{
                              animation: 'lineFadeInUp 0.35s cubic-bezier(0.16, 1, 0.3, 1) forwards',
                              animationDelay: animDelay,
                              opacity: 0
                            }}
                            className="text-sm sm:text-base font-bold text-zinc-100 pt-3 pb-0.5"
                          >
                            {line.replace(/^###\s+/, '')}
                          </h3>
                        )
                      }

                      if (line.trim() === '---') {
                        return (
                          <hr
                            key={index}
                            style={{
                              animation: 'lineFadeInUp 0.35s cubic-bezier(0.16, 1, 0.3, 1) forwards',
                              animationDelay: animDelay,
                              opacity: 0
                            }}
                            className="border-t border-zinc-800 my-3"
                          />
                        )
                      }

                      if (!line.trim()) {
                        return (
                          <div
                            key={index}
                            style={{
                              animation: 'lineFadeInUp 0.35s cubic-bezier(0.16, 1, 0.3, 1) forwards',
                              animationDelay: animDelay,
                              opacity: 0
                            }}
                            className="h-2"
                          />
                        )
                      }

                      return (
                        <div
                          key={index}
                          style={{
                            animation: 'lineFadeInUp 0.35s cubic-bezier(0.16, 1, 0.3, 1) forwards',
                            animationDelay: animDelay,
                            opacity: 0
                          }}
                          className="font-mono text-xs sm:text-[12.5px] text-zinc-300 leading-6 tracking-normal select-text whitespace-pre-wrap"
                        >
                          {line}
                        </div>
                      )
                    })
                  })()}
                </div>
              )}

              {/* Bottom Sticky/Floating Finish bar */}
              <div className="pt-4 border-t border-zinc-800 flex items-center justify-between gap-3 text-xs text-zinc-400 font-mono">
                <div className="flex items-center gap-2">
                  <BookOpen className="w-4 h-4 text-emerald-400" />
                  <span>Setup guide for <strong className="text-white">{selectedType === 'fullstack' ? 'Fullstack' : 'Decoupled'}</strong></span>
                </div>

                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    disabled={roadmapLoading || Boolean(roadmapError) || !roadmapText}
                    onClick={handleCopy}
                    className="px-3.5 py-1.5 bg-zinc-900 hover:bg-zinc-800 text-zinc-200 border border-zinc-700 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer"
                  >
                    {copied ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-400" />
                        <span className="text-emerald-400 font-bold">Copied</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5 text-zinc-400" />
                        <span>Copy All</span>
                      </>
                    )}
                  </button>

                  <button
                    type="button"
                    onClick={onCompleteProject}
                    className="px-4 py-1.5 bg-emerald-500 hover:bg-emerald-400 active:scale-95 text-black rounded-lg text-xs font-extrabold shadow-sm transition-all flex items-center gap-1.5 cursor-pointer"
                  >
                    <span>Finish</span>
                    <ArrowRight className="w-3.5 h-3.5 text-black" />
                  </button>
                </div>
              </div>
            </div>
          ) : (
            /* During Synthesis Animation */
            <>
              <p
                key={loadingMessageIndex}
                className="text-xs sm:text-sm font-extrabold text-zinc-100 font-mono tracking-tight animate-fade-in transition-all duration-300"
              >
                {LOADING_MESSAGES[loadingMessageIndex]}
              </p>
              <div className="flex items-center gap-1.5 pt-0.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping shrink-0" />
                <span className="text-[10px] font-extrabold text-emerald-400 uppercase tracking-widest font-mono">
                  Building Environment ({Math.min(100, Math.round(((loadingMessageIndex + 1) / LOADING_MESSAGES.length) * 100))}%)
                </span>
              </div>
            </>
          )}
        </div>
      )}

      {/* Replay/Reset Controller when Submitted (Only when not shrunk / before complete) */}
      {isSubmitted && !isStackShrunk && (
        <div className="mt-8 flex items-center justify-center z-30 animate-fade-in gap-3">
          <button
            type="button"
            onClick={onResetAnimation}
            className="px-4 py-2 bg-zinc-900 hover:bg-zinc-800 text-zinc-300 hover:text-white border border-zinc-700 rounded-xl text-xs font-semibold transition-all shadow-sm flex items-center gap-2 cursor-pointer"
          >
            <span>Reset & Replay Animation</span>
          </button>
        </div>
      )}
    </>
  )
}

export default BuildingStatusOverlay
