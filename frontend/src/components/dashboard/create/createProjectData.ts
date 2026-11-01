/**
 * createProjectData.ts
 * --------------------
 * Data definitions and static constants: Project option choices, satellite hex node coordinates,
 * technology section lists, icon mappings, animation scale constants, and environment building status messages.
 */

import React from 'react'
import {
  Layers,
  Cpu,
  Database,
  Shield,
  Zap,
  Code2,
  Terminal,
  Network,
  ShieldCheck,
  KeyRound,
  Lock,
  HardDrive,
  Boxes,
  Mail,
  Server,
  Globe
} from 'lucide-react'
import type { LucideIcon } from 'lucide-react'

export type ArchitectureType = 'separate' | 'fullstack'

export type NodeId = 'top-left' | 'top-right' | 'left' | 'right' | 'bottom-left' | 'bottom-right'

export interface ProjectOption {
  type: ArchitectureType
  title: string
  desc: string
  Icon: React.ComponentType<{ className?: string }>
}

export interface SurroundingNode {
  id: NodeId
  label: string
  category: string
  Icon: LucideIcon
  dx: number
  dy: number
}

export interface TechSection {
  category: string
  techs: string[]
}

export interface TechDetail {
  logo?: string
  mockupIcon?: LucideIcon
}

// -------------------------------------------------------------
// Hexagon Geometry & Layout Constants
// -------------------------------------------------------------
export const HEX_POINTS = '120,5 230,68 230,195 120,258 10,195 10,68'
export const PREVIEW_HEX_POINTS = '60,2.5 115,34 115,96 60,127.5 5,96 5,34'
export const HEX_ORIGIN = '120px 131.5px'
export const HEX_PUSH_FACTOR = 0.72

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

// 4 Shared satellite nodes common to both architectures
const SHARED_SATELLITE_NODES: SurroundingNode[] = [
  { id: 'right', label: 'Database', category: 'Database', Icon: Database, dx: 220, dy: 0 },
  { id: 'bottom-right', label: 'Hosting', category: 'Hosting', Icon: Server, dx: 110, dy: 190 },
  { id: 'bottom-left', label: 'Email Service', category: 'Email Service', Icon: Mail, dx: -110, dy: 190 },
  { id: 'left', label: 'Auth', category: 'Auth', Icon: Shield, dx: -220, dy: 0 }
]

// 6 surrounding nodes for Decoupled / Separate architecture
export const SURROUNDING_NODES_SEPARATE: SurroundingNode[] = [
  { id: 'top-left', label: 'Frontend', category: 'Frontend', Icon: Layers, dx: -110, dy: -190 },
  { id: 'top-right', label: 'Backend', category: 'Backend', Icon: Cpu, dx: 110, dy: -190 },
  ...SHARED_SATELLITE_NODES
]

// 6 surrounding nodes for Fullstack architecture
export const SURROUNDING_NODES_FULLSTACK: SurroundingNode[] = [
  { id: 'top-left', label: 'Frontend', category: 'Fullstack Framework', Icon: Layers, dx: -110, dy: -190 },
  { id: 'top-right', label: 'Backend', category: 'Fullstack Framework', Icon: Cpu, dx: 110, dy: -190 },
  ...SHARED_SATELLITE_NODES
]

export const getSurroundingNodes = (type: ArchitectureType): SurroundingNode[] =>
  type === 'fullstack' ? SURROUNDING_NODES_FULLSTACK : SURROUNDING_NODES_SEPARATE

// 4 Shared technology sections common to both architectures
const SHARED_TECH_SECTIONS: TechSection[] = [
  {
    category: 'Auth',
    techs: ['Clerk', 'NextAuth', 'Supabase Auth', 'OAuth 2.0', 'JWT']
  },
  {
    category: 'Database',
    techs: ['PostgreSQL', 'MongoDB', 'Redis', 'Prisma', 'Pinecone']
  },
  {
    category: 'Email Service',
    techs: ['Resend', 'SendGrid', 'Postmark', 'Nodemailer', 'AWS SES']
  },
  {
    category: 'Hosting',
    techs: ['Vercel', 'AWS', 'Netlify', 'Render', 'Docker']
  }
]

export const TECH_SECTIONS_SEPARATE: TechSection[] = [
  {
    category: 'Frontend',
    techs: ['React', 'Vue.js', 'Svelte', 'Tailwind CSS', 'TypeScript', 'Vite']
  },
  {
    category: 'Backend',
    techs: ['Node.js', 'Express', 'Fastify', 'NestJS', 'GraphQL', 'Python']
  },
  ...SHARED_TECH_SECTIONS
]

export const TECH_SECTIONS_FULLSTACK: TechSection[] = [
  {
    category: 'Fullstack Framework',
    techs: ['Next.js', 'Remix', 'Nuxt.js', 'SvelteKit', 'Astro', 'Laravel']
  },
  ...SHARED_TECH_SECTIONS
]

export const getTechSections = (type: ArchitectureType): TechSection[] =>
  type === 'fullstack' ? TECH_SECTIONS_FULLSTACK : TECH_SECTIONS_SEPARATE

export const TECH_DETAILS: Record<string, TechDetail> = {
  'Next.js': { logo: '/nextjs7685.logowik.com.png' },
  'Remix': { mockupIcon: Layers },
  'Nuxt.js': { mockupIcon: Zap },
  'SvelteKit': { mockupIcon: Code2 },
  'Astro': { mockupIcon: Globe },
  'Laravel': { mockupIcon: Cpu },
  'React': { logo: '/React-Logo.png' },
  'Vue.js': { mockupIcon: Layers },
  'Svelte': { mockupIcon: Code2 },
  'Tailwind CSS': { mockupIcon: Layers },
  'TypeScript': { mockupIcon: Code2 },
  'Vite': { mockupIcon: Zap },
  'Node.js': { logo: '/nodejs-icon.png' },
  'Express': { logo: '/express-js2119.logowik.com.png' },
  'Fastify': { mockupIcon: Cpu },
  'NestJS': { mockupIcon: Terminal },
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
  'Pinecone': { logo: '/t_pinecone-database4602.logowik.com.png' },
  'Resend': { mockupIcon: Mail },
  'SendGrid': { mockupIcon: Mail },
  'Postmark': { mockupIcon: Mail },
  'Nodemailer': { mockupIcon: Mail },
  'AWS SES': { mockupIcon: Mail },
  'Vercel': { mockupIcon: Server },
  'AWS': { mockupIcon: Server },
  'Netlify': { mockupIcon: Server },
  'Render': { mockupIcon: Server },
  'Docker': { mockupIcon: Server }
}

export const getTechDetails = (techName?: string | null): TechDetail => {
  if (!techName) return { mockupIcon: Layers }
  return TECH_DETAILS[techName] || { mockupIcon: Layers }
}

export const STEP_CATEGORIES_SEPARATE = ['Frontend', 'Backend', 'Auth', 'Database', 'Email Service', 'Hosting']
export const STEP_NODE_KEYS_SEPARATE: NodeId[] = ['top-left', 'top-right', 'left', 'right', 'bottom-left', 'bottom-right']

export const STEP_CATEGORIES_FULLSTACK = ['Fullstack Framework', 'Auth', 'Database', 'Email Service', 'Hosting']
export const STEP_NODE_KEYS_FULLSTACK: NodeId[] = ['top-left', 'left', 'right', 'bottom-left', 'bottom-right']

export const getStepCategories = (type: ArchitectureType): string[] =>
  type === 'fullstack' ? STEP_CATEGORIES_FULLSTACK : STEP_CATEGORIES_SEPARATE

export const getStepNodeKeys = (type: ArchitectureType): NodeId[] =>
  type === 'fullstack' ? STEP_NODE_KEYS_FULLSTACK : STEP_NODE_KEYS_SEPARATE

export const LOADING_MESSAGES = [
  'Synthesizing architecture & dependencies...',
  'Configuring database schema & ORM models...',
  'Wiring authentication & security policies...',
  'Assembling UI component design system...',
  'Optimizing API routes & serverless handlers...',
  'Finalizing development environment...'
]

