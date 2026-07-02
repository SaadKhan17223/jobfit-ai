import Groq from 'groq-sdk'
import type { AnalysisResult } from './types'

function buildAnalysisPrompt(resumeText: string, jobDescription: string): string {
  return `
You are a senior ATS (Applicant Tracking System) expert and career coach with 15 years of experience.

Analyze the resume against the job description below. Be honest and specific.
Return ONLY a valid JSON object — no markdown, no code fences, no extra text.

JSON structure to return:
{
  "ats_score": <integer 0-100 representing how well the resume matches the JD>,
  "summary": "<2-3 sentence honest assessment of fit>",
  "matched_keywords": ["<keyword found in both resume and JD>"],
  "missing_keywords": [
    { "keyword": "<missing term>", "importance": "critical" | "recommended" }
  ],
  "skills_gap": [
    {
      "skill": "<skill name>",
      "importance": "high" | "medium" | "low",
      "how_to_show": "<specific advice on how to demonstrate this in the resume>"
    }
  ],
  "bullet_rewrites": [
    {
      "original": "<copy an actual weak bullet from the resume>",
      "improved": "<rewritten version: action verb + metric + impact, tailored to JD>"
    }
  ],
  "cover_letter": "<a complete, tailored cover letter for this specific role. 3 paragraphs. Professional but not generic.>"
}

Rules:
- ats_score must reflect keyword density, title match, experience match, and skill alignment
- matched_keywords: list only keywords that genuinely appear in BOTH documents
- missing_keywords: include tech skills, tools, methodologies, and soft skills mentioned in JD but absent from resume
- bullet_rewrites: pick the 3 weakest bullets from the resume and rewrite them using STAR format with quantifiable impact
- cover_letter: address the company/role specifically, reference 2-3 things from the JD, do not start with "I am writing to..."
- Return ONLY the JSON. No explanation before or after.

--- RESUME ---
${resumeText}

--- JOB DESCRIPTION ---
${jobDescription}
`.trim()
}

export async function analyzeResume(
  groqApiKey: string,
  resumeText: string,
  jobDescription: string
): Promise<AnalysisResult> {
  if (!groqApiKey.trim()) throw new Error('Groq API key is required.')
  if (!resumeText.trim()) throw new Error('Resume text is empty.')
  if (!jobDescription.trim()) throw new Error('Job description is empty.')

  const client = new Groq({ apiKey: groqApiKey, dangerouslyAllowBrowser: true })

  const analysisPrompt = buildAnalysisPrompt(resumeText, jobDescription)

  const completion = await client.chat.completions.create({
    model: 'llama-3.3-70b-versatile',
    messages: [{ role: 'user' as const, content: analysisPrompt }],
    max_tokens: 4000,
    temperature: 0.3,
  })

  const raw = completion.choices[0]?.message?.content?.trim() ?? ''
  const cleaned = raw.replace(/^```json\s*/i, '').replace(/\s*```$/i, '').trim()

  try {
    const parsed = JSON.parse(cleaned) as AnalysisResult
    parsed.ats_score = Math.min(100, Math.max(0, Math.round(parsed.ats_score)))
    return parsed
  } catch {
    throw new Error('Failed to parse response. Please try again.')
  }
}
