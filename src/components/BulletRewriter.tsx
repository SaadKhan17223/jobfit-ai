import { useState } from 'react'
import type { BulletRewrite } from '../lib/types'

interface Props {
  rewrites: BulletRewrite[]
}

export default function BulletRewriter({ rewrites }: Props) {
  const [copied, setCopied] = useState<number | null>(null)

  const copy = (text: string, idx: number) => {
    navigator.clipboard.writeText(text)
    setCopied(idx)
    setTimeout(() => setCopied(null), 2000)
  }

  if (rewrites.length === 0) return null

  return (
    <div className="section">
      <h3 className="section-title">✍️ Bullet Point Rewrites</h3>
      <p className="section-sub">
        AI-improved versions of your weakest bullets — quantified, action-driven, and tailored to this role.
      </p>

      <div className="bullets-list">
        {rewrites.map((rw, idx) => (
          <div key={idx} className="bullet-item">
            <div className="bullet-pair">
              <div className="bullet-col before">
                <span className="bullet-col-label">Before</span>
                <p>{rw.original}</p>
              </div>
              <div className="bullet-arrow">→</div>
              <div className="bullet-col after">
                <span className="bullet-col-label">After</span>
                <p>{rw.improved}</p>
                <button
                  className="copy-btn"
                  onClick={() => copy(rw.improved, idx)}
                >
                  {copied === idx ? '✅ Copied' : '📋 Copy'}
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
