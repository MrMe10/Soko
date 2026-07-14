import { ArrowRight, Activity, LogIn } from 'lucide-react'

interface LandingPageProps {
  onEnterDashboard: () => void
}

export default function LandingPage({ onEnterDashboard }: LandingPageProps) {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 flex flex-col font-sans overflow-x-hidden selection:bg-indigo-100">
      
      {/* 1. Header Navigation */}
      <header className="h-20 flex items-center justify-between px-8 md:px-16 border-b border-slate-100 bg-white/70 backdrop-blur-md sticky top-0 z-50">
        <div className="flex items-center gap-3">
          <div className="relative w-9 h-9 flex items-center justify-center bg-black rounded-xl shadow-md">
            {/* Custom Isometric Box / Warehouse Logo */}
            <svg className="w-5 h-5 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
              <polyline points="3.27 6.96 12 12.01 20.73 6.96" />
              <line x1="12" y1="22.08" x2="12" y2="12" />
            </svg>
          </div>
          <div>
            <span className="text-lg font-display font-extrabold tracking-wider text-slate-900 leading-none">
              SOKO
            </span>
            <span className="text-[9px] font-mono tracking-widest text-slate-400 uppercase block leading-none mt-0.5">
              Storehouse
            </span>
          </div>
        </div>

        {/* Navigation Links */}
        <div className="flex items-center gap-8 text-xs font-semibold text-slate-600">
          <a href="#features" className="hover:text-slate-900 transition-colors">Features</a>
          <a href="#pricing" className="hover:text-slate-900 transition-colors">Pricing</a>
          <a href="#docs" className="hover:text-slate-900 transition-colors">Docs</a>
          <button
            onClick={onEnterDashboard}
            className="flex items-center gap-1.5 hover:text-slate-900 transition-colors cursor-pointer"
          >
            <LogIn className="w-3.5 h-3.5" />
            <span>Log In</span>
          </button>
          
          <button
            onClick={onEnterDashboard}
            className="bg-black hover:bg-slate-800 text-white rounded-full px-5 py-2.5 transition-all flex items-center gap-1.5 shadow-sm hover:shadow-md cursor-pointer"
          >
            <span>Book Demo</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </header>

      {/* 2. Hero Section */}
      <main className="flex-1 flex flex-col items-center pt-20 px-6 relative">
        
        {/* Floating Items Container (Absolute Positioning around the hero) */}
        <div className="absolute inset-0 max-w-7xl mx-auto pointer-events-none z-20">
          
          {/* Floating Element 1: 3D Camera / Scanner Node (Top Left) */}
          <div className="absolute left-[8%] top-[12%] animate-float hidden lg:block bg-white p-4 rounded-2xl shadow-xl shadow-slate-200/50 border border-slate-100 w-32 flex flex-col items-center gap-2">
            <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center border border-slate-200">
              <svg className="w-6 h-6 text-slate-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" />
                <circle cx="12" cy="13" r="4" />
              </svg>
            </div>
            <span className="text-[10px] font-mono font-bold text-slate-455">SCANNER A9</span>
          </div>

          {/* Floating Element 2: Small Grid Shelf Block (Left Center) */}
          <div className="absolute left-[6%] top-[45%] animate-float-delayed hidden lg:block bg-white p-3 rounded-2xl shadow-lg shadow-slate-200/60 border border-slate-100 w-24 text-center">
            <div className="text-2xl font-bold font-mono text-slate-800">28</div>
            <div className="text-[8px] font-mono text-slate-400 mt-1 uppercase">Shelves Free</div>
          </div>

          {/* Floating Element 3: Active Status Pager Tag (Right Top) */}
          <div className="absolute right-[8%] top-[15%] animate-float hidden lg:block bg-white p-4 rounded-2xl shadow-xl shadow-slate-200/50 border border-slate-100 w-32 flex flex-col items-center gap-2">
            <div className="w-12 h-12 bg-slate-50 rounded-xl flex items-center justify-center border border-slate-200">
              <Activity className="w-6 h-6 text-indigo-500 animate-pulse" />
            </div>
            <span className="text-[9px] font-mono text-emerald-600 font-bold bg-emerald-50 border border-emerald-100 px-2 py-0.5 rounded-full">
              ONLINE
            </span>
          </div>

          {/* Floating Element 4: Digital Audit Bubble (Right Center) */}
          <div className="absolute right-[5%] top-[48%] animate-float-delayed hidden lg:block bg-white p-4 rounded-2xl shadow-xl shadow-slate-200/60 border border-slate-100 w-40 space-y-1.5">
            <div className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 bg-indigo-500 rounded-full" />
              <span className="text-[9px] font-mono font-bold text-slate-400 uppercase">AUDIT EVENT</span>
            </div>
            <p className="text-[10px] font-bold text-slate-800 leading-tight">GPU Shard registered at shelf A-04-F</p>
          </div>

        </div>

        {/* Hero Headline Content */}
        <div className="text-center max-w-3xl space-y-6 relative z-30">
          
          {/* New Tag Pill */}
          <div className="inline-flex items-center gap-2 bg-yellow-100/70 border border-yellow-200 rounded-full px-3.5 py-1 text-[11px] font-semibold text-slate-800 shadow-xs">
            <span className="bg-yellow-400 text-yellow-950 px-1.5 py-0.5 rounded-full text-[9px] font-bold uppercase">New</span>
            <span className="text-slate-700">Introducing warehouse core OS v1.4</span>
          </div>

          {/* Headline */}
          <h1 className="text-5xl md:text-6xl font-display font-extrabold tracking-tight text-slate-900 leading-[1.08] select-none">
            Organize your warehouse <br />
            in <span className="bg-yellow-100 px-3.5 py-0.5 rounded-2xl border border-yellow-350 shadow-xs relative inline-block text-slate-950 font-bold">space.</span>
          </h1>

          {/* Subheading */}
          <p className="text-base md:text-lg text-slate-555 max-w-xl mx-auto leading-relaxed">
            Every physical storage shelf, data block, and transfer log. Mapped geometrically in real-time.
          </p>

          {/* Start CTA Button */}
          <div className="pt-2">
            <button
              onClick={onEnterDashboard}
              className="bg-black hover:bg-slate-800 text-white rounded-full px-8 py-4 font-semibold text-sm shadow-md hover:shadow-xl transition-all inline-flex items-center gap-2.5 cursor-pointer relative group"
            >
              {/* Green indicator dot */}
              <span className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
              <span>Launch Soko Console</span>
            </button>
          </div>

        </div>

        {/* 3. Dashboard Mockup Frame at the bottom (Assemble Calendar view style) */}
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
                      <span className="w-20 bg-indigo-650/40 rounded h-2.5" />
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
                          <span className="w-14 bg-slate-350 rounded h-4 block" />
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

        {/* Tech Stack Integrations Showcase */}
        <div className="mt-28 w-full max-w-5xl text-center space-y-10 relative z-30 mb-12">
          <div className="space-y-3">
            <span className="text-[11px] font-mono font-bold tracking-widest text-indigo-650 uppercase bg-indigo-50 border border-indigo-100 px-3.5 py-1 rounded-full">
              Ecosystem
            </span>
            <h2 className="text-3xl md:text-4xl font-display font-extrabold text-slate-900 tracking-tight">
              Build your perfect Tech Stack
            </h2>
            <p className="text-sm text-slate-500 max-w-lg mx-auto">
              Soko integrates seamlessly with industry-leading frontend frameworks, backend web runtimes, and distributed databases.
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-4 pt-4">
            {[
              { name: 'React', path: '/React-Logo.png', desc: 'Frontend Library' },
              { name: 'Next.js', path: '/nextjs7685.logowik.com.png', desc: 'App Framework' },
              { name: 'Angular', path: '/angular-icon-logo.png', desc: 'SPA Framework' },
              { name: 'Node.js', path: '/nodejs-icon.png', desc: 'Server Runtime' },
              { name: 'Express', path: '/express-js2119.logowik.com.png', desc: 'API Framework' },
              { name: 'MongoDB', path: '/external-mongodb-a-cross-platform-document-oriented-database-program-logo-color-tal-revivo.png', desc: 'Doc Store' },
              { name: 'Supabase', path: '/t_supabase-icon9119.logowik.com.png', desc: 'PostgreSQL DB' },
              { name: 'Pinecone', path: '/t_pinecone-database4602.logowik.com.png', desc: 'Vector Search' }
            ].map((tech) => (
              <div
                key={tech.name}
                className="group relative bg-white border border-slate-200/80 hover:border-indigo-300 rounded-2xl p-4 flex flex-col items-center justify-center gap-3 transition-all duration-350 hover:-translate-y-1.5 hover:shadow-xl hover:shadow-indigo-50/50 cursor-pointer"
              >
                <div className="w-12 h-12 flex items-center justify-center relative overflow-hidden">
                  <img
                    src={tech.path}
                    alt={tech.name}
                    className="w-full h-full object-contain filter grayscale opacity-75 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-300 ease-out group-hover:scale-110"
                  />
                </div>
                <div className="text-center">
                  <div className="text-xs font-bold text-slate-800 group-hover:text-indigo-650 transition-colors">
                    {tech.name}
                  </div>
                  <div className="text-[9px] font-mono text-slate-400 mt-0.5">
                    {tech.desc}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

      </main>

      {/* 4. Footer */}
      <footer className="py-12 border-t border-slate-150 bg-white text-center text-xs text-slate-500 font-mono mt-20">
        <p>© 2026 Soko Storehouse OS. All rights reserved.</p>
        <p className="mt-1 text-slate-400">Security Standard: FIPS-140-3 ISO/IEC-27001 Certified.</p>
      </footer>

    </div>
  )
}
