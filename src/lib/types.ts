export interface MissingKeyword {
  keyword: string
  importance: 'critical' | 'recommended'
}

export interface SkillGap {
  skill: string
  importance: 'high' | 'medium' | 'low'
  how_to_show: string
}

export interface BulletRewrite {
  original: string
  improved: string
}

export interface AnalysisResult {
  ats_score: number
  summary: string
  matched_keywords: string[]
  missing_keywords: MissingKeyword[]
  skills_gap: SkillGap[]
  bullet_rewrites: BulletRewrite[]
  cover_letter: string
}

export type AppStep = 'input' | 'analyzing' | 'results'
