import { useRef } from 'react'
import type { TailoredResume, TemplateId } from '../lib/resumeTypes'

interface Props {
  data: TailoredResume
  templateId: TemplateId
  onBack: () => void
}

// ─── Shared helpers ─────────────────────────────────────────────────────────

function ContactLine({ data }: { data: TailoredResume['contact'] }) {
  const parts = [data.email, data.phone, data.location, data.linkedin, data.github].filter(Boolean)
  return <>{parts.join(' · ')}</>
}

// ─── Template: Classic ───────────────────────────────────────────────────────

function ClassicTemplate({ data }: { data: TailoredResume }) {
  return (
    <div style={{ fontFamily: 'Georgia, serif', color: '#111', fontSize: '13px', lineHeight: 1.6 }}>
      {/* Header */}
      <div style={{ textAlign: 'center', borderBottom: '2px solid #1a365d', paddingBottom: '12px', marginBottom: '16px' }}>
        <div style={{ fontSize: '24px', fontWeight: 700, color: '#1a365d', letterSpacing: '1px' }}>
          {data.contact.name}
        </div>
        <div style={{ fontSize: '13px', color: '#444', marginTop: '4px' }}>{data.contact.title}</div>
        <div style={{ fontSize: '11px', color: '#666', marginTop: '6px' }}>
          <ContactLine data={data.contact} />
        </div>
      </div>

      {/* Summary */}
      <Section title="PROFESSIONAL SUMMARY" accent="#1a365d">
        <p style={{ margin: 0 }}>{data.summary}</p>
      </Section>

      {/* Experience */}
      <Section title="EXPERIENCE" accent="#1a365d">
        {data.experience.map((exp, i) => (
          <div key={i} style={{ marginBottom: '14px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 700 }}>
              <span>{exp.role}</span><span style={{ color: '#555', fontWeight: 400, fontSize: '11px' }}>{exp.duration}</span>
            </div>
            <div style={{ color: '#1a365d', fontStyle: 'italic', marginBottom: '4px' }}>{exp.company}</div>
            <ul style={{ margin: '4px 0 0 16px', padding: 0 }}>
              {exp.bullets.map((b, j) => <li key={j} style={{ marginBottom: '3px' }}>{b}</li>)}
            </ul>
          </div>
        ))}
      </Section>

      {/* Skills */}
      <Section title="SKILLS" accent="#1a365d">
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
          {data.skills.map((s, i) => (
            <span key={i} style={{ background: '#eef2f7', padding: '2px 10px', borderRadius: '3px', fontSize: '12px' }}>{s}</span>
          ))}
        </div>
      </Section>

      {/* Education */}
      <Section title="EDUCATION" accent="#1a365d">
        {data.education.map((ed, i) => (
          <div key={i} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
            <div><strong>{ed.degree}</strong> — {ed.institution}</div>
            <div style={{ color: '#555', fontSize: '11px' }}>{ed.year}</div>
          </div>
        ))}
      </Section>

      {/* Certs */}
      {data.certifications.length > 0 && (
        <Section title="CERTIFICATIONS" accent="#1a365d">
          <ul style={{ margin: '0 0 0 16px', padding: 0 }}>
            {data.certifications.map((c, i) => <li key={i}>{c}</li>)}
          </ul>
        </Section>
      )}
    </div>
  )
}

// ─── Template: Modern (two-column) ──────────────────────────────────────────

function ModernTemplate({ data }: { data: TailoredResume }) {
  return (
    <div style={{ fontFamily: "'Segoe UI', Arial, sans-serif", color: '#111', fontSize: '13px', lineHeight: 1.6, display: 'grid', gridTemplateColumns: '220px 1fr', minHeight: '100%' }}>
      {/* Sidebar */}
      <div style={{ background: '#1e3a5f', color: '#fff', padding: '24px 16px' }}>
        <div style={{ fontSize: '18px', fontWeight: 700, marginBottom: '2px' }}>{data.contact.name}</div>
        <div style={{ fontSize: '12px', color: '#93c5fd', marginBottom: '16px' }}>{data.contact.title}</div>

        <SideSection title="CONTACT">
          {[data.contact.email, data.contact.phone, data.contact.location, data.contact.linkedin, data.contact.github]
            .filter(Boolean).map((v, i) => <div key={i} style={{ fontSize: '11px', marginBottom: '4px', wordBreak: 'break-all' }}>{v}</div>)}
        </SideSection>

        <SideSection title="SKILLS">
          {data.skills.map((s, i) => (
            <div key={i} style={{ fontSize: '11px', marginBottom: '4px', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#3b82f6', flexShrink: 0 }} />
              {s}
            </div>
          ))}
        </SideSection>

        {data.certifications.length > 0 && (
          <SideSection title="CERTIFICATIONS">
            {data.certifications.map((c, i) => <div key={i} style={{ fontSize: '11px', marginBottom: '4px' }}>• {c}</div>)}
          </SideSection>
        )}
      </div>

      {/* Main */}
      <div style={{ padding: '24px 20px' }}>
        <Section title="SUMMARY" accent="#2563eb">
          <p style={{ margin: 0 }}>{data.summary}</p>
        </Section>

        <Section title="EXPERIENCE" accent="#2563eb">
          {data.experience.map((exp, i) => (
            <div key={i} style={{ marginBottom: '14px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <strong>{exp.role}</strong>
                <span style={{ color: '#666', fontSize: '11px' }}>{exp.duration}</span>
              </div>
              <div style={{ color: '#2563eb', fontSize: '12px', marginBottom: '4px' }}>{exp.company}</div>
              <ul style={{ margin: '4px 0 0 16px', padding: 0 }}>
                {exp.bullets.map((b, j) => <li key={j} style={{ marginBottom: '3px' }}>{b}</li>)}
              </ul>
            </div>
          ))}
        </Section>

        <Section title="EDUCATION" accent="#2563eb">
          {data.education.map((ed, i) => (
            <div key={i} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
              <div><strong>{ed.degree}</strong> — {ed.institution}</div>
              <div style={{ color: '#666', fontSize: '11px' }}>{ed.year}</div>
            </div>
          ))}
        </Section>
      </div>
    </div>
  )
}

// ─── Template: Minimal ───────────────────────────────────────────────────────

function MinimalTemplate({ data }: { data: TailoredResume }) {
  return (
    <div style={{ fontFamily: "'Helvetica Neue', Arial, sans-serif", color: '#222', fontSize: '13px', lineHeight: 1.7 }}>
      <div style={{ marginBottom: '24px' }}>
        <div style={{ fontSize: '28px', fontWeight: 300, letterSpacing: '-0.5px' }}>{data.contact.name}</div>
        <div style={{ fontSize: '14px', color: '#666', marginTop: '2px' }}>{data.contact.title}</div>
        <div style={{ fontSize: '11px', color: '#999', marginTop: '6px' }}><ContactLine data={data.contact} /></div>
      </div>

      <div style={{ borderLeft: '2px solid #e5e7eb', paddingLeft: '16px', marginBottom: '20px', color: '#444', fontStyle: 'italic' }}>
        {data.summary}
      </div>

      <MinSection title="Experience">
        {data.experience.map((exp, i) => (
          <div key={i} style={{ marginBottom: '16px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ fontWeight: 600 }}>{exp.role} · <span style={{ fontWeight: 400, color: '#555' }}>{exp.company}</span></span>
              <span style={{ color: '#999', fontSize: '11px' }}>{exp.duration}</span>
            </div>
            <ul style={{ margin: '6px 0 0 16px', padding: 0, color: '#444' }}>
              {exp.bullets.map((b, j) => <li key={j} style={{ marginBottom: '2px' }}>{b}</li>)}
            </ul>
          </div>
        ))}
      </MinSection>

      <MinSection title="Skills">
        <div>{data.skills.join(' · ')}</div>
      </MinSection>

      <MinSection title="Education">
        {data.education.map((ed, i) => (
          <div key={i}><strong>{ed.degree}</strong>, {ed.institution} <span style={{ color: '#999' }}>({ed.year})</span></div>
        ))}
      </MinSection>

      {data.certifications.length > 0 && (
        <MinSection title="Certifications">
          <div>{data.certifications.join(' · ')}</div>
        </MinSection>
      )}
    </div>
  )
}

// ─── Template: Executive ─────────────────────────────────────────────────────

function ExecutiveTemplate({ data }: { data: TailoredResume }) {
  return (
    <div style={{ fontFamily: 'Georgia, serif', color: '#111', fontSize: '13px', lineHeight: 1.6 }}>
      {/* Bold header */}
      <div style={{ background: '#3b0764', color: '#fff', padding: '20px 24px', marginBottom: '20px' }}>
        <div style={{ fontSize: '26px', fontWeight: 700, letterSpacing: '0.5px' }}>{data.contact.name}</div>
        <div style={{ fontSize: '14px', color: '#d8b4fe', marginTop: '4px' }}>{data.contact.title}</div>
        <div style={{ fontSize: '11px', color: '#e9d5ff', marginTop: '8px', opacity: 0.85 }}>
          <ContactLine data={data.contact} />
        </div>
      </div>

      {/* Summary highlight */}
      <div style={{ background: '#faf5ff', border: '1px solid #e9d5ff', borderRadius: '6px', padding: '12px 16px', marginBottom: '18px', color: '#4c1d95' }}>
        {data.summary}
      </div>

      <Section title="CAREER EXPERIENCE" accent="#7c3aed">
        {data.experience.map((exp, i) => (
          <div key={i} style={{ marginBottom: '16px' }}>
            <div style={{ background: '#f5f3ff', padding: '6px 10px', borderLeft: '3px solid #7c3aed', marginBottom: '6px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <strong style={{ fontSize: '13px' }}>{exp.role}</strong>
                <span style={{ color: '#666', fontSize: '11px' }}>{exp.duration}</span>
              </div>
              <div style={{ color: '#7c3aed', fontSize: '12px' }}>{exp.company}</div>
            </div>
            <ul style={{ margin: '0 0 0 16px', padding: 0 }}>
              {exp.bullets.map((b, j) => <li key={j} style={{ marginBottom: '3px' }}>{b}</li>)}
            </ul>
          </div>
        ))}
      </Section>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
        <Section title="CORE COMPETENCIES" accent="#7c3aed">
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
            {data.skills.map((s, i) => (
              <span key={i} style={{ background: '#ede9fe', color: '#4c1d95', padding: '2px 8px', borderRadius: '3px', fontSize: '11px' }}>{s}</span>
            ))}
          </div>
        </Section>

        <div>
          <Section title="EDUCATION" accent="#7c3aed">
            {data.education.map((ed, i) => (
              <div key={i} style={{ marginBottom: '6px' }}>
                <strong>{ed.degree}</strong><br />
                <span style={{ color: '#555', fontSize: '12px' }}>{ed.institution} · {ed.year}</span>
              </div>
            ))}
          </Section>
          {data.certifications.length > 0 && (
            <Section title="CERTIFICATIONS" accent="#7c3aed">
              {data.certifications.map((c, i) => <div key={i} style={{ fontSize: '12px', marginBottom: '3px' }}>• {c}</div>)}
            </Section>
          )}
        </div>
      </div>
    </div>
  )
}

// ─── Shared sub-components ───────────────────────────────────────────────────

function Section({ title, accent, children }: { title: string; accent: string; children: React.ReactNode }) {
  return (
    <div style={{ marginBottom: '16px' }}>
      <div style={{ fontSize: '11px', fontWeight: 700, letterSpacing: '1px', color: accent, borderBottom: `1px solid ${accent}`, paddingBottom: '3px', marginBottom: '8px' }}>
        {title}
      </div>
      {children}
    </div>
  )
}

function SideSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div style={{ marginBottom: '16px' }}>
      <div style={{ fontSize: '10px', fontWeight: 700, letterSpacing: '1px', color: '#93c5fd', borderBottom: '1px solid #2d5a8e', paddingBottom: '3px', marginBottom: '8px' }}>
        {title}
      </div>
      {children}
    </div>
  )
}

function MinSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div style={{ marginBottom: '16px' }}>
      <div style={{ fontSize: '10px', fontWeight: 700, letterSpacing: '1.5px', textTransform: 'uppercase', color: '#9ca3af', marginBottom: '8px' }}>
        {title}
      </div>
      {children}
    </div>
  )
}

// ─── Main export ─────────────────────────────────────────────────────────────

export default function ResumePreview({ data, templateId, onBack }: Props) {
  const previewRef = useRef<HTMLDivElement>(null)

  const handleDownload = () => {
    const content = previewRef.current?.innerHTML ?? ''
    const html = `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8"/>
  <title>${data.contact.name} — Resume</title>
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body { margin: 0; padding: 24px; background: #fff; visibility: hidden; }
    @media print { body { padding: 0; visibility: visible; } }
    @page { size: A4; margin: 14mm; }

    ul { padding-left: 18px; }
    li { margin-bottom: 3px; }
  </style>
</head>
<body>${content}</body>
</html>`
    const win = window.open('', '_blank')
    if (!win) return
    win.document.write(html)
    win.document.close()
    win.onload = () => {
      win.focus()
      win.print()
      win.onafterprint = () => win.close()
    }
  }

  const TemplateComponent = {
    classic: ClassicTemplate,
    modern: ModernTemplate,
    minimal: MinimalTemplate,
    executive: ExecutiveTemplate,
  }[templateId]

  return (
    <div className="section">
      <div className="section-header-row" style={{ marginBottom: '1rem' }}>
        <h3 className="section-title">📋 Your Tailored Resume</h3>
        <div style={{ display: 'flex', gap: '8px' }}>
          <button className="btn-secondary" onClick={onBack}>← Change Template</button>
          <button className="btn-primary" style={{ width: 'auto', padding: '8px 20px', fontSize: '13px' }} onClick={handleDownload}>
            ⬇ Download PDF
          </button>
        </div>
      </div>

      <p className="section-sub">
        Click <strong>Download PDF</strong> → your browser's print dialog opens → select "Save as PDF".
      </p>

      {/* Resume preview box */}
      <div style={{ border: '1px solid var(--border)', borderRadius: '8px', overflow: 'hidden', background: '#fff' }}>
        <div ref={previewRef} style={{ padding: '32px', minHeight: '600px' }}>
          <TemplateComponent data={data} />
        </div>
      </div>
    </div>
  )
}
