export interface ResumeContact {
  name: string
  title: string
  email: string
  phone: string
  location: string
  linkedin?: string
  github?: string
}

export interface ResumeExperience {
  company: string
  role: string
  duration: string
  bullets: string[]
}

export interface ResumeEducation {
  degree: string
  institution: string
  year: string
}

export interface TailoredResume {
  contact: ResumeContact
  summary: string
  skills: string[]
  experience: ResumeExperience[]
  education: ResumeEducation[]
  certifications: string[]
}

export type TemplateId = 'classic' | 'modern' | 'minimal' | 'executive'

export interface Template {
  id: TemplateId
  name: string
  desc: string
  accent: string
  preview: string // emoji stand-in for thumbnail
}

export const TEMPLATES: Template[] = [
  {
    id: 'classic',
    name: 'Classic',
    desc: 'Traditional single-column. Safe for banking, legal, government.',
    accent: '#1a365d',
    preview: '📄',
  },
  {
    id: 'modern',
    name: 'Modern',
    desc: 'Two-column with sidebar. Ideal for tech and product roles.',
    accent: '#2563eb',
    preview: '🗂️',
  },
  {
    id: 'minimal',
    name: 'Minimal',
    desc: 'Ultra-clean, lots of whitespace. Great for design and consulting.',
    accent: '#374151',
    preview: '⬜',
  },
  {
    id: 'executive',
    name: 'Executive',
    desc: 'Bold header, strong hierarchy. Best for senior and C-level roles.',
    accent: '#7c3aed',
    preview: '💼',
  },
]
