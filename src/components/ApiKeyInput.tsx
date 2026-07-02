import { useState } from 'react'

interface Props {
  value: string
  onChange: (key: string) => void
}

export default function ApiKeyInput({ value, onChange }: Props) {
  const [visible, setVisible] = useState(false)

  return (
    <div className="api-key-bar">
      <div className="api-key-inner">
        <span className="api-key-label">🔑 Groq API Key</span>
        <div className="api-key-field">
          <input
            type={visible ? 'text' : 'password'}
            placeholder="Paste your free Groq API key (console.groq.com)"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            spellCheck={false}
          />
          <button
            type="button"
            className="toggle-vis"
            onClick={() => setVisible((v) => !v)}
            aria-label={visible ? 'Hide key' : 'Show key'}
          >
            {visible ? '🙈' : '👁'}
          </button>
        </div>
        <span className="api-key-hint">
          Stored only in your browser session. Never sent to any server except Groq's API directly.
        </span>
      </div>
    </div>
  )
}
