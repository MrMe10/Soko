/**
 * AIRoadmapModal.tsx
 * ------------------
 * Interactive modal that sends project specifications internally to the Gemini AI backend API
 * and displays the returned step-by-step setup guide directly on screen.
 */

import React, { useState, useEffect } from 'react'
import { Sparkles, X, Copy, Check, Terminal, Loader2, RefreshCw, Cpu, BookOpen } from 'lucide-react'
import { copyPromptToClipboard, generateFallbackRoadmap } from '../../../utils/aiPromptTemplate'

interface AIRoadmapModalProps {
  isOpen: boolean
  onClose: () => void
  projectName: string
  projectDescription: string
  selectedType: 'separate' | 'fullstack'
  assignedTechs: Record<string, string>
}

export const AIRoadmapModal: React.FC<AIRoadmapModalProps> = ({
  isOpen,
  onClose,
  projectName,
  projectDescription,
  selectedType,
  assignedTechs
}) => {
  const [loading, setLoading] = useState(true)
  const [roadmapText, setRoadmapText] = useState('')
  const [source, setSource] = useState<string>('')
  const [error, setError] = useState<string | null>(null)
  const [copied, setCopied] = useState(false)

  const fetchAIRoadmap = async () => {
    setLoading(true)
    setError(null)

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
        setSource(data.source === 'gemini-api' ? 'Gemini 1.5 Flash API' : 'Soko AI Architecture Engine')
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
      setLoading(false)
    }
  }

  useEffect(() => {
    if (isOpen) {
      fetchAIRoadmap()
    }
  }, [isOpen])

  if (!isOpen) return null

  const handleCopy = async () => {
    if (!roadmapText) return
    const success = await copyPromptToClipboard(roadmapText)
    if (success) {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-md animate-fade-in">
      <div className="relative bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col overflow-hidden text-slate-100">
        
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-950/80">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-indigo-500/10 border border-indigo-500/20 rounded-xl text-indigo-400">
              <Sparkles className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-white leading-tight">
                  {projectName || 'Decoupled Storehouse'} Roadmap
                </h3>
                {source && (
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 font-mono font-semibold">
                    {source}
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-400 font-medium">
                Step-by-step setup instructions for selected stack
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-xl transition-all"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {loading ? (
            <div className="min-h-[350px] flex flex-col items-center justify-center space-y-4 py-12">
              <div className="relative">
                <div className="w-16 h-16 rounded-full border-4 border-indigo-500/20 border-t-indigo-500 animate-spin" />
                <Cpu className="w-6 h-6 text-indigo-400 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
              </div>
              <div className="text-center space-y-1">
                <h4 className="text-sm font-bold text-slate-200 font-mono">Synthesizing Project Architecture...</h4>
                <p className="text-xs text-slate-400">Communicating with internal AI engine and generating setup instructions</p>
              </div>
            </div>
          ) : error ? (
            <div className="min-h-[250px] flex flex-col items-center justify-center space-y-3 py-8 text-center">
              <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400">
                <Terminal className="w-6 h-6" />
              </div>
              <p className="text-sm font-semibold text-red-300">{error}</p>
              <button
                onClick={fetchAIRoadmap}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-xs font-bold rounded-lg flex items-center gap-2 transition-all"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Retry Request</span>
              </button>
            </div>
          ) : (
            <div className="prose prose-invert max-w-none font-mono text-xs leading-relaxed space-y-4">
              <pre className="whitespace-pre-wrap break-words p-5 bg-slate-950 rounded-xl border border-slate-800/80 font-mono text-[11px] text-slate-200 leading-6 select-all">
                {roadmapText}
              </pre>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-slate-800 bg-slate-950/80">
          <div className="flex items-center gap-2 text-xs text-slate-400 font-mono">
            <BookOpen className="w-4 h-4 text-indigo-400" />
            <span>Setup guide generated for <strong className="text-white">{selectedType === 'fullstack' ? 'Fullstack' : 'Decoupled'}</strong> setup</span>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white rounded-xl text-xs font-semibold transition-all"
            >
              Close
            </button>
            <button
              type="button"
              disabled={loading || Boolean(error)}
              onClick={handleCopy}
              className="px-5 py-2 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white rounded-xl text-xs font-bold transition-all flex items-center gap-2 shadow-lg shadow-indigo-600/20 active:scale-95"
            >
              {copied ? (
                <>
                  <Check className="w-4 h-4 text-emerald-300" />
                  <span>Copied Roadmap!</span>
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4" />
                  <span>Copy Roadmap Code</span>
                </>
              )}
            </button>
          </div>
        </div>

      </div>
    </div>
  )
}

export default AIRoadmapModal
