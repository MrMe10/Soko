import React from 'react'

export const LandingMockup: React.FC = () => {
  return (
    <div className="w-full max-w-5xl mt-20 relative z-35 px-4 md:px-0">
      {/* Mockup shadow & container border */}
      <div className="bg-zinc-900/90 rounded-2xl border border-zinc-800 shadow-2xl p-3 md:p-4 overflow-hidden shadow-emerald-950/40">
        <div className="bg-black rounded-xl border border-zinc-800/80 overflow-hidden flex flex-col aspect-[16/9] w-full relative">
          
          {/* Mock Window Controls Header */}
          <div className="h-10 bg-zinc-900 border-b border-zinc-800 flex items-center px-4 justify-between select-none">
            <div className="flex gap-1.5">
              <span className="w-3 h-3 rounded-full bg-zinc-700" />
              <span className="w-3 h-3 rounded-full bg-zinc-700" />
              <span className="w-3 h-3 rounded-full bg-zinc-700" />
            </div>
            <div className="w-64 bg-black rounded-md h-5 border border-zinc-800 text-[10px] text-emerald-400 font-mono flex items-center justify-center">
              soko.internal/console/dashboard
            </div>
            <div className="w-6" />
          </div>

          {/* Mockup Body Preview of Dashboard elements */}
          <div className="flex-1 flex overflow-hidden">
            {/* Mock sidebar */}
            <div className="w-48 bg-zinc-950 border-r border-zinc-800 p-4 space-y-3 hidden sm:block">
              <div className="flex items-center gap-2 pb-2 border-b border-zinc-800/80">
                <span className="w-5 h-5 bg-emerald-500 rounded-md" />
                <span className="w-16 bg-zinc-700 rounded h-3" />
              </div>
              <div className="space-y-2 pt-2">
                <div className="flex items-center gap-2 bg-emerald-500/10 border-l-2 border-emerald-500 p-1.5 rounded-r-lg">
                  <span className="w-4 h-4 bg-emerald-500 rounded" />
                  <span className="w-20 bg-emerald-400/80 rounded h-2.5" />
                </div>
                {Array.from({ length: 4 }).map((_, i) => (
                  <div key={i} className="flex items-center gap-2 p-1.5">
                    <span className="w-4 h-4 bg-zinc-800 rounded" />
                    <span className="w-24 bg-zinc-800 rounded h-2.5" />
                  </div>
                ))}
              </div>
            </div>
            
            {/* Mock view */}
            <div className="flex-1 p-5 space-y-5 overflow-hidden bg-black">
              {/* Top Stats */}
              <div className="grid grid-cols-4 gap-3">
                {Array.from({ length: 4 }).map((_, i) => (
                  <div key={i} className="bg-zinc-900/90 border border-zinc-800 p-3 rounded-lg flex items-center justify-between">
                    <div className="space-y-1">
                      <span className="w-10 bg-zinc-700 rounded h-2 block" />
                      <span className="w-14 bg-zinc-500 rounded h-4 block" />
                    </div>
                    <span className="w-6 h-6 bg-zinc-800 rounded border border-zinc-700" />
                  </div>
                ))}
              </div>

              {/* Table area mockup */}
              <div className="bg-zinc-900/90 border border-zinc-800 rounded-xl p-4 flex-1 space-y-3">
                <div className="flex justify-between items-center pb-2 border-b border-zinc-800">
                  <span className="w-28 bg-zinc-600 rounded h-3.5 block" />
                  <span className="w-16 bg-emerald-500/20 rounded h-5 block border border-emerald-500/30" />
                </div>
                <div className="space-y-2">
                  {Array.from({ length: 4 }).map((_, i) => (
                    <div key={i} className="flex justify-between items-center py-1">
                      <span className="w-36 bg-zinc-700 rounded h-2.5 block" />
                      <span className="w-12 bg-zinc-700 rounded h-2.5 block" />
                      <span className="w-8 bg-zinc-800 rounded h-2.5 block" />
                      <span className="w-16 bg-emerald-950/60 rounded h-4 block border border-emerald-800/40" />
                    </div>
                  ))}
                </div>
              </div>
            </div>

          </div>

        </div>
      </div>

      {/* Sparkles / glow details */}
      <div className="absolute -top-12 -left-12 w-64 h-64 bg-emerald-500/15 rounded-full filter blur-3xl pointer-events-none" />
      <div className="absolute -bottom-16 -right-16 w-80 h-80 bg-emerald-600/10 rounded-full filter blur-3xl pointer-events-none" />
    </div>
  )
}
