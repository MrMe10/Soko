import React, { useState } from 'react'
import { Folder, Layers, Cpu, X, Check, Info } from 'lucide-react'

interface CreateProjectViewProps {
  onCreateProject: (project: { name: string; description: string; type: 'separate' | 'fullstack' }) => void
  onCancel: () => void
}

export default function CreateProjectView({ onCreateProject, onCancel }: CreateProjectViewProps) {
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [type, setType] = useState<'separate' | 'fullstack'>('separate')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!name.trim()) return
    onCreateProject({
      name: name.trim(),
      description: description.trim(),
      type
    })
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      
      {/* Header card */}
      <div className="bg-white border border-slate-200/90 rounded-xl p-5 shadow-sm flex items-center justify-between">
        <div>
          <h2 className="text-lg font-bold text-slate-900 m-0">Initialize Storehouse</h2>
          <p className="text-xs text-slate-500 mt-1">Spin up a partitioned, isolated environment for your warehouse network.</p>
        </div>
        <button
          onClick={onCancel}
          className="p-1.5 border border-slate-200 hover:bg-slate-50 bg-white rounded-lg text-slate-500 hover:text-slate-800 transition-colors cursor-pointer"
          title="Cancel"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Main Form */}
      <form onSubmit={handleSubmit} className="bg-white border border-slate-200/90 rounded-xl p-6 shadow-sm space-y-6">
        
        {/* Name input */}
        <div className="space-y-1.5">
          <label className="block text-[11px] font-mono font-bold uppercase tracking-wider text-slate-500">
            Storehouse / Project Name
          </label>
          <div className="relative">
            <Folder className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Soko Backup Shard"
              className="w-full bg-white border border-slate-200 rounded-lg pl-10 pr-3 py-2.5 text-xs text-slate-800 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all font-mono"
            />
          </div>
          <span className="text-[10px] text-slate-400 block leading-tight">
            Use lowercase letters, numbers, or dashes for optimal mapping directory names.
          </span>
        </div>

        {/* Description input */}
        <div className="space-y-1.5">
          <label className="block text-[11px] font-mono font-bold uppercase tracking-wider text-slate-500">
            Description
          </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Describe the environment's role, database replication nodes, and partition storage scope..."
            rows={3}
            className="w-full bg-white border border-slate-200 rounded-lg px-3 py-2 text-xs text-slate-800 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all font-sans resize-none"
          />
        </div>

        {/* Architecture Select Cards */}
        <div className="space-y-2.5">
          <label className="block text-[11px] font-mono font-bold uppercase tracking-wider text-slate-500">
            Architecture Type
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            
            {/* Decoupled Card */}
            <div
              onClick={() => setType('separate')}
              className={`p-4 border rounded-xl cursor-pointer transition-all duration-200 flex flex-col justify-between hover:shadow-md ${
                type === 'separate'
                  ? 'border-indigo-650 bg-indigo-50/50 shadow-xs'
                  : 'border-slate-200 bg-white hover:bg-slate-50/50'
              }`}
            >
              <div className="flex items-start justify-between">
                <div className={`w-9 h-9 rounded-lg flex items-center justify-center border shrink-0 ${
                  type === 'separate' ? 'bg-indigo-50 border-indigo-150 text-indigo-650' : 'bg-slate-50 border-slate-150 text-slate-500'
                }`}>
                  <Layers className="w-4.5 h-4.5" />
                </div>
                {type === 'separate' && (
                  <span className="w-5 h-5 rounded-full bg-indigo-650 flex items-center justify-center text-white shrink-0">
                    <Check className="w-3 h-3" />
                  </span>
                )}
              </div>
              <div className="mt-4">
                <h4 className="text-xs font-bold text-slate-900 leading-tight">Decoupled / Separate</h4>
                <p className="text-[10px] text-slate-500 mt-1 leading-relaxed">
                  Independent client and server endpoints. Promotes distributed caching and multi-region scaling.
                </p>
              </div>
            </div>

            {/* Monolith Card */}
            <div
              onClick={() => setType('fullstack')}
              className={`p-4 border rounded-xl cursor-pointer transition-all duration-200 flex flex-col justify-between hover:shadow-md ${
                type === 'fullstack'
                  ? 'border-indigo-650 bg-indigo-50/50 shadow-xs'
                  : 'border-slate-200 bg-white hover:bg-slate-50/50'
              }`}
            >
              <div className="flex items-start justify-between">
                <div className={`w-9 h-9 rounded-lg flex items-center justify-center border shrink-0 ${
                  type === 'fullstack' ? 'bg-indigo-50 border-indigo-150 text-indigo-650' : 'bg-slate-50 border-slate-150 text-slate-500'
                }`}>
                  <Cpu className="w-4.5 h-4.5" />
                </div>
                {type === 'fullstack' && (
                  <span className="w-5 h-5 rounded-full bg-indigo-650 flex items-center justify-center text-white shrink-0">
                    <Check className="w-3 h-3" />
                  </span>
                )}
              </div>
              <div className="mt-4">
                <h4 className="text-xs font-bold text-slate-900 leading-tight">Monolith / Fullstack</h4>
                <p className="text-[10px] text-slate-500 mt-1 leading-relaxed">
                  Unified application runtime directory. Best for simplified deployment and low-latency database queries.
                </p>
              </div>
            </div>

          </div>
        </div>

        {/* Info Box */}
        <div className="bg-slate-50 border border-slate-200/60 rounded-xl p-3 flex gap-2.5 items-start">
          <Info className="w-4 h-4 text-indigo-600 mt-0.5 shrink-0" />
          <p className="text-[10px] text-slate-500 leading-relaxed">
            Initializing this project registers virtual database shards on <strong>Node-718</strong> and formats a clean capacity segment in workspace storage.
          </p>
        </div>

        {/* Buttons */}
        <div className="flex justify-end gap-3 pt-2 border-t border-slate-150">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 border border-slate-250 hover:bg-slate-100 bg-white text-slate-700 rounded-lg text-xs font-semibold transition-colors cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={!name.trim()}
            className="bg-indigo-650 hover:bg-indigo-700 text-white rounded-lg px-4 py-2 text-xs font-semibold shadow shadow-indigo-650/15 hover:shadow-md transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Initialize Shard
          </button>
        </div>

      </form>

    </div>
  )
}
