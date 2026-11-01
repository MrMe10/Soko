/**
 * SetupSelectionHeader.tsx
 * ------------------------
 * Stage 1 component: Renders the top title & description header and the bottom "Continue with..."
 * action button when choosing between Separate / Decoupled and Fullstack setup options.
 */

import React from 'react'
import { ArrowRight } from 'lucide-react'
import type { ArchitectureType } from './createProjectData'

interface SetupSelectionHeaderProps {
  isConfirmed: boolean
  selectedType: ArchitectureType
  onContinue: () => void
}

export const SetupSelectionHeader: React.FC<SetupSelectionHeaderProps> = ({
  isConfirmed
}) => {
  return (
    <>
      {/* Header (Stage 1: Fades out & slides up simultaneously with centering) */}
      <div
        className={`text-center max-w-xl mx-auto space-y-2 transition-all duration-600 ease-out ${
          isConfirmed ? 'h-0 opacity-0 -translate-y-6 pointer-events-none mb-0 overflow-hidden' : 'mb-10 opacity-100 translate-y-0'
        }`}
      >
        <h2 className="text-2xl sm:text-3xl font-extrabold text-white font-display tracking-tight">
          Choose Your Project Setup
        </h2>
        <p className="text-xs sm:text-sm text-zinc-400 max-w-md mx-auto">
          Select how you want to structure your repository and backend environment.
        </p>
      </div>
    </>
  )
}

export const SetupSelectionFooter: React.FC<SetupSelectionHeaderProps> = ({
  isConfirmed,
  selectedType,
  onContinue
}) => {
  return (
    <div
      className={`w-full max-w-md flex justify-center items-center transition-all duration-600 ease-out ${
        isConfirmed ? 'h-0 opacity-0 pointer-events-none mt-0 overflow-hidden' : 'mt-6 opacity-100 translate-y-0'
      }`}
    >
      <button
        type="button"
        onClick={onContinue}
        className="bg-emerald-500 hover:bg-emerald-400 text-black font-extrabold rounded-xl px-6 py-2.5 text-xs shadow-lg shadow-emerald-500/20 hover:shadow-emerald-500/40 transition-all flex items-center gap-2 cursor-pointer active:scale-95"
      >
        <span>Continue with {selectedType === 'separate' ? 'Separate' : 'Fullstack'}</span>
        <ArrowRight className="w-4 h-4 text-black" />
      </button>
    </div>
  )
}

export default SetupSelectionHeader
