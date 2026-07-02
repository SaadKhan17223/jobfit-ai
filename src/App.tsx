import { useState } from 'react'
import ApiKeyInput from './components/ApiKeyInput'
import ResumeUploader from './components/ResumeUploader'
import JDInput from './components/JDInput'
import ScoreRing from './components/ScoreRing'
import KeywordPanel from './components/KeywordPanel'
import SkillsGap from './components/SkillsGap'
import BulletRewriter from './components/BulletRewriter'
import CoverLetterDraft from './components/CoverLetterDraft'
import TemplateSelector from './components/TemplateSelector'
import ResumePreview from './components/ResumePreview'
import { analyzeResume } from './lib/gemini'
import { tailorResume } from './lib/tailor'
import type { AnalysisResult, AppStep } from './lib/types'
import type { TailoredResume, TemplateId } from './lib/resumeTypes'

export default function App() {
  const [apiKey, setApiKey]               = useState(() => sessionStorage.getItem('groq_key') ?? '')
  const [resumeText, setResumeText]       = useState('')
  const [jobDesc, setJobDesc]             = useState('')
  const [step, setStep]                   = useState<AppStep>('input')
  const [result, setResult]               = useState<AnalysisResult | null>(null)
  const [error, setError]                 = useState<string | null>(null)
  const [loadingMsg, setLoadingMsg]       = useState('')

  // Template & tailored resume state
  const [selectedTemplate, setSelectedTemplate] = useState<TemplateId | null>(null)
  const [tailoring, setTailoring]               = useState(false)
  const [tailored, setTailored]                 = useState<TailoredResume | null>(null)
  const [tailorError, setTailorError]           = useState<string | null>(null)

  const handleApiKey = (key: string) => {
    setApiKey(key)
    sessionStorage.setItem('groq_key', key)
  }

  const canAnalyze = apiKey.trim() && resumeText.trim() && jobDesc.trim()

  const loadingMessages = [
    'Reading your resume…',
    'Parsing the job description…',
    'Running ATS keyword matching…',
    'Identifying skill gaps…',
    'Rewriting weak bullet points…',
    'Drafting your cover letter…',
    'Finalizing analysis…',
  ]

  const analyze = async () => {
    setError(null)
    setStep('analyzing')
    let msgIdx = 0
    setLoadingMsg(loadingMessages[0])
    const interval = setInterval(() => {
      msgIdx = (msgIdx + 1) % loadingMessages.length
      setLoadingMsg(loadingMessages[msgIdx])
    }, 2200)
    try {
      const data = await analyzeResume(apiKey, resumeText, jobDesc)
      setResult(data)
      setTailored(null)
      setSelectedTemplate(null)
      setStep('results')
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Something went wrong. Please try again.')
      setStep('input')
    } finally {
      clearInterval(interval)
    }
  }

  const handleGenerate = async () => {
    if (!selectedTemplate || !result) return
    setTailorError(null)
    setTailoring(true)
    setTailored(null)
    try {
      const data = await tailorResume(apiKey, resumeText, jobDesc, result)
      setTailored(data)
    } catch (e) {
      setTailorError(e instanceof Error ? e.message : 'Failed to generate resume. Try again.')
    } finally {
      setTailoring(false)
    }
  }

  const reset = () => {
    setStep('input')
    setResult(null)
    setError(null)
    setResumeText('')
    setJobDesc('')
    setTailored(null)
    setSelectedTemplate(null)
    setTailorError(null)
  }

  // ─── Analyzing screen ──────────────────────────────────────────────────────
  if (step === 'analyzing') {
    return (
      <div className="app">
        <header className="app-header">
          <div className="logo">JobFit <span>AI</span></div>
        </header>
        <div className="analyzing-screen">
          <div className="spinner large" />
          <h2>{loadingMsg}</h2>
          <p>Groq LLaMA is analyzing your resume against the job description…</p>
        </div>
      </div>
    )
  }

  // ─── Results screen ────────────────────────────────────────────────────────
  if (step === 'results' && result) {
    return (
      <div className="app">
        <header className="app-header">
          <div className="logo">JobFit <span>AI</span></div>
          <button className="btn-secondary" onClick={reset}>← New Analysis</button>
        </header>

        <main className="results-main">
          <ScoreRing score={result.ats_score} summary={result.summary} />
          <KeywordPanel matched={result.matched_keywords} missing={result.missing_keywords} />
          <SkillsGap gaps={result.skills_gap} />
          <BulletRewriter rewrites={result.bullet_rewrites} />
          <CoverLetterDraft text={result.cover_letter} />

          {/* Template selector */}
          {!tailored ? (
            <>
              <TemplateSelector
                selected={selectedTemplate}
                onSelect={setSelectedTemplate}
                onGenerate={handleGenerate}
                loading={tailoring}
              />
              {tailorError && <div className="error-banner">⚠ {tailorError}</div>}
            </>
          ) : (
            <ResumePreview
              data={tailored}
              templateId={selectedTemplate!}
              onBack={() => { setTailored(null); setSelectedTemplate(null) }}
            />
          )}

          <div className="results-footer">
            <button className="btn-secondary" onClick={reset}>← Analyze Another Role</button>
          </div>
        </main>
      </div>
    )
  }

  // ─── Input screen ──────────────────────────────────────────────────────────
  return (
    <div className="app">
      <header className="app-header">
        <div className="logo">JobFit <span>AI</span></div>
        <span className="privacy-badge">🔒 100% in-browser — your data never leaves your device</span>
      </header>

      <main className="input-main">
        <div className="hero">
          <h1>Land more interviews.</h1>
          <p>Paste your resume and a job description. Get an ATS score, keyword gap, bullet rewrites, cover letter, and a fully tailored downloadable resume.</p>
        </div>

        <ApiKeyInput value={apiKey} onChange={handleApiKey} />

        {error && <div className="error-banner">⚠ {error}</div>}

        <div className="input-grid">
          <ResumeUploader resumeText={resumeText} onResumeText={setResumeText} />
          <JDInput value={jobDesc} onChange={setJobDesc} />
        </div>

        <div className="analyze-row">
          <button className="btn-primary" disabled={!canAnalyze} onClick={analyze}>
            {canAnalyze ? '⚡ Analyze My Resume' : 'Fill in all three fields above'}
          </button>
          {!canAnalyze && (
            <ul className="checklist">
              <li className={apiKey.trim() ? 'done' : ''}>Groq API key</li>
              <li className={resumeText.trim() ? 'done' : ''}>Resume</li>
              <li className={jobDesc.trim() ? 'done' : ''}>Job description</li>
            </ul>
          )}
        </div>
      </main>

      <footer className="app-footer">
        <p>Built with Groq LLaMA 3.3 70B · Free to use · Open source</p>
        <a href="https://console.groq.com" target="_blank" rel="noreferrer">
          Get your free Groq API key →
        </a>
      </footer>
    </div>
  )
}
