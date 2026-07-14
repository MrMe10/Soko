import { Folder, Layers, Cpu, Clock, ChevronRight, Activity, Plus } from 'lucide-react'

interface Project {
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
      <div className="bg-white border border-slate-200/90 rounded-xl p-5 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-slate-900 m-0">Storehouse Projects</h2>
          <p className="text-xs text-slate-500 mt-1">Manage, partition, and coordinate independent data environments.</p>
        </div>
        
        <button
          onClick={onAddProjectClick}
          className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg px-4 py-2 text-xs font-semibold shadow shadow-indigo-600/10 hover:shadow-md transition-all flex items-center gap-1.5 self-start sm:self-auto cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>New Project</span>
        </button>
      </div>

      {/* Projects Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {projects.map((project) => (
          <div
            key={project.id}
            onClick={() => onSelectProject(project)}
            className="group relative bg-white border border-slate-200/80 hover:border-indigo-300 rounded-2xl p-5 flex flex-col justify-between hover:shadow-xl hover:shadow-indigo-50/40 transition-all duration-300 cursor-pointer"
          >
            
            {/* Top Row: Icon & Status */}
            <div className="flex items-start justify-between">
              <div className="w-10 h-10 bg-indigo-50 border border-indigo-100 text-indigo-650 rounded-xl flex items-center justify-center shrink-0">
                <Folder className="w-5 h-5" />
              </div>

              <div className="flex flex-col items-end gap-1">
                <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[9px] font-mono font-bold ${
                  project.status === 'active'
                    ? 'bg-emerald-50 text-emerald-700 border border-emerald-250/50'
                    : 'bg-indigo-50 text-indigo-700 border border-indigo-250/50'
                }`}>
                  <span className={`w-1.5 h-1.5 rounded-full ${project.status === 'active' ? 'bg-emerald-500 animate-pulse' : 'bg-indigo-500'}`} />
                  {project.status.toUpperCase()}
                </span>
                
                {/* Architecture badge */}
                <span className="inline-flex items-center gap-1 text-[9px] font-mono text-slate-400">
                  {project.type === 'separate' ? (
                    <>
                      <Layers className="w-3 h-3 text-slate-450" />
                      <span>DECOUPLED</span>
                    </>
                  ) : (
                    <>
                      <Cpu className="w-3 h-3 text-slate-455" />
                      <span>MONOLITH</span>
                    </>
                  )}
                </span>
              </div>
            </div>

            {/* Info Body */}
            <div className="mt-4 space-y-2">
              <h3 className="text-sm font-bold text-slate-900 group-hover:text-indigo-650 transition-colors leading-tight font-display">
                {project.name}
              </h3>
              <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">
                {project.description || 'No description provided for this storehouse environment.'}
              </p>
            </div>

            {/* Premium Mock Stats Area */}
            <div className="mt-5 pt-4 border-t border-slate-100 grid grid-cols-2 gap-4 text-left select-none">
              <div>
                <span className="text-[9px] font-mono text-slate-400 block uppercase tracking-wider">Active Shelves</span>
                <span className="text-xs font-bold text-slate-800 mt-0.5 block">
                  {project.id === 'soko-core' ? '12 / 80' : '0 / 80'}
                </span>
              </div>
              <div>
                <span className="text-[9px] font-mono text-slate-400 block uppercase tracking-wider">Throughput</span>
                <span className="text-xs font-bold text-slate-800 mt-0.5 block flex items-center gap-1">
                  <Activity className="w-3 h-3 text-indigo-500" />
                  {project.id === 'soko-core' ? '148.5 MB/s' : '0.0 MB/s'}
                </span>
              </div>
            </div>

            {/* Footer entry indicator */}
            <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] font-mono text-slate-450">
              <span className="flex items-center gap-1">
                <Clock className="w-3 h-3" />
                <span>{project.createdAt}</span>
              </span>
              <span className="text-indigo-650 font-bold group-hover:translate-x-1.5 transition-transform duration-200 flex items-center gap-0.5">
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
