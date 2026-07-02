import Groq from 'groq-sdk'
import type { TailoredResume } from './resumeTypes'
import type { AnalysisResult } from './types'

export async function tailorResume(
  groqApiKey: string,
  originalResume: string,
  jobDescription: string,
  analysis: AnalysisResult
): Promise<TailoredResume> {
  const client = new Groq({ apiKey: groqApiKey, dangerouslyAllowBrowser: true })

  const tailorPrompt = `
You are a professional resume writer. Your job is to rewrite and restructure a resume so it is perfectly tailored to a specific job description.

You have already performed an ATS analysis. Use the insights below to improve the resume.

ATS ANALYSIS INSIGHTS:
- ATS Score: ${analysis.ats_score}/100
- Missing critical keywords to add: ${analysis.missing_keywords.filter(k => k.importance === 'critical').map(k => k.keyword).join(', ')}
- Missing recommended keywords to weave in: ${analysis.missing_keywords.filter(k => k.importance === 'recommended').map(k => k.keyword).join(', ')}
- Improved bullet points to use: ${JSON.stringify(analysis.bullet_rewrites)}

INSTRUCTIONS:
1. Extract all existing information from the original resume (do not invent companies, roles, or degrees)
2. Rewrite bullet points using STAR format — strong action verbs, quantified where possible
3. Naturally weave in missing keywords from the JD (do not keyword-stuff)
4. Write a tailored professional summary targeting this specific role
5. Reorder skills to put JD-relevant ones first

Return ONLY a valid JSON object. No markdown, no code fences, no extra text.

{
  "contact": {
    "name": "<full name>",
    "title": "<job title from JD — the role they're applying for>",
    "email": "<email from resume>",
    "phone": "<phone from resume>",
    "location": "<city, country>",
    "linkedin": "<linkedin url if present, else empty string>",
    "github": "<github url if present, else empty string>"
  },
  "summary": "<3-4 sentence tailored professional summary. Start with years of experience and core strength. End with value proposition for this specific role.>",
  "skills": ["<skill1>", "<skill2>", "...  — put JD-matching skills first, max 16 skills"],
  "experience": [
    {
      "company": "<company name>",
      "role": "<job title>",
      "duration": "<e.g. Jan 2022 — Present>",
      "bullets": [
        "<rewritten bullet 1 — action verb + impact + metric>",
        "<rewritten bullet 2>",
        "<rewritten bullet 3>",
        "<rewritten bullet 4 if applicable>"
      ]
    }
  ],
  "education": [
    {
      "degree": "<degree name>",
      "institution": "<university name>",
      "year": "<graduation year or date range>"
    }
  ],
  "certifications": ["<cert 1>", "<cert 2>"]
}

ORIGINAL RESUME:
${originalResume}

JOB DESCRIPTION:
${jobDescription}
`.trim()

  const completion = await client.chat.completions.create({
    model: 'llama-3.3-70b-versatile',
    messages: [{ role: 'user' as const, content: tailorPrompt }],
    max_tokens: 5000,
    temperature: 0.2,
  })

  const raw = completion.choices[0]?.message?.content?.trim() ?? ''
  const cleaned = raw.replace(/^```json\s*/i, '').replace(/\s*```$/i, '').trim()

  try {
    return JSON.parse(cleaned) as TailoredResume
  } catch {
    throw new Error('Failed to generate tailored resume. Please try again.')
  }
}
