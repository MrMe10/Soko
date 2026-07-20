import React, { useState } from 'react'
import { Layers, Cpu, ArrowRight, Folder, X } from 'lucide-react'

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

export default function CreateProjectView({ onCreateProject, onCancel }: CreateProjectViewProps) {
  const [selectedType, setSelectedType] = useState<'separate' | 'fullstack'>('separate')
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [step, setStep] = useState<'select' | 'details'>('select')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!name.trim()) return
    onCreateProject({ name: name.trim(), description: description.trim(), type: selectedType })
  }

  return (
    <div className="relative min-h-[75vh] w-full flex flex-col items-center justify-center py-6 px-4">
      {/* Background Subtle Radial Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-indigo-500/5 blur-[120px] rounded-full pointer-events-none -z-10" />

      {/* Header */}
      <div className="text-center max-w-xl mx-auto mb-10 space-y-2">
        <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-display tracking-tight">
          Choose Your Project Setup
        </h2>
        <p className="text-xs sm:text-sm text-slate-500 max-w-md mx-auto">
          Select how you want to structure your repository and backend environment.
        </p>
      </div>

      {/* Hexagon Options */}
      <div className="flex flex-col md:flex-row items-center justify-center gap-8 md:gap-14 w-full max-w-4xl my-4">
        {OPTIONS.map(({ type, title, desc, Icon }) => {
          const isSelected = selectedType === type
          return (
            <div
              key={type}
              onClick={() => setSelectedType(type)}
              className="group relative flex flex-col items-center cursor-pointer select-none transition-all duration-300 transform hover:-translate-y-2"
            >
              <div className="relative w-64 h-72 sm:w-72 sm:h-80 flex items-center justify-center">
                <svg
                  className={`absolute inset-0 w-full h-full transition-all duration-300 ${
                    isSelected ? 'drop-shadow-[0_0_22px_rgba(99,102,241,0.45)]' : 'drop-shadow-md group-hover:drop-shadow-lg'
                  }`}
                  viewBox="0 0 240 270"
                  fill="none"
                >
                  <polygon
                    points="120,5 230,68 230,195 120,258 10,195 10,68"
                    fill="#ffffff"
                    stroke={isSelected ? '#6366f1' : '#e2e8f0'}
                    strokeWidth={isSelected ? '4' : '2'}
                    className="transition-all duration-300 group-hover:stroke-indigo-400"
                  />
                </svg>

                <div className="relative z-10 flex flex-col items-center text-center p-6 space-y-3 max-w-[200px]">
                  <div className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-all duration-300 shadow-md ${
                    isSelected ? 'bg-indigo-600 text-white shadow-indigo-600/30 scale-110' : 'bg-indigo-50 text-indigo-600 group-hover:bg-indigo-100 group-hover:scale-105'
                  }`}>
                    <Icon className="w-7 h-7" />
                  </div>
                  <h3 className={`text-base font-bold transition-colors ${isSelected ? 'text-indigo-600' : 'text-slate-900 group-hover:text-indigo-600'}`}>
                    {title}
                  </h3>
                  <p className="text-[11px] leading-relaxed text-slate-500">{desc}</p>
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {/* Action Footer / Step Form */}
      <div className="w-full max-w-md mt-6 space-y-4">
        {step === 'select' ? (
          <div className="flex justify-center items-center">
            <button
              type="button"
              onClick={() => setStep('details')}
              className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl px-6 py-2.5 text-xs font-semibold shadow-md shadow-indigo-600/20 hover:shadow-lg transition-all flex items-center gap-2 cursor-pointer"
            >
              <span>Continue with {selectedType === 'separate' ? 'Separate' : 'Fullstack'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xl space-y-4 animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h4 className="text-sm font-bold text-slate-900">Project Details</h4>
                <p className="text-[11px] text-slate-500">
                  Selected: <span className="font-semibold text-indigo-600 uppercase font-mono">{selectedType}</span>
                </p>
              </div>
              <button type="button" onClick={() => setStep('select')} className="text-slate-400 hover:text-slate-600 p-1 rounded-lg hover:bg-slate-100">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-1.5">
              <label className="block text-[11px] font-mono font-bold uppercase tracking-wider text-slate-600">Project Name</label>
              <div className="relative">
                <Folder className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <input
                  type="text"
                  required
                  autoFocus
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Soko Storehouse Core"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-3 py-2.5 text-xs text-slate-800 focus:bg-white focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all font-mono"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="block text-[11px] font-mono font-bold uppercase tracking-wider text-slate-600">Description</label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Brief summary of your project..."
                rows={2}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800 focus:bg-white focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all resize-none"
              />
            </div>

            <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
              <button type="button" onClick={() => setStep('select')} className="px-4 py-2 border border-slate-200 hover:bg-slate-100 bg-white text-slate-600 rounded-xl text-xs font-semibold transition-colors cursor-pointer">
                Back
              </button>
              <button type="submit" disabled={!name.trim()} className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl px-5 py-2 text-xs font-semibold shadow-md shadow-indigo-600/20 hover:shadow-lg transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed">
                Create Project
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  )
}
