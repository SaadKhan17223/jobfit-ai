import type { MissingKeyword } from '../lib/types'

interface Props {
  matched: string[]
  missing: MissingKeyword[]
}

export default function KeywordPanel({ matched, missing }: Props) {
  const critical = missing.filter((k) => k.importance === 'critical')
  const recommended = missing.filter((k) => k.importance === 'recommended')

  return (
    <div className="section">
      <h3 className="section-title">🔑 Keyword Analysis</h3>

      <div className="keyword-grid">
        <div className="keyword-col">
          <div className="kw-col-head matched-head">
            ✅ Matched ({matched.length})
          </div>
          <div className="kw-tags">
            {matched.length === 0 ? (
              <span className="no-items">None detected</span>
            ) : (
              matched.map((kw) => (
                <span key={kw} className="kw-tag matched">{kw}</span>
              ))
            )}
          </div>
        </div>

        <div className="keyword-col">
          <div className="kw-col-head missing-head">
            ❌ Missing ({missing.length})
          </div>
          <div className="kw-tags">
            {missing.length === 0 ? (
              <span className="no-items">Great — nothing critical missing!</span>
            ) : (
              <>
                {critical.map((kw) => (
                  <span key={kw.keyword} className="kw-tag critical" title="Critical — must add">
                    {kw.keyword}
                    <sup>!</sup>
                  </span>
                ))}
                {recommended.map((kw) => (
                  <span key={kw.keyword} className="kw-tag recommended">
                    {kw.keyword}
                  </span>
                ))}
              </>
            )}
          </div>
          {critical.length > 0 && (
            <p className="kw-hint">
              <sup>!</sup> Critical keywords are likely used in ATS filtering — add these first.
            </p>
          )}
        </div>
      </div>
    </div>
  )
}
