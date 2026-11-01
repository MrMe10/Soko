import { Folder, Layers, Cpu, Clock, ChevronRight, Activity, Plus } from 'lucide-react'

export interface Project {
  id: string
  name: string
  description: string
  type: 'separate' | 'fullstack'
  createdAt: string
  status: 'active' | 'synced' | 'inactive'
}

interface ProjectsViewProps {
  projects: Project[]
  onSelectProject: (project: Project) => void
  onAddProjectClick: () => void
}

export default function ProjectsView({ projects, onSelectProject, onAddProjectClick }: ProjectsViewProps) {
  return (
    <div className="space-y-6">
      
      {/* View Header */}
      <div className="bg-zinc-900/90 border border-zinc-800 rounded-xl p-5 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-white m-0">Storehouse Projects</h2>
          <p className="text-xs text-zinc-400 mt-1">Manage, partition, and coordinate independent data environments.</p>
        </div>
        
        <button
          onClick={onAddProjectClick}
          className="bg-emerald-500 hover:bg-emerald-400 text-black rounded-lg px-4 py-2 text-xs font-extrabold shadow-lg shadow-emerald-500/20 hover:shadow-emerald-500/40 transition-all flex items-center gap-1.5 self-start sm:self-auto cursor-pointer active:scale-95"
        >
          <Plus className="w-4 h-4 text-black stroke-[3]" />
          <span>New Project</span>
        </button>
      </div>

      {/* Projects Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {projects.map((project) => (
          <div
            key={project.id}
            onClick={() => onSelectProject(project)}
            className="group relative bg-zinc-900/80 border border-zinc-800 hover:border-emerald-500/50 hover:bg-zinc-850/80 rounded-2xl p-5 flex flex-col justify-between hover:shadow-xl hover:shadow-emerald-950/40 transition-all duration-300 cursor-pointer"
          >
            
            {/* Top Row: Icon & Status */}
            <div className="flex items-start justify-between">
              <div className="w-10 h-10 bg-emerald-950/60 border border-emerald-800/60 text-emerald-400 rounded-xl flex items-center justify-center shrink-0 shadow-xs">
                <Folder className="w-5 h-5" />
              </div>

              <div className="flex flex-col items-end gap-1">
                <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[9px] font-mono font-bold ${
                  project.status === 'active'
                    ? 'bg-emerald-950/80 text-emerald-400 border border-emerald-800/80'
                    : 'bg-zinc-800 text-zinc-300 border border-zinc-700'
                }`}>
                  <span className={`w-1.5 h-1.5 rounded-full ${project.status === 'active' ? 'bg-emerald-400 animate-pulse' : 'bg-zinc-500'}`} />
                  {project.status.toUpperCase()}
                </span>
                
                {/* Architecture badge */}
                <span className="inline-flex items-center gap-1 text-[9px] font-mono text-zinc-500">
                  {project.type === 'separate' ? (
                    <>
                      <Layers className="w-3 h-3 text-zinc-400" />
                      <span>DECOUPLED</span>
                    </>
                  ) : (
                    <>
                      <Cpu className="w-3 h-3 text-zinc-400" />
                      <span>MONOLITH</span>
                    </>
                  )}
                </span>
              </div>
            </div>

            {/* Info Body */}
            <div className="mt-4 space-y-2">
              <h3 className="text-sm font-bold text-white group-hover:text-emerald-400 transition-colors leading-tight font-display">
                {project.name}
              </h3>
              <p className="text-xs text-zinc-400 line-clamp-2 leading-relaxed">
                {project.description || 'No description provided for this storehouse environment.'}
              </p>
            </div>

            {/* Premium Mock Stats Area */}
            <div className="mt-5 pt-4 border-t border-zinc-800/80 grid grid-cols-2 gap-4 text-left select-none">
              <div>
                <span className="text-[9px] font-mono text-zinc-500 block uppercase tracking-wider">Active Shelves</span>
                <span className="text-xs font-bold text-zinc-200 mt-0.5 block">
                  {project.id === 'soko-core' ? '12 / 80' : '0 / 80'}
                </span>
              </div>
              <div>
                <span className="text-[9px] font-mono text-zinc-500 block uppercase tracking-wider">Throughput</span>
                <span className="text-xs font-bold text-zinc-200 mt-0.5 block flex items-center gap-1">
                  <Activity className="w-3 h-3 text-emerald-400" />
                  {project.id === 'soko-core' ? '148.5 MB/s' : '0.0 MB/s'}
                </span>
              </div>
            </div>

            {/* Footer entry indicator */}
            <div className="mt-5 pt-3 border-t border-zinc-800/80 flex items-center justify-between text-[11px] font-mono text-zinc-500">
              <span className="flex items-center gap-1 text-zinc-400">
                <Clock className="w-3 h-3 text-zinc-500" />
                <span>{project.createdAt}</span>
              </span>
              <span className="text-emerald-400 font-bold group-hover:translate-x-1.5 transition-transform duration-200 flex items-center gap-0.5">
                <span>Enter Console</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </span>
            </div>

          </div>
        ))}
      </div>

    </div>
  )
}
