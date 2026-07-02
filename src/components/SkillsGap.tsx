import type { SkillGap } from '../lib/types'

interface Props {
  gaps: SkillGap[]
}

const importanceMeta = {
  high:   { label: 'High',   color: 'var(--red)',    bg: 'var(--red-bg)'    },
  medium: { label: 'Medium', color: 'var(--amber)',  bg: 'var(--amber-bg)'  },
  low:    { label: 'Low',    color: 'var(--green)',  bg: 'var(--green-bg)'  },
}

export default function SkillsGap({ gaps }: Props) {
  if (gaps.length === 0) return null

  return (
    <div className="section">
      <h3 className="section-title">📈 Skills Gap Analysis</h3>
      <p className="section-sub">
        Skills the job requires that aren't evident in your resume — with specific advice on how to bridge each gap.
      </p>

      <div className="gap-table">
        <div className="gap-row gap-header">
          <span>Skill</span>
          <span>Priority</span>
          <span>How to address it</span>
        </div>
        {gaps.map((gap, idx) => {
          const meta = importanceMeta[gap.importance]
          return (
            <div key={idx} className="gap-row">
              <span className="gap-skill">{gap.skill}</span>
              <span>
                <span
                  className="importance-badge"
                  style={{ color: meta.color, background: meta.bg }}
                >
                  {meta.label}
                </span>
              </span>
              <span className="gap-advice">{gap.how_to_show}</span>
            </div>
          )
        })}
      </div>
    </div>
  )
}
