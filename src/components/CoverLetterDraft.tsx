import { useState } from 'react'

interface Props {
  text: string
}

export default function CoverLetterDraft({ text }: Props) {
  const [content, setContent] = useState(text)
  const [copied, setCopied] = useState(false)

  const copy = () => {
    navigator.clipboard.writeText(content)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="section">
      <div className="section-header-row">
        <h3 className="section-title">📬 Cover Letter Draft</h3>
        <button className="copy-btn primary-copy" onClick={copy}>
          {copied ? '✅ Copied!' : '📋 Copy to clipboard'}
        </button>
      </div>
      <p className="section-sub">
        Tailored to this specific role. Edit freely — it's just a starting point.
      </p>
      <textarea
        className="text-area cover-letter-area"
        value={content}
        onChange={(e) => setContent(e.target.value)}
        rows={14}
        spellCheck
      />
    </div>
  )
}
