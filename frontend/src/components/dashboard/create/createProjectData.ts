/**
 * createProjectData.ts
 * --------------------
 * Data definitions and static constants: Project option choices, satellite hex node coordinates,
 * technology section lists, icon mappings, animation scale constants, and environment building status messages.
 */

import {
  Layers,
  Cpu,
  Database,
  Shield,
  Plus,
  Zap,
  Code2,
  Terminal,
  Network,
  ShieldCheck,
  KeyRound,
  Lock,
  HardDrive,
  Boxes
} from 'lucide-react'

export interface ProjectOption {
  type: 'separate' | 'fullstack'
  title: string
  desc: string
  Icon: React.ComponentType<{ className?: string }>
}

export interface SurroundingNode {
  id: string
  label: string
  category: string
  Icon: React.ComponentType<{ className?: string }>
  dx: number
  dy: number
}

export interface TechSection {
  category: string
  techs: string[]
}

export const OPTIONS: ProjectOption[] = [
  {
    type: 'separate',
    title: 'Separate / Decoupled',
    desc: 'Independent frontend & backend codebases with dedicated deployment targets.',
    Icon: Layers
  },
  {
    type: 'fullstack',
    title: 'Fullstack / Monolith',
    desc: 'Unified repository containing full client & server code in a single project setup.',
    Icon: Cpu
  }
]

// 6 surrounding nodes pushing out to each adjacent side of the hexagon
export const SURROUNDING_NODES: SurroundingNode[] = [
  { id: 'top-left', label: 'Frontend', category: 'Frontend', Icon: Layers, dx: -110, dy: -190 },
  { id: 'top-right', label: 'Backend', category: 'Backend', Icon: Cpu, dx: 110, dy: -190 },
  { id: 'right', label: 'Database', category: 'Database', Icon: Database, dx: 220, dy: 0 },
  { id: 'bottom-right', label: 'Extra Tech', category: 'Extra Tech', Icon: Plus, dx: 110, dy: 190 },
  { id: 'bottom-left', label: 'Extra Tech', category: 'Extra Tech', Icon: Plus, dx: -110, dy: 190 },
  { id: 'left', label: 'Auth', category: 'Auth', Icon: Shield, dx: -220, dy: 0 }
]

export const TECH_SECTIONS: TechSection[] = [
  {
    category: 'Frontend',
    techs: ['React', 'Next.js', 'Tailwind CSS', 'TypeScript', 'Vite']
  },
  {
    category: 'Backend',
    techs: ['Node.js', 'Express', 'Fastify', 'GraphQL', 'Python']
  },
  {
    category: 'Auth',
    techs: ['Clerk', 'NextAuth', 'Supabase Auth', 'OAuth 2.0', 'JWT']
  },
  {
    category: 'Database',
    techs: ['PostgreSQL', 'MongoDB', 'Redis', 'Prisma', 'Pinecone']
  }
]

export const TECH_DETAILS: Record<string, { logo?: string; mockupIcon?: React.ComponentType<{ className?: string }> }> = {
  'React': { logo: '/React-Logo.png' },
  'Next.js': { logo: '/nextjs7685.logowik.com.png' },
  'Tailwind CSS': { mockupIcon: Layers },
  'TypeScript': { mockupIcon: Code2 },
  'Vite': { mockupIcon: Zap },
  'Node.js': { logo: '/nodejs-icon.png' },
  'Express': { logo: '/express-js2119.logowik.com.png' },
  'Fastify': { mockupIcon: Cpu },
  'GraphQL': { mockupIcon: Network },
  'Python': { mockupIcon: Terminal },
  'Clerk': { mockupIcon: ShieldCheck },
  'NextAuth': { mockupIcon: KeyRound },
  'Supabase Auth': { logo: '/t_supabase-icon9119.logowik.com.png' },
  'OAuth 2.0': { mockupIcon: Lock },
  'JWT': { mockupIcon: Shield },
  'PostgreSQL': { mockupIcon: Database },
  'MongoDB': { logo: '/external-mongodb-a-cross-platform-document-oriented-database-program-logo-color-tal-revivo.png' },
  'Redis': { mockupIcon: HardDrive },
  'Prisma': { mockupIcon: Boxes },
  'Pinecone': { logo: '/t_pinecone-database4602.logowik.com.png' }
}

// 1. Initial size during selection & gliding to center:
export const INITIAL_HEXAGON_SCALE = 'scale-100'

// 2. Enlarged size for entering Title & Description textboxes:
export const ENLARGED_HEXAGON_SCALE = 'scale-[1.8] sm:scale-[1.85]'

// 3. Third size with Title in the center:
export const FINAL_HEXAGON_SCALE = 'scale-[0.82] sm:scale-[0.70]'

// 4. Initial scale of surrounding nodes before resize:
export const PRE_RESIZE_SCALE = 0.5

// Step 1 Centering & Fade Speed:
export const CENTERING_SPEED_MS = 600

export const STEP_CATEGORIES = ['Frontend', 'Backend', 'Auth', 'Database']
export const STEP_NODE_KEYS = ['top-left', 'top-right', 'left', 'right']

export const LOADING_MESSAGES = [
  'Synthesizing architecture & dependencies...',
  'Configuring database schema & ORM models...',
  'Wiring authentication & security policies...',
  'Assembling UI component design system...',
  'Optimizing API routes & serverless handlers...',
  'Finalizing development environment...'
]
