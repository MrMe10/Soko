/**
 * SetupSelectionHeader.tsx
 * ------------------------
 * Stage 1 component: Renders the top title & description header and the bottom "Continue with..."
 * action button when choosing between Separate / Decoupled and Fullstack setup options.
 */

import React from 'react'
import { ArrowRight } from 'lucide-react'

interface SetupSelectionHeaderProps {
  isConfirmed: boolean
  selectedType: 'separate' | 'fullstack'
  onContinue: () => void
}

export const SetupSelectionHeader: React.FC<SetupSelectionHeaderProps> = ({
  isConfirmed,
  selectedType,
  onContinue
}) => {
  return (
    <>
      {/* Header (Stage 1: Fades out & slides up simultaneously with centering) */}
      <div
        className={`text-center max-w-xl mx-auto space-y-2 mb-10 transition-all duration-600 ease-out ${
          isConfirmed ? 'opacity-0 -translate-y-6 pointer-events-none' : 'opacity-100 translate-y-0'
        }`}
      >
        <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-display tracking-tight">
          Choose Your Project Setup
        </h2>
        <p className="text-xs sm:text-sm text-slate-500 max-w-md mx-auto">
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
      className={`w-full max-w-md mt-6 flex justify-center items-center transition-all duration-600 ease-out ${
        isConfirmed ? 'opacity-0 translate-y-6 pointer-events-none' : 'opacity-100 translate-y-0'
      }`}
    >
      <button
        type="button"
        onClick={onContinue}
        className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl px-6 py-2.5 text-xs font-semibold shadow-md shadow-indigo-600/20 hover:shadow-lg transition-all flex items-center gap-2 cursor-pointer"
      >
        <span>Continue with {selectedType === 'separate' ? 'Separate' : 'Fullstack'}</span>
        <ArrowRight className="w-4 h-4" />
      </button>
    </div>
  )
}

export default SetupSelectionHeader
