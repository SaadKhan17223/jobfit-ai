import { useRef, useState, DragEvent } from 'react'
import { extractTextFromPdf } from '../lib/extractPdf'

interface Props {
  resumeText: string
  onResumeText: (text: string) => void
}

export default function ResumeUploader({ resumeText, onResumeText }: Props) {
  const [dragging, setDragging] = useState(false)
  const [fileName, setFileName] = useState<string | null>(null)
  const [extracting, setExtracting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [mode, setMode] = useState<'upload' | 'paste'>('upload')
  const inputRef = useRef<HTMLInputElement>(null)

  const handleFile = async (file: File) => {
    setError(null)
    if (file.type !== 'application/pdf') {
      setError('Only PDF files are supported.')
      return
    }
    setExtracting(true)
    setFileName(file.name)
    try {
      const text = await extractTextFromPdf(file)
      if (!text.trim()) throw new Error('Could not extract text. Try pasting your resume instead.')
      onResumeText(text)
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Extraction failed.')
      setFileName(null)
    } finally {
      setExtracting(false)
    }
  }

  const onDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    setDragging(false)
    const file = e.dataTransfer.files[0]
    if (file) handleFile(file)
  }

  return (
    <div className="card">
      <div className="card-header">
        <h2>📄 Your Resume</h2>
        <div className="mode-toggle">
          <button
            className={mode === 'upload' ? 'active' : ''}
            onClick={() => setMode('upload')}
          >
            Upload PDF
          </button>
          <button
            className={mode === 'paste' ? 'active' : ''}
            onClick={() => setMode('paste')}
          >
            Paste Text
          </button>
        </div>
      </div>

      {mode === 'upload' ? (
        <>
          <div
            className={`drop-zone ${dragging ? 'dragging' : ''} ${fileName ? 'has-file' : ''}`}
            onDragOver={(e) => { e.preventDefault(); setDragging(true) }}
            onDragLeave={() => setDragging(false)}
            onDrop={onDrop}
            onClick={() => inputRef.current?.click()}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => e.key === 'Enter' && inputRef.current?.click()}
            aria-label="Upload PDF resume"
          >
            <input
              ref={inputRef}
              type="file"
              accept=".pdf"
              style={{ display: 'none' }}
              onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])}
            />
            {extracting ? (
              <div className="drop-state">
                <div className="spinner" />
                <span>Extracting text from PDF…</span>
              </div>
            ) : fileName && resumeText ? (
              <div className="drop-state success">
                <span className="drop-icon">✅</span>
                <span>{fileName}</span>
                <small>{resumeText.split(' ').length} words extracted</small>
                <button className="link-btn" onClick={(e) => { e.stopPropagation(); onResumeText(''); setFileName(null) }}>
                  Remove
                </button>
              </div>
            ) : (
              <div className="drop-state">
                <span className="drop-icon">📎</span>
                <span>Drop your PDF here or click to browse</span>
                <small>Only PDF files supported</small>
              </div>
            )}
          </div>
          {error && <p className="field-error">{error}</p>}
        </>
      ) : (
        <textarea
          className="text-area"
          placeholder="Paste your resume text here…"
          value={resumeText}
          onChange={(e) => onResumeText(e.target.value)}
          rows={12}
        />
      )}
    </div>
  )
}
