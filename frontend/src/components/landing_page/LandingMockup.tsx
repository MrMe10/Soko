import React from 'react'

export const LandingMockup: React.FC = () => {
  return (
    <div className="w-full max-w-5xl mt-20 relative z-35 px-4 md:px-0">
      {/* Mockup shadow & container border */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-2xl p-3 md:p-4 overflow-hidden shadow-indigo-100/30">
        <div className="bg-slate-50 rounded-xl border border-slate-100 overflow-hidden flex flex-col aspect-[16/9] w-full relative">
          
          {/* Mock Window Controls Header */}
          <div className="h-10 bg-white border-b border-slate-200/60 flex items-center px-4 justify-between select-none">
            <div className="flex gap-1.5">
              <span className="w-3 h-3 rounded-full bg-slate-200" />
              <span className="w-3 h-3 rounded-full bg-slate-200" />
              <span className="w-3 h-3 rounded-full bg-slate-200" />
            </div>
            <div className="w-64 bg-slate-100 rounded-md h-5 border border-slate-200/50 text-[10px] text-slate-400 font-mono flex items-center justify-center">
              soko.internal/console/dashboard
            </div>
            <div className="w-6" />
          </div>

          {/* Mockup Body Preview of Dashboard elements */}
          <div className="flex-1 flex overflow-hidden">
            {/* Mock sidebar */}
            <div className="w-48 bg-white border-r border-slate-200/60 p-4 space-y-3 hidden sm:block">
              <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
                <span className="w-5 h-5 bg-indigo-500 rounded-md" />
                <span className="w-16 bg-slate-200 rounded h-3" />
              </div>
              <div className="space-y-2 pt-2">
                <div className="flex items-center gap-2 bg-indigo-50/50 p-1.5 rounded-lg">
                  <span className="w-4 h-4 bg-indigo-500 rounded" />
                  <span className="w-20 bg-indigo-600/40 rounded h-2.5" />
                </div>
                {Array.from({ length: 4 }).map((_, i) => (
                  <div key={i} className="flex items-center gap-2 p-1.5">
                    <span className="w-4 h-4 bg-slate-200 rounded" />
                    <span className="w-24 bg-slate-200/70 rounded h-2.5" />
                  </div>
                ))}
              </div>
            </div>
            
            {/* Mock view */}
            <div className="flex-1 p-5 space-y-5 overflow-hidden bg-slate-50">
              {/* Top Stats */}
              <div className="grid grid-cols-4 gap-3">
                {Array.from({ length: 4 }).map((_, i) => (
                  <div key={i} className="bg-white border border-slate-200/70 p-3 rounded-lg flex items-center justify-between">
                    <div className="space-y-1">
                      <span className="w-10 bg-slate-200 rounded h-2 block" />
                      <span className="w-14 bg-slate-300 rounded h-4 block" />
                    </div>
                    <span className="w-6 h-6 bg-slate-100 rounded border border-slate-200" />
                  </div>
                ))}
              </div>

              {/* Table area mockup */}
              <div className="bg-white border border-slate-200/80 rounded-xl p-4 flex-1 space-y-3">
                <div className="flex justify-between items-center pb-2 border-b border-slate-100">
                  <span className="w-28 bg-slate-300 rounded h-3.5 block" />
                  <span className="w-16 bg-slate-200 rounded h-5 block" />
                </div>
                <div className="space-y-2">
                  {Array.from({ length: 4 }).map((_, i) => (
                    <div key={i} className="flex justify-between items-center py-1">
                      <span className="w-36 bg-slate-200 rounded h-2.5 block" />
                      <span className="w-12 bg-slate-200 rounded h-2.5 block" />
                      <span className="w-8 bg-slate-100 rounded h-2.5 block" />
                      <span className="w-16 bg-emerald-50 rounded h-4 block" />
                    </div>
                  ))}
                </div>
              </div>
            </div>

          </div>

        </div>
      </div>

      {/* Sparkles / glow details */}
      <div className="absolute -top-12 -left-12 w-64 h-64 bg-indigo-200/30 rounded-full filter blur-3xl pointer-events-none" />
      <div className="absolute -bottom-16 -right-16 w-80 h-80 bg-yellow-200/25 rounded-full filter blur-3xl pointer-events-none" />
    </div>
  )
}
