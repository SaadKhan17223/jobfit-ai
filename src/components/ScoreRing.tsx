import { useEffect, useState } from 'react'

interface Props {
  score: number
  summary: string
}

export default function ScoreRing({ score, summary }: Props) {
  const [animated, setAnimated] = useState(0)

  useEffect(() => {
    const timer = setTimeout(() => setAnimated(score), 100)
    return () => clearTimeout(timer)
  }, [score])

  const radius = 56
  const circumference = 2 * Math.PI * radius
  const progress = (animated / 100) * circumference

  const color =
    score >= 75 ? '#22c55e' :
    score >= 50 ? '#f59e0b' :
    '#ef4444'

  const label =
    score >= 75 ? 'Strong Match' :
    score >= 50 ? 'Moderate Match' :
    'Needs Work'

  return (
    <div className="score-section">
      <div className="score-ring-wrap">
        <svg width="148" height="148" viewBox="0 0 148 148" aria-label={`ATS score: ${score} out of 100`}>
          {/* Track */}
          <circle cx="74" cy="74" r={radius} fill="none" stroke="var(--border)" strokeWidth="10" />
          {/* Progress */}
          <circle
            cx="74" cy="74" r={radius}
            fill="none"
            stroke={color}
            strokeWidth="10"
            strokeLinecap="round"
            strokeDasharray={`${progress} ${circumference}`}
            transform="rotate(-90 74 74)"
            style={{ transition: 'stroke-dasharray 1.2s cubic-bezier(0.4, 0, 0.2, 1)' }}
          />
          {/* Score text */}
          <text x="74" y="68" textAnchor="middle" fontSize="30" fontWeight="600" fill={color}>
            {score}
          </text>
          <text x="74" y="86" textAnchor="middle" fontSize="11" fill="var(--text-muted)">
            / 100
          </text>
        </svg>
        <div className="score-label" style={{ color }}>{label}</div>
      </div>

      <div className="score-summary">
        <h3>AI Assessment</h3>
        <p>{summary}</p>
      </div>
    </div>
  )
}
