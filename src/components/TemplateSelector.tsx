import { TEMPLATES, type TemplateId } from '../lib/resumeTypes'

interface Props {
  selected: TemplateId | null
  onSelect: (id: TemplateId) => void
  onGenerate: () => void
  loading: boolean
}

export default function TemplateSelector({ selected, onSelect, onGenerate, loading }: Props) {
  return (
    <div className="section">
      <h3 className="section-title">🎨 Generate Tailored Resume</h3>
      <p className="section-sub">
        Pick a template — AI will rewrite your resume with all missing keywords and improved bullets woven in, ready to download as PDF.
      </p>

      <div className="template-grid">
        {TEMPLATES.map((tpl) => (
          <label
            key={tpl.id}
            className={`template-card ${selected === tpl.id ? 'selected' : ''}`}
            style={{ '--tpl-accent': tpl.accent } as React.CSSProperties}
          >
            <div className="template-card-top">
              <span className="template-thumb">{tpl.preview}</span>
              <input
                type="radio"
                name="resume-template"
                value={tpl.id}
                checked={selected === tpl.id}
                onChange={() => onSelect(tpl.id)}
                className="tpl-radio"
              />
            </div>
            <div className="template-info">
              <strong>{tpl.name}</strong>
              <span>{tpl.desc}</span>
            </div>
          </label>
        ))}
      </div>

      <button
        className="btn-primary"
        style={{ marginTop: '1rem' }}
        disabled={!selected || loading}
        onClick={onGenerate}
      >
        {loading
          ? '⏳ Generating tailored resume…'
          : selected
          ? `✨ Generate ${TEMPLATES.find(t => t.id === selected)?.name} Resume`
          : 'Select a template above'}
      </button>
    </div>
  )
}
