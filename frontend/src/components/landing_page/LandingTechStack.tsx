import React from 'react'

export const LandingTechStack: React.FC = () => {
  return (
    <div className="mt-28 w-full max-w-5xl text-center space-y-10 relative z-30 mb-12">
      <div className="space-y-3">
        <span className="text-[11px] font-mono font-bold tracking-widest text-emerald-400 uppercase bg-emerald-950/50 border border-emerald-800/60 px-3.5 py-1 rounded-full">
          Ecosystem
        </span>
        <h2 className="text-3xl md:text-4xl font-display font-extrabold text-white tracking-tight">
          Build your perfect Tech Stack
        </h2>
        <p className="text-sm text-zinc-400 max-w-lg mx-auto">
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
            className="group relative bg-zinc-900/80 border border-zinc-800 hover:border-emerald-500/60 hover:bg-zinc-800/90 rounded-2xl p-4 flex flex-col items-center justify-center gap-3 transition-all duration-350 hover:-translate-y-1.5 hover:shadow-xl hover:shadow-emerald-950/40 cursor-pointer"
          >
            <div className="w-12 h-12 flex items-center justify-center relative overflow-hidden">
              <img
                src={tech.path}
                alt={tech.name}
                className="w-full h-full object-contain filter grayscale opacity-75 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-300 ease-out group-hover:scale-110"
              />
            </div>
            <div className="text-center">
              <div className="text-xs font-bold text-zinc-100 group-hover:text-emerald-400 transition-colors">
                {tech.name}
              </div>
              <div className="text-[9px] font-mono text-zinc-400 mt-0.5">
                {tech.desc}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
