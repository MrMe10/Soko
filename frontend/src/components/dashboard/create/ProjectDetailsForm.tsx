/**
 * ProjectDetailsForm.tsx
 * ----------------------
 * Stage 2 component: Renders the setup choice card content, the project name & description form inputs
 * inside the enlarged hexagon card, and the completed project title badge display.
 */

import React from 'react'
import { ArrowRight } from 'lucide-react'

interface ProjectDetailsFormProps {
  isSelected: boolean
  isContentFaded: boolean
  isSubmitted: boolean
  isStackShrunk: boolean
  selectedType: 'separate' | 'fullstack'
  title: string
  desc: string
  Icon: React.ComponentType<{ className?: string }>
  projectName: string
  setProjectName: (val: string) => void
  projectDescription: string
  setProjectDescription: (val: string) => void
  onFinishCreate: (e?: React.FormEvent) => void
}

export const ProjectDetailsForm: React.FC<ProjectDetailsFormProps> = ({
  isSelected,
  isContentFaded,
  isSubmitted,
  isStackShrunk,
  selectedType,
  title,
  desc,
  Icon,
  projectName,
  setProjectName,
  projectDescription,
  setProjectDescription,
  onFinishCreate
}) => {
  return (
    <>
      {/* Initial Cell Content (Fades Out Upward) */}
      <div
        className={`relative z-10 flex flex-col items-center text-center p-6 space-y-3 max-w-[200px] transition-all duration-500 ease-out ${
          isSelected && isContentFaded ? 'opacity-0 -translate-y-10 pointer-events-none' : 'opacity-100 translate-y-0'
        }`}
      >
        <div
          className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-all duration-300 shadow-md ${
            isSelected
              ? 'bg-indigo-600 text-white shadow-indigo-600/30 scale-110'
              : 'bg-indigo-50 text-indigo-600 group-hover:bg-indigo-100 group-hover:scale-105'
          }`}
        >
          <Icon className="w-7 h-7" />
        </div>
        <h3
          className={`text-base font-bold transition-colors duration-300 ${
            isSelected ? 'text-indigo-600' : 'text-slate-900 group-hover:text-indigo-600'
          }`}
        >
          {title}
        </h3>
        <p className="text-[11px] leading-relaxed text-slate-500">{desc}</p>
      </div>

      {/* Name & Description Form (Fades In From Below Upward, Fades Out on Submit) */}
      {isSelected && (
        <form
          onSubmit={onFinishCreate}
          className={`absolute z-20 flex flex-col items-center text-center px-1 w-[168px] space-y-1.5 transition-all duration-500 ease-out ${
            isContentFaded && !isSubmitted
              ? 'opacity-100 translate-y-0 pointer-events-auto'
              : 'opacity-0 translate-y-8 pointer-events-none'
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
            isSubmitted && !isStackShrunk ? 'opacity-100 scale-100' : 'opacity-0 scale-90 pointer-events-none'
          }`}
        >
          <h3 className="text-base sm:text-[40px] font-bold text-slate-900 leading-snug tracking-tight font-display drop-shadow-sm">
            {projectName.trim() || (selectedType === 'separate' ? 'Decoupled Storehouse' : 'Fullstack Storehouse')}
          </h3>
        </div>
      )}
    </>
  )
}

export default ProjectDetailsForm
