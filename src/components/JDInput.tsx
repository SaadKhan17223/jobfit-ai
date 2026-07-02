interface Props {
  value: string
  onChange: (text: string) => void
}

export default function JDInput({ value, onChange }: Props) {
  return (
    <div className="card">
      <div className="card-header">
        <h2>💼 Job Description</h2>
        {value && (
          <span className="word-count">{value.split(/\s+/).filter(Boolean).length} words</span>
        )}
      </div>
      <textarea
        className="text-area"
        placeholder="Paste the full job description here — include requirements, responsibilities, and preferred qualifications for best results…"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        rows={12}
      />
    </div>
  )
}
